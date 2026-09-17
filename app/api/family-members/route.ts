import { db } from "@/config/db";
import { familyMembersTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email");

    let userEmail = queryEmail;
    let userName = "Primary User";

    try {
      const user = await currentUser();
      if (user?.primaryEmailAddress?.emailAddress) {
        userEmail = user.primaryEmailAddress.emailAddress;
        userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || userEmail.split("@")[0];
      }
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    // 1. Fetch existing family members
    let members = await db
      .select()
      .from(familyMembersTable)
      .where(eq(familyMembersTable.primaryUserEmail, userEmail));

    // 2. Ensure default "Self" member exists if first time
    const hasSelf = members.some((m) => m.relationship === "Self");
    if (!hasSelf) {
      const selfMember = await db
        .insert(familyMembersTable)
        .values({
          memberId: `self_${uuidv4()}`,
          primaryUserEmail: userEmail,
          name: userName || "Self",
          relationship: "Self",
          createdAt: new Date().toISOString(),
        })
        .returning();

      members = [selfMember[0], ...members];
    }

    return NextResponse.json(members);
  } catch (err: any) {
    console.error("GET /api/family-members error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let userEmail: string | undefined = undefined;
    try {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      relationship,
      age,
      gender,
      bloodGroup,
      allergies,
      medicalHistory,
    } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Member name is required" },
        { status: 400 }
      );
    }

    const memberId = uuidv4();
    const result = await db
      .insert(familyMembersTable)
      .values({
        memberId,
        primaryUserEmail: userEmail,
        name: name.trim(),
        relationship: relationship || "Other",
        age: age ? Number(age) : null,
        gender: gender || "Unspecified",
        bloodGroup: bloodGroup || "O+",
        allergies: allergies || "None",
        medicalHistory: medicalHistory || "None",
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (err: any) {
    console.error("POST /api/family-members error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    let userEmail: string | undefined = undefined;
    try {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      memberId,
      name,
      relationship,
      age,
      gender,
      bloodGroup,
      allergies,
      medicalHistory,
    } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .update(familyMembersTable)
      .set({
        name: name ? name.trim() : undefined,
        relationship: relationship || undefined,
        age: age !== undefined ? (age ? Number(age) : null) : undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || undefined,
        allergies: allergies !== undefined ? allergies : undefined,
        medicalHistory: medicalHistory !== undefined ? medicalHistory : undefined,
      })
      .where(
        and(
          eq(familyMembersTable.memberId, memberId),
          eq(familyMembersTable.primaryUserEmail, userEmail)
        )
      )
      .returning();

    return NextResponse.json(result[0]);
  } catch (err: any) {
    console.error("PUT /api/family-members error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let userEmail: string | undefined = undefined;
    try {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // Do not allow deleting "Self" profile
    const existing = await db
      .select()
      .from(familyMembersTable)
      .where(
        and(
          eq(familyMembersTable.memberId, memberId),
          eq(familyMembersTable.primaryUserEmail, userEmail)
        )
      );

    if (existing[0]?.relationship === "Self") {
      return NextResponse.json(
        { error: "Cannot delete primary Self profile" },
        { status: 403 }
      );
    }

    await db
      .delete(familyMembersTable)
      .where(
        and(
          eq(familyMembersTable.memberId, memberId),
          eq(familyMembersTable.primaryUserEmail, userEmail)
        )
      );

    return NextResponse.json({ success: true, deletedMemberId: memberId });
  } catch (err: any) {
    console.error("DELETE /api/family-members error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
