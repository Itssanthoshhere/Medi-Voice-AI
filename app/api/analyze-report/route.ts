import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";

export async function POST(req: NextRequest) {
  try {
    const { reportText, fileData, fileName } = await req.json();

    if (!reportText && !fileData) {
      return NextResponse.json(
        { error: "Please provide medical report content or file data." },
        { status: 400 },
      );
    }

    const systemPrompt = `You are an expert AI Clinical Pathologist and Medical Report Analyzer.
Analyze the provided medical lab report image or text and output structured JSON strictly matching this schema:

{
  "reportTitle": "Name of the medical test/panel (e.g., Complete Blood Count Report)",
  "testDate": "Date of test or collection if found in report (e.g. 2026-08-15), or null if not mentioned",
  "labName": "Diagnostic laboratory or hospital name if found, or null",
  "patientSummary": "Brief overview of overall clinical findings",
  "parameters": [
    {
      "name": "Parameter Name (e.g. Vitamin D 25-OH)",
      "value": "Observed value with unit (e.g. 24.5 ng/mL)",
      "referenceRange": "Normal reference range (e.g. 30.0 - 100.0 ng/mL)",
      "status": "High" | "Low" | "Normal" | "Critical",
      "interpretation": "Short plain-language explanation of what this level means."
    }
  ],
  "deficienciesOrAbnormalities": [
    "List key health insights or deficiencies identified"
  ],
  "suggestedNextSteps": [
    "Actionable next steps for doctor discussion"
  ],
  "disclaimer": "IMPORTANT NOTICE: This AI analysis is for educational and informational reference only. Any medication, dosage, or dietary supplementation MUST be evaluated and prescribed by a licensed healthcare professional."
}

Rules:
- Extract observed parameters, values, units, reference ranges, and abnormalities strictly from the provided document.
- Never invent lab results that are not in the document.
- Always include the mandatory physician confirmation disclaimer.
- Return ONLY valid JSON with no markdown formatting.`;

    let responseContent: string | null = null;
    const isImage =
      fileData &&
      (fileData.startsWith("data:image/") ||
        fileData.startsWith("data:application/pdf"));

    // Extract base64 part and mimeType if fileData is present
    let base64String = "";
    let mimeType = "image/png";
    if (isImage) {
      const parts = fileData.split(",");
      base64String = parts[1] || "";
      mimeType = parts[0].split(";")[0].split(":")[1] || "image/png";
    }

    // 1. Try Direct Gemini API with Multimodal Vision Support
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (geminiKey) {
      try {
        const geminiParts: any[] = [];
        if (reportText) {
          geminiParts.push({
            text: `Report Text / Notes:\n${reportText}\nFile Name: ${fileName || "medical-report"}`,
          });
        } else {
          geminiParts.push({
            text: `Analyze this medical lab report image (${fileName || "medical-report"}) and extract parameters into JSON.`,
          });
        }

        if (isImage && base64String) {
          geminiParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64String,
            },
          });
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: geminiParts }],
              generationConfig: { maxOutputTokens: 1200, temperature: 0.2 },
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          responseContent =
            data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
      } catch (gemErr) {
        console.warn("Direct Gemini vision failed:", gemErr);
      }
    }

    // 2. OpenRouter Fallback
    if (!responseContent && process.env.OPEN_ROUTER_API_KEY) {
      try {
        const userMessageContent: any = isImage
          ? [
              {
                type: "text",
                text: `Analyze this medical lab report (${fileName || "medical-report"}) and extract parameters.`,
              },
              { type: "image_url", image_url: { url: fileData } },
            ]
          : `Report Content:\n${reportText || fileName}`;

        const completion = await openai.chat.completions.create({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessageContent },
          ],
        });
        responseContent = completion.choices[0]?.message?.content || null;
      } catch (openErr) {
        console.warn("OpenRouter vision model failed:", openErr);
      }
    }

    // 3. Extraction failed — return honest error instead of fabricated data
    if (
      !responseContent ||
      responseContent.includes("not able to access") ||
      responseContent.includes("just a filename")
    ) {
      return NextResponse.json(
        {
          error:
            "Could not clearly parse lab parameters from this document. Please ensure the image is high resolution and well-lit, or paste the report text directly.",
          report: {
            reportTitle: "Report Analysis Incomplete",
            patientSummary:
              "We were unable to extract clinical parameters from the uploaded document. This may be due to image quality, unsupported format, or unreadable text.",
            parameters: [],
            deficienciesOrAbnormalities: [],
            suggestedNextSteps: [
              "Re-upload a clearer, higher-resolution image of the lab report.",
              "If possible, paste the report text directly into the analysis field.",
              "Ensure the document is a medical lab report with visible test values.",
            ],
            disclaimer:
              "IMPORTANT NOTICE: This AI analysis is for educational and informational reference only. Any medication, dosage, or dietary supplementation MUST be evaluated and prescribed by a licensed healthcare professional.",
          },
        },
        { status: 422 },
      );
    }

    // Clean JSON response string if wrapped in markdown
    const cleanJsonStr = responseContent
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsedReport = JSON.parse(cleanJsonStr);
      return NextResponse.json({ report: parsedReport });
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, cleanJsonStr);
      return NextResponse.json({
        report: {
          reportTitle: "Medical Report Analysis",
          patientSummary: responseContent,
          parameters: [],
          deficienciesOrAbnormalities: [],
          suggestedNextSteps: [
            "Consult your healthcare provider to review your test results.",
          ],
          disclaimer:
            "IMPORTANT NOTICE: All AI test interpretations and supplementation suggestions are for educational reference only. Any medication or dosage MUST be confirmed with a licensed doctor.",
        },
      });
    }
  } catch (err: any) {
    console.error("Error in analyze-report route:", err);
    return NextResponse.json(
      { error: "Failed to analyze report." },
      { status: 500 },
    );
  }
}
