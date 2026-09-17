import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";

type BiomarkerParam = {
  name: string;
  value: string;
  referenceRange?: string;
  status?: string;
  interpretation?: string;
  unit?: string;
};

type ReportInput = {
  reportTitle: string;
  testDate?: string | null;
  parameters: BiomarkerParam[];
};

/**
 * POST /api/compare-reports
 * Takes an array of reports (2+) and computes biomarker deltas with AI trend analysis.
 * Body: { reports: ReportInput[] }
 */
export async function POST(req: NextRequest) {
  try {
    const { reports } = (await req.json()) as { reports: ReportInput[] };

    if (!reports || !Array.isArray(reports) || reports.length < 2) {
      return NextResponse.json(
        { error: "At least 2 reports are required for comparison." },
        { status: 400 },
      );
    }

    // Build a structured summary of parameters across reports for the AI
    const reportSummaries = reports.map((r, i) => {
      const paramLines = (r.parameters || [])
        .map(
          (p) =>
            `  - ${p.name}: ${p.value} (Ref: ${p.referenceRange || "N/A"}, Status: ${p.status || "N/A"})`,
        )
        .join("\n");
      return `Report ${i + 1}: "${r.reportTitle}" (Date: ${r.testDate || "Unknown"})\n${paramLines}`;
    });

    const comparisonPrompt = `You are a clinical pathology comparison AI. Given the following medical lab reports from different dates, analyze the biomarker trends over time.

${reportSummaries.join("\n\n")}

Instructions:
1. Identify ALL parameters that appear in multiple reports.
2. For each shared parameter, compute the change (delta) between earliest and latest values.
3. Classify each trend as: "improving", "stable", "worsening", or "new_finding".
4. Provide a brief clinical interpretation for each trend.
5. Generate an overall health trajectory summary.

Return ONLY valid JSON matching this schema:
{
  "biomarkerTrends": [
    {
      "name": "Parameter Name",
      "values": [
        { "date": "YYYY-MM-DD or 'Unknown'", "value": "observed value with unit", "status": "High|Low|Normal|Critical" }
      ],
      "trend": "improving|stable|worsening|new_finding",
      "interpretation": "Brief clinical interpretation of the trend"
    }
  ],
  "overallSummary": "2-3 sentence summary of overall health trajectory across all reports",
  "keyImprovements": ["List of notable improvements"],
  "areasOfConcern": ["List of areas that need attention"],
  "disclaimer": "This AI comparison is for informational purposes only. Consult a licensed healthcare professional for medical decisions."
}`;

    let responseContent: string | null = null;

    // 1. Try Gemini API
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: comparisonPrompt }] }],
              generationConfig: { maxOutputTokens: 2000, temperature: 0.2 },
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          responseContent =
            data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
      } catch (err) {
        console.warn("Gemini comparison failed:", err);
      }
    }

    // 2. OpenRouter fallback
    if (!responseContent && process.env.OPEN_ROUTER_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: comparisonPrompt }],
          temperature: 0.2,
          max_tokens: 2000,
        });
        responseContent = completion.choices[0]?.message?.content || null;
      } catch (err) {
        console.warn("OpenRouter comparison failed:", err);
      }
    }

    if (!responseContent) {
      return NextResponse.json(
        { error: "Unable to generate comparison analysis. Please try again." },
        { status: 502 },
      );
    }

    // Clean and parse
    const cleanStr = responseContent
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanStr);
      return NextResponse.json({ comparison: parsed });
    } catch {
      console.error("Failed to parse comparison JSON:", cleanStr.slice(0, 300));
      return NextResponse.json(
        { error: "Failed to parse comparison results.", raw: responseContent },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("Error in compare-reports:", err);
    return NextResponse.json(
      { error: "Failed to compare reports." },
      { status: 500 },
    );
  }
}
