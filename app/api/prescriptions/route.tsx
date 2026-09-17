import { db } from "@/config/db";
import { prescriptionsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email");
    const familyMemberId = searchParams.get("familyMemberId");
    const status = searchParams.get("status");

    let userEmail = queryEmail;
    const user = await currentUser();
    if (user?.primaryEmailAddress?.emailAddress) {
      userEmail = user.primaryEmailAddress.emailAddress;
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    const conditions = [eq(prescriptionsTable.primaryUserEmail, userEmail)];

    if (familyMemberId && familyMemberId !== "all") {
      conditions.push(eq(prescriptionsTable.familyMemberId, familyMemberId));
    }

    if (status && status !== "all") {
      conditions.push(eq(prescriptionsTable.status, status));
    }

    const prescriptions = await db
      .select()
      .from(prescriptionsTable)
      .where(and(...conditions))
      .orderBy(desc(prescriptionsTable.id));

    return NextResponse.json(prescriptions);
  } catch (err: any) {
    console.error("GET /api/prescriptions error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    let userEmail = user?.primaryEmailAddress?.emailAddress;

    const body = await req.json();
    const {
      familyMemberId,
      patientName,
      doctorId,
      doctorName,
      specialization,
      medicationName,
      dosage,
      frequency,
      timing,
      startDate,
      endDate,
      totalDays,
      instructions,
      refillsRemaining,
    } = body;

    if (!userEmail && body.userEmail) {
      userEmail = body.userEmail;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!medicationName || !dosage) {
      return NextResponse.json(
        { error: "Medication name and dosage are required" },
        { status: 400 }
      );
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

    const prescriptionId = `rx_${uuidv4().substring(0, 8)}`;
    const todayStr = new Date().toISOString().split("T")[0];

    const newRx = await db
      .insert(prescriptionsTable)
      .values({
        prescriptionId,
        primaryUserEmail: userEmail,
        familyMemberId: familyMemberId || null,
        patientName: patientName || "Primary User",
        doctorId: doctorId || "general-physician",
        doctorName: doctorName || "Dr. Elliot",
        specialization: specialization || "General Physician",
        medicationName,
        dosage,
        frequency: frequency || "Twice Daily",
        timing: timing || "After Meals",
        startDate: startDate || todayStr,
        endDate: endDate || null,
        totalDays: totalDays ? Number(totalDays) : 7,
        instructions: instructions || "Take as prescribed.",
        refillsRemaining: refillsRemaining !== undefined ? Number(refillsRemaining) : 1,
        status: "Active",
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newRx[0]);
  } catch (err: any) {
    console.error("POST /api/prescriptions error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prescriptionId, status, lastTakenAt, refillsRemaining, instructions } = await req.json();

    if (!prescriptionId) {
      return NextResponse.json(
        { error: "Prescription ID is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(prescriptionsTable)
      .set({
        status: status || undefined,
        lastTakenAt: lastTakenAt || undefined,
        refillsRemaining: refillsRemaining !== undefined ? Number(refillsRemaining) : undefined,
        instructions: instructions !== undefined ? instructions : undefined,
      })
      .where(
        and(
          eq(prescriptionsTable.prescriptionId, prescriptionId),
          eq(prescriptionsTable.primaryUserEmail, userEmail)
        )
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: "Prescription not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (err: any) {
    console.error("PATCH /api/prescriptions error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const prescriptionId = searchParams.get("prescriptionId");

    if (!prescriptionId) {
      return NextResponse.json(
        { error: "Prescription ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(prescriptionsTable)
      .where(
        and(
          eq(prescriptionsTable.prescriptionId, prescriptionId),
          eq(prescriptionsTable.primaryUserEmail, userEmail)
        )
      );

    return NextResponse.json({ success: true, prescriptionId });
  } catch (err: any) {
    console.error("DELETE /api/prescriptions error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
