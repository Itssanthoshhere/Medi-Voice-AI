import { db } from "@/config/db";
import { vitalsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email");
    const familyMemberId = searchParams.get("familyMemberId");

    let userEmail = queryEmail;
    try {
      const user = await currentUser();
      if (user?.primaryEmailAddress?.emailAddress) {
        userEmail = user.primaryEmailAddress.emailAddress;
      }
    } catch {
      // Clerk user unauthenticated or missing
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    const conditions = [eq(vitalsTable.primaryUserEmail, userEmail)];

    if (familyMemberId && familyMemberId !== "all") {
      conditions.push(eq(vitalsTable.familyMemberId, familyMemberId));
    }

    const vitals = await db
      .select()
      .from(vitalsTable)
      .where(and(...conditions))
      .orderBy(desc(vitalsTable.id));

    return NextResponse.json(vitals);
  } catch (err: any) {
    console.error("GET /api/vitals error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let userEmail: string | undefined = undefined;
    let user: any = null;
    try {
      user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress;
    } catch {
      // Clerk unauthenticated
    }

    const body = await req.json();
    const {
      familyMemberId,
      patientName,
      heartRate,
      bpSystolic,
      bpDiastolic,
      bloodOxygen,
      temperature,
      bloodGlucose,
      notes,
    } = body;

    if (!userEmail && body.userEmail) {
      userEmail = body.userEmail;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Evaluate clinical anomaly status
    let calculatedStatus = "Normal";
    const hr = heartRate ? Number(heartRate) : null;
    const sys = bpSystolic ? Number(bpSystolic) : null;
    const dia = bpDiastolic ? Number(bpDiastolic) : null;
    const spo2 = bloodOxygen ? Number(bloodOxygen) : null;
    const glu = bloodGlucose ? Number(bloodGlucose) : null;

    if (
      (sys && sys >= 140) ||
      (dia && dia >= 90) ||
      (hr && hr >= 105) ||
      (spo2 && spo2 < 94) ||
      (glu && glu >= 180)
    ) {
      calculatedStatus = "Warning";
    } else if (
      (sys && sys >= 130) ||
      (dia && dia >= 85) ||
      (hr && hr >= 90) ||
      (glu && glu >= 140)
    ) {
      calculatedStatus = "Elevated";
    }

    // Ensure primary user exists
    const dbUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!dbUsers.length) {
      const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || userEmail.split("@")[0];
      await db.insert(usersTable).values({
        email: userEmail,
        name: userName,
      });
    }

    const vitalId = `vital_${uuidv4().substring(0, 8)}`;
    const nowISO = new Date().toISOString();

    const newVital = await db
      .insert(vitalsTable)
      .values({
        vitalId,
        primaryUserEmail: userEmail,
        familyMemberId: familyMemberId || null,
        patientName: patientName || "Primary User",
        heartRate: hr,
        bpSystolic: sys,
        bpDiastolic: dia,
        bloodOxygen: spo2,
        temperature: temperature || "98.6",
        bloodGlucose: glu,
        status: calculatedStatus,
        notes: notes || null,
        recordedAt: nowISO,
        createdAt: nowISO,
      })
      .returning();

    return NextResponse.json(newVital[0]);
  } catch (err: any) {
    console.error("POST /api/vitals error:", err);
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
    const vitalId = searchParams.get("vitalId");

    if (!vitalId) {
      return NextResponse.json(
        { error: "Vital ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(vitalsTable)
      .where(
        and(
          eq(vitalsTable.vitalId, vitalId),
          eq(vitalsTable.primaryUserEmail, userEmail)
        )
      );

    return NextResponse.json({ success: true, vitalId });
  } catch (err: any) {
    console.error("DELETE /api/vitals error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
