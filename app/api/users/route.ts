import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { usersTable as users } from "@/config/schema";
import { eq } from "drizzle-orm";

const formatUser = (userRecord: any, defaultPlan = "free") => ({
  id: userRecord?.id,
  name: userRecord?.name,
  email: userRecord?.email,
  credits: userRecord?.credits ?? 10,
  plan: userRecord?.plan || defaultPlan,
  bloodGroup: userRecord?.bloodGroup || "O+",
  allergies: userRecord?.allergies || "",
  emergencyContact: userRecord?.emergencyContact || "",
  preferredVoice: userRecord?.preferredVoice || "Elliot (Male - Warm)",
});

export async function POST(req: NextRequest) {
  try {
    let user: any = null;
    let userEmail: string | undefined = undefined;
    try {
      user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    if (existingUsers.length > 0) {
      return NextResponse.json({
        ...formatUser(existingUsers[0]),
        isNewUser: false,
      });
    }

    const result = await db
      .insert(users)
      .values({
        name: user?.fullName || user?.firstName || "Unknown",
        email: userEmail,
        credits: 10,
        plan: "free",
        bloodGroup: "O+",
        allergies: "None",
        emergencyContact: "",
        preferredVoice: "Elliot (Male - Warm)",
      })
      .returning();

    return NextResponse.json({
      ...formatUser(result[0]),
      isNewUser: true,
    });
  } catch (e) {
    console.error("POST /api/users error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    let userEmail: string | undefined = undefined;
    try {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(formatUser(result[0]));
  } catch (e) {
    console.error("GET /api/users error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
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
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.plan !== undefined) updateData.plan = body.plan;
    if (body.credits !== undefined) updateData.credits = body.credits;
    if (body.bloodGroup !== undefined) updateData.bloodGroup = body.bloodGroup;
    if (body.allergies !== undefined) updateData.allergies = body.allergies;
    if (body.emergencyContact !== undefined) updateData.emergencyContact = body.emergencyContact;
    if (body.preferredVoice !== undefined) updateData.preferredVoice = body.preferredVoice;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.email, userEmail))
      .returning();

    return NextResponse.json(formatUser(updatedUser[0]));
  } catch (e) {
    console.error("PUT /api/users error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
