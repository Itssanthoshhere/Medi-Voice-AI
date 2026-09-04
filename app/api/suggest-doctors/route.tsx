import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(AIDoctorAgents.slice(0, 3));
    }

    const lowerNotes = notes.toLowerCase();

    // Match keywords against doctor specialists and descriptions
    const matchedDoctors = AIDoctorAgents.filter((doctor) => {
      const specialistLower = doctor.specialist.toLowerCase();
      const descriptionLower = doctor.description.toLowerCase();

      const words = lowerNotes.split(/\s+/).filter((w: string) => w.length > 3);
      return (
        specialistLower.includes(lowerNotes) ||
        descriptionLower.includes(lowerNotes) ||
        words.some(
          (w: string) =>
            specialistLower.includes(w) || descriptionLower.includes(w),
        )
      );
    });

    // Return matched doctors or default to top specialists
    const results =
      matchedDoctors.length > 0
        ? matchedDoctors.slice(0, 4)
        : [
            AIDoctorAgents[0], // General Physician
            AIDoctorAgents[5], // Cardiologist
            AIDoctorAgents[2], // Dermatologist
          ];

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json(AIDoctorAgents.slice(0, 3));
  }
}
