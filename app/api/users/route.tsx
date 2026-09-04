import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  try {
    // Check if user already exists
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    // If not then create new user
    if (existingUsers.length === 0) {
      const result = await db
        .insert(users)
        .values({
          name: user?.fullName || user?.firstName || "Unknown",
          email: userEmail,
          credits: 10,
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(existingUsers[0]);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
