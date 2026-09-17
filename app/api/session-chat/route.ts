import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { desc, eq, and } from "drizzle-orm";

import { usersTable } from "@/config/schema";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor, familyMemberId } = await req.json();
  let userEmail: string | undefined = undefined;
  try {
    const user = await currentUser();
    userEmail = user?.primaryEmailAddress?.emailAddress;
  } catch {
    // unauthenticated
  }

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch user record to check plan & credits
    const dbUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    const userRecord = dbUsers[0];
    const userCredits = userRecord?.credits ?? 10;
    const userPlan = (userRecord?.plan || "free").toLowerCase();

    // 2. Check specialist subscription requirement
    if (selectedDoctor?.subscriptionRequired && userPlan === "free") {
      return NextResponse.json(
        {
          error: "SUBSCRIPTION_REQUIRED",
          message:
            "This specialist AI doctor requires a Pro or Clinic subscription.",
        },
        { status: 403 }
      );
    }

    // 3. Check credits if user is on free or pro plan
    if (userPlan !== "clinic" && userCredits <= 0) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_CREDITS",
          message:
            "You have run out of consultation credits. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    // 4. Create new consultation session
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: userEmail,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
        familyMemberId: familyMemberId || null,
      })
      .returning();

    // 5. Deduct 1 credit if not on unlimited clinic plan
    if (userPlan !== "clinic" && userRecord) {
      await db
        .update(usersTable)
        .set({
          credits: Math.max(0, userCredits - 1),
        })
        .where(eq(usersTable.email, userEmail));
    }

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("POST /api/session-chat error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const familyMemberId = searchParams.get("familyMemberId");

    if (sessionId) {
      const result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionId, sessionId));

      return NextResponse.json(result[0] || null);
    }

    // If no sessionId is provided, fetch all sessions for the current logged-in user
    let userEmail: string | undefined = undefined;
    try {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    let queryCondition = eq(SessionChatTable.createdBy, userEmail);
    if (familyMemberId && familyMemberId !== "all") {
      queryCondition = and(
        eq(SessionChatTable.createdBy, userEmail),
        eq(SessionChatTable.familyMemberId, familyMemberId)
      ) as any;
    }

    const sessions = await db
      .select()
      .from(SessionChatTable)
      .where(queryCondition)
      .orderBy(desc(SessionChatTable.id));

    return NextResponse.json(sessions);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sessionId, conversation } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .update(SessionChatTable)
      .set({
        conversation: conversation,
      })
      .where(eq(SessionChatTable.sessionId, sessionId))
      .returning();

    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
