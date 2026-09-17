import { db } from "@/config/db";
import { medicalReportsTable, SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type TimelineEvent = {
  id: string;
  eventType: "consultation" | "lab_report" | "emergency_alert" | "mental_health";
  title: string;
  date: string;
  timestampMs: number;
  doctorName?: string;
  doctorSpecialist?: string;
  doctorImage?: string;
  summary: string;
  status: "completed" | "in_progress" | "abnormal_detected" | "normal" | "urgent";
  badgeText?: string;
  payload: any;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email");

    let userEmail = queryEmail;

    if (!userEmail) {
      const user = await currentUser();
      userEmail = user?.primaryEmailAddress?.emailAddress || null;
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized or missing user email" },
        { status: 401 }
      );
    }

    // 1. Fetch Session Chat Consultations
    const sessions = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.createdBy, userEmail))
      .orderBy(desc(SessionChatTable.id));

    // 2. Fetch Saved Medical Lab Reports
    const labReports = await db
      .select()
      .from(medicalReportsTable)
      .where(eq(medicalReportsTable.userEmail, userEmail))
      .orderBy(desc(medicalReportsTable.id));

    // 3. Normalize Session Consultations to Timeline Events
    const sessionEvents: TimelineEvent[] = sessions.map((item) => {
      const doc = (item.selectedDoctor as any) || {};
      const specialist = doc.specialist || "AI Medical Specialist";
      const isMental =
        specialist.toLowerCase().includes("mental") ||
        specialist.toLowerCase().includes("counselor") ||
        specialist.toLowerCase().includes("psych");

      const createdDate = item.createdOn || new Date().toISOString();
      const parsedTime = Date.parse(createdDate);
      const timestampMs = isNaN(parsedTime) ? Date.now() : parsedTime;

      const reportData = item.report as any;
      const chiefComplaint = reportData?.chiefComplaint || item.notes;

      return {
        id: `consultation_${item.id}_${item.sessionId}`,
        eventType: isMental ? "mental_health" : "consultation",
        title: `${specialist} Consultation`,
        date: createdDate,
        timestampMs: timestampMs,
        doctorName: doc.name || specialist,
        doctorSpecialist: specialist,
        doctorImage: doc.image || "/doctor1.jpg",
        summary: chiefComplaint
          ? `Chief Complaint: "${chiefComplaint}"`
          : "Voice consultation session completed.",
        status: reportData ? "completed" : "in_progress",
        badgeText: reportData ? "SOAP Report Ready" : "Session Recorded",
        payload: {
          sessionId: item.sessionId,
          notes: item.notes,
          report: item.report,
          conversation: item.conversation,
          selectedDoctor: item.selectedDoctor,
        },
      };
    });

    // 4. Normalize Medical Lab Reports to Timeline Events
    const reportEvents: TimelineEvent[] = labReports.map((item) => {
      const createdDate = item.testDate || item.createdAt || new Date().toISOString();
      const parsedTime = Date.parse(createdDate);
      const timestampMs = isNaN(parsedTime) ? Date.now() : parsedTime;

      const abnormalities = Array.isArray(item.deficienciesOrAbnormalities)
        ? (item.deficienciesOrAbnormalities as string[])
        : [];

      const hasAbnormal = abnormalities.length > 0;

      return {
        id: `lab_report_${item.id}_${item.reportId}`,
        eventType: "lab_report",
        title: item.reportTitle || "Diagnostic Lab Report",
        date: createdDate,
        timestampMs: timestampMs,
        doctorName: "Lab Pathology Diagnostics",
        doctorSpecialist: "Diagnostic Lab Analysis",
        doctorImage: "/doctor1.jpg",
        summary:
          item.patientSummary ||
          (hasAbnormal
            ? `Flagged ${abnormalities.length} abnormal parameter(s): ${abnormalities.slice(0, 2).join(", ")}`
            : "All extracted lab parameters are within standard clinical reference ranges."),
        status: hasAbnormal ? "abnormal_detected" : "normal",
        badgeText: hasAbnormal
          ? `${abnormalities.length} Abnormal Flag(s)`
          : "Normal Ranges",
        payload: {
          reportId: item.reportId,
          reportTitle: item.reportTitle,
          testDate: item.testDate,
          fileName: item.fileName,
          patientSummary: item.patientSummary,
          parameters: item.parameters,
          deficienciesOrAbnormalities: item.deficienciesOrAbnormalities,
          suggestedNextSteps: item.suggestedNextSteps,
          rawText: item.rawText,
        },
      };
    });

    // 5. Merge and Sort chronologically descending
    const allEvents = [...sessionEvents, ...reportEvents].sort(
      (a, b) => b.timestampMs - a.timestampMs
    );

    // 6. Compute Aggregate Summary Statistics
    let totalAbnormalities = 0;
    labReports.forEach((rep) => {
      if (Array.isArray(rep.deficienciesOrAbnormalities)) {
        totalAbnormalities += (rep.deficienciesOrAbnormalities as any[]).length;
      }
    });

    const totalConsultations = sessionEvents.length;
    const totalLabReports = reportEvents.length;

    // Health Score calculation (base 95 - 5 per abnormal flag, min 60)
    const healthIndexScore = Math.max(60, 95 - totalAbnormalities * 5);

    return NextResponse.json({
      events: allEvents,
      stats: {
        totalEvents: allEvents.length,
        totalConsultations,
        totalLabReports,
        totalAbnormalities,
        healthIndexScore,
      },
    });
  } catch (err: any) {
    console.error("GET /api/health-timeline error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
