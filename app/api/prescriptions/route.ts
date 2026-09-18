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

    const conditions = [eq(prescriptionsTable.primaryUserEmail, userEmail)];

    if (familyMemberId && familyMemberId !== "all") {
      conditions.push(eq(prescriptionsTable.familyMemberId, familyMemberId));
    }

    if (status && status !== "all") {
      conditions.push(eq(prescriptionsTable.status, status));
    }

    let prescriptions = await db
      .select()
      .from(prescriptionsTable)
      .where(and(...conditions))
      .orderBy(desc(prescriptionsTable.id));

    const forceSeed = searchParams.get("seed") === "true";

    if (
      (prescriptions.length === 0 || forceSeed) &&
      (!status || status === "Active" || status === "all") &&
      (!familyMemberId || familyMemberId === "all")
    ) {
      try {
        const dbUsers = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, userEmail));

        const patientName = dbUsers[0]?.name || userEmail.split("@")[0];
        const todayStr = new Date().toISOString().split("T")[0];

        await db.insert(prescriptionsTable).values([
          {
            prescriptionId: `rx_seed_${Date.now()}_1`,
            primaryUserEmail: userEmail,
            patientName: patientName,
            doctorId: "general-physician",
            doctorName: "Dr. Elliot",
            specialization: "General Physician",
            medicationName: "Amoxicillin 500mg",
            dosage: "1 Capsule (500mg)",
            frequency: "Twice Daily",
            timing: "After Meals - Morning & Night",
            startDate: todayStr,
            totalDays: 7,
            dosesTaken: 1,
            instructions: "Take 1 capsule twice daily after breakfast and dinner with warm water. Complete full 7-day course.",
            refillsRemaining: 1,
            status: "Active",
            createdAt: new Date().toISOString(),
          },
          {
            prescriptionId: `rx_seed_${Date.now()}_2`,
            primaryUserEmail: userEmail,
            patientName: patientName,
            doctorId: "endocrinologist",
            doctorName: "Dr. Priya Sharma",
            specialization: "Endocrinologist",
            medicationName: "Metformin 500mg (Glucophage)",
            dosage: "1 Tablet (500mg)",
            frequency: "Twice Daily",
            timing: "Before Meals - Morning & Evening",
            startDate: todayStr,
            totalDays: 30,
            dosesTaken: 4,
            instructions: "Take 1 tablet twice daily before breakfast and dinner. Log daily fasting blood sugar readings.",
            refillsRemaining: 2,
            status: "Active",
            createdAt: new Date().toISOString(),
          },
          {
            prescriptionId: `rx_seed_${Date.now()}_3`,
            primaryUserEmail: userEmail,
            patientName: patientName,
            doctorId: "gastroenterologist",
            doctorName: "Dr. Rajesh Kumar",
            specialization: "Gastroenterologist",
            medicationName: "Pantoprazole 40mg (Pan-40)",
            dosage: "1 Tablet (40mg)",
            frequency: "Once Daily",
            timing: "Empty Stomach - Morning",
            startDate: todayStr,
            totalDays: 14,
            dosesTaken: 3,
            instructions: "Take 1 tablet on an empty stomach 30 minutes before breakfast with a full glass of water.",
            refillsRemaining: 1,
            status: "Active",
            createdAt: new Date().toISOString(),
          },
          {
            prescriptionId: `rx_seed_${Date.now()}_4`,
            primaryUserEmail: userEmail,
            patientName: patientName,
            doctorId: "cardiologist",
            doctorName: "Dr. Sid",
            specialization: "Cardiologist",
            medicationName: "Atorvastatin 10mg",
            dosage: "1 Tablet",
            frequency: "Once Daily",
            timing: "Night Before Bed",
            startDate: todayStr,
            totalDays: 30,
            dosesTaken: 2,
            instructions: "Take 1 tablet at night before sleep. Monitor lipid panel after 4 weeks.",
            refillsRemaining: 3,
            status: "Active",
            createdAt: new Date().toISOString(),
          },
          {
            prescriptionId: `rx_seed_${Date.now()}_5`,
            primaryUserEmail: userEmail,
            patientName: patientName,
            doctorId: "general-physician",
            doctorName: "Dr. Elliot",
            specialization: "General Physician",
            medicationName: "Azithromycin 500mg (Azithral)",
            dosage: "1 Tablet (500mg)",
            frequency: "Once Daily",
            timing: "After Lunch",
            startDate: todayStr,
            totalDays: 5,
            dosesTaken: 5,
            instructions: "5-day antibiotic course completed for upper respiratory tract infection.",
            refillsRemaining: 0,
            status: "Completed",
            createdAt: new Date().toISOString(),
          },
        ]);

        prescriptions = await db
          .select()
          .from(prescriptionsTable)
          .where(and(...conditions))
          .orderBy(desc(prescriptionsTable.id));
      } catch (seedErr) {
        console.error("Auto-seed prescriptions warning:", seedErr);
      }
    }

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
      dosesTaken,
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
        totalDays: totalDays ? Number(totalDays) : 30,
        dosesTaken: dosesTaken !== undefined ? Number(dosesTaken) : 0,
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

    const { prescriptionId, status, lastTakenAt, dosesTaken, refillsRemaining, instructions } = await req.json();

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
        dosesTaken: dosesTaken !== undefined ? Number(dosesTaken) : undefined,
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
