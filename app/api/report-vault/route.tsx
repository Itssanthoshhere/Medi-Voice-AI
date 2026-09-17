import { db } from "@/config/db";
import { medicalReportsTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc, and } from "drizzle-orm";

/**
 * GET /api/report-vault?email=user@example.com&familyMemberId=xxx
 * Fetch all saved medical reports for the authenticated user, ordered by date descending.
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const familyMemberId = req.nextUrl.searchParams.get("familyMemberId");

    if (!email) {
      return NextResponse.json(
        { error: "User email is required." },
        { status: 400 },
      );
    }

    let queryCondition = eq(medicalReportsTable.userEmail, email);
    if (familyMemberId && familyMemberId !== "all") {
      queryCondition = and(
        eq(medicalReportsTable.userEmail, email),
        eq(medicalReportsTable.familyMemberId, familyMemberId)
      ) as any;
    }

    const reports = await db
      .select()
      .from(medicalReportsTable)
      .where(queryCondition)
      .orderBy(desc(medicalReportsTable.id));

    return NextResponse.json({ reports });
  } catch (err) {
    console.error("Error fetching report vault:", err);
    return NextResponse.json(
      { error: "Failed to fetch reports." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/report-vault
 * Save an analyzed report to the user's permanent vault.
 * Body: { email, reportId, fileName, reportTitle, testDate, patientSummary, parameters, deficienciesOrAbnormalities, suggestedNextSteps, rawText, familyMemberId }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      reportId,
      fileName,
      reportTitle,
      testDate,
      patientSummary,
      parameters,
      deficienciesOrAbnormalities,
      suggestedNextSteps,
      rawText,
      familyMemberId,
    } = body;

    if (!email || !reportId || !reportTitle) {
      return NextResponse.json(
        { error: "Email, reportId, and reportTitle are required." },
        { status: 400 },
      );
    }

    const result = await db
      .insert(medicalReportsTable)
      .values({
        reportId,
        userEmail: email,
        fileName: fileName || "Unknown",
        reportTitle,
        testDate: testDate || null,
        patientSummary: patientSummary || "",
        parameters: parameters || [],
        deficienciesOrAbnormalities: deficienciesOrAbnormalities || [],
        suggestedNextSteps: suggestedNextSteps || [],
        rawText: rawText || null,
        createdAt: new Date().toISOString(),
        familyMemberId: familyMemberId || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      report: result[0] || null,
    });
  } catch (err: any) {
    // Handle duplicate reportId
    if (err?.message?.includes("unique") || err?.code === "23505") {
      return NextResponse.json(
        { error: "This report has already been saved to your vault." },
        { status: 409 },
      );
    }
    console.error("Error saving to report vault:", err);
    return NextResponse.json(
      { error: "Failed to save report." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/report-vault?reportId=xxx
 * Remove a report from the vault.
 */
export async function DELETE(req: NextRequest) {
  try {
    const reportId = req.nextUrl.searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required." },
        { status: 400 },
      );
    }

    await db
      .delete(medicalReportsTable)
      .where(eq(medicalReportsTable.reportId, reportId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting from report vault:", err);
    return NextResponse.json(
      { error: "Failed to delete report." },
      { status: 500 },
    );
  }
}
