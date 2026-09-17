import { db } from "@/config/db";
import { appointmentsTable, usersTable } from "@/config/schema";
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
      // Clerk user missing or unauthenticated
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    const conditions = [eq(appointmentsTable.primaryUserEmail, userEmail)];

    if (familyMemberId && familyMemberId !== "all") {
      conditions.push(eq(appointmentsTable.familyMemberId, familyMemberId));
    }

    if (status && status !== "all") {
      conditions.push(eq(appointmentsTable.status, status));
    }

    const appointments = await db
      .select()
      .from(appointmentsTable)
      .where(and(...conditions))
      .orderBy(desc(appointmentsTable.id));

    return NextResponse.json(appointments);
  } catch (err: any) {
    console.error("GET /api/appointments error:", err);
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
      appointmentDate,
      timeSlot,
      consultationType,
      chiefComplaint,
    } = body;

    if (!userEmail && body.userEmail) {
      userEmail = body.userEmail;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!doctorId || !appointmentDate || !timeSlot || !specialization) {
      return NextResponse.json(
        { error: "Missing required appointment fields (doctorId, appointmentDate, timeSlot, specialization)" },
        { status: 400 }
      );
    }

    // Ensure primary user exists in usersTable
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (!existingUsers.length) {
      const userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || userEmail.split("@")[0];
      await db.insert(usersTable).values({
        email: userEmail,
        name: userName,
      });
    }

    // Check for double booking
    const existingBookings = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.appointmentDate, appointmentDate),
          eq(appointmentsTable.timeSlot, timeSlot),
          eq(appointmentsTable.status, "Scheduled")
        )
      );

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: "This time slot is already booked for the selected doctor. Please choose another slot." },
        { status: 409 }
      );
    }

    const appointmentId = `apt_${uuidv4().substring(0, 8)}`;

    const newAppointment = await db
      .insert(appointmentsTable)
      .values({
        appointmentId,
        primaryUserEmail: userEmail,
        familyMemberId: familyMemberId || null,
        patientName: patientName || "Primary User",
        doctorId,
        doctorName: doctorName || "Specialist Doctor",
        specialization,
        appointmentDate,
        timeSlot,
        consultationType: consultationType || "Voice AI Consultation",
        status: "Scheduled",
        chiefComplaint: chiefComplaint || "General consultation",
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newAppointment[0]);
  } catch (err: any) {
    console.error("POST /api/appointments error:", err);
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

    const { appointmentId, status, chiefComplaint, appointmentDate, timeSlot } = await req.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Fetch target appointment first to verify ownership and doctor ID
    const existing = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.appointmentId, appointmentId),
          eq(appointmentsTable.primaryUserEmail, userEmail)
        )
      );

    if (!existing.length) {
      return NextResponse.json(
        { error: "Appointment not found or unauthorized" },
        { status: 404 }
      );
    }

    const currentApt = existing[0];

    // If rescheduling to a new date/time slot, check for slot conflicts
    if (appointmentDate && timeSlot) {
      const targetDoctorId = currentApt.doctorId;
      const conflicts = await db
        .select()
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.doctorId, targetDoctorId),
            eq(appointmentsTable.appointmentDate, appointmentDate),
            eq(appointmentsTable.timeSlot, timeSlot),
            eq(appointmentsTable.status, "Scheduled")
          )
        );

      // Exclude self from conflict check
      const actualConflict = conflicts.find((c) => c.appointmentId !== appointmentId);

      if (actualConflict) {
        return NextResponse.json(
          { error: "The selected date & time slot is already booked for this doctor. Please pick another slot." },
          { status: 409 }
        );
      }
    }

    const updated = await db
      .update(appointmentsTable)
      .set({
        appointmentDate: appointmentDate || undefined,
        timeSlot: timeSlot || undefined,
        status: status || (appointmentDate && timeSlot ? "Scheduled" : undefined),
        chiefComplaint: chiefComplaint !== undefined ? chiefComplaint : undefined,
      })
      .where(
        and(
          eq(appointmentsTable.appointmentId, appointmentId),
          eq(appointmentsTable.primaryUserEmail, userEmail)
        )
      )
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err: any) {
    console.error("PATCH /api/appointments error:", err);
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
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    await db
      .update(appointmentsTable)
      .set({ status: "Cancelled" })
      .where(
        and(
          eq(appointmentsTable.appointmentId, appointmentId),
          eq(appointmentsTable.primaryUserEmail, userEmail)
        )
      );

    return NextResponse.json({ success: true, appointmentId });
  } catch (err: any) {
    console.error("DELETE /api/appointments error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
