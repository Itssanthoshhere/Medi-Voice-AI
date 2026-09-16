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
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

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
      return NextResponse.json(formatUser(existingUsers[0]));
    }

    const result = await db
      .insert(users)
      .values({
        name: user?.fullName || user?.firstName || "Unknown",
        email: userEmail,
        credits: 10,
        plan: "free",
      })
      .returning();

    return NextResponse.json(formatUser(result[0]));
  } catch (e) {
    console.error("POST /api/users error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

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
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const { plan, credits } = await req.json();
    const targetPlan = plan || "free";
    const targetCredits =
      credits !== undefined
        ? credits
        : targetPlan === "clinic"
        ? 9999
        : targetPlan === "pro"
        ? 100
        : 10;

    const updatedUser = await db
      .update(users)
      .set({
        plan: targetPlan,
        credits: targetCredits,
      })
      .where(eq(users.email, userEmail))
      .returning();

    return NextResponse.json(formatUser(updatedUser[0], targetPlan));
  } catch (e) {
    console.error("PUT /api/users error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
