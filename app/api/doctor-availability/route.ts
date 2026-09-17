import { db } from "@/config/db";
import { appointmentsTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: "doctorId and date are required" },
        { status: 400 }
      );
    }

    // Query booked appointments for this doctor & date
    const bookedAppointments = await db
      .select({ timeSlot: appointmentsTable.timeSlot })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.appointmentDate, date),
          eq(appointmentsTable.status, "Scheduled")
        )
      );

    const bookedSlotsSet = new Set(bookedAppointments.map((b) => b.timeSlot));

    const slots = DEFAULT_TIME_SLOTS.map((slot) => ({
      time: slot,
      available: !bookedSlotsSet.has(slot),
    }));

    return NextResponse.json({
      doctorId,
      date,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.available).length,
      slots,
    });
  } catch (err: any) {
    console.error("GET /api/doctor-availability error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
