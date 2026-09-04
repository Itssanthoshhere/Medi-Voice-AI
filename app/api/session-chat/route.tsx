import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const { sessionId, notes, doctorAgent, selectedDoctor } = await req.json();

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentSessionId = sessionId || crypto.randomUUID();

    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: currentSessionId,
        notes: notes,
        doctorAgent: doctorAgent || selectedDoctor,
        createdBy: userEmail,
        createdOn: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const result = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(result[0] || null);
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
        { status: 400 },
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
