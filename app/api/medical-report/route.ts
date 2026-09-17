import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { openai } from "@/config/OpenAiModel";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type SessionDetail = {
  specialist?: string;
  image?: string;
};

type MedicalReport = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
};

const REPORT_SYSTEM_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:
  1. sessionId: a unique session identifier
  2. agent: the medical specialist name (e.g., "General Physician AI")
  3. user: name of the patient or "Anonymous" if not provided
  4. timestamp: current date and time in ISO format
  5. chiefComplaint: one-sentence summary of the main health concern
  6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
  7. symptoms: list of symptoms mentioned by the user
  8. duration: how long the user has experienced the symptoms
  9. severity: mild, moderate, or severe
  10. medicationsMentioned: list of any medicines mentioned
  11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.`;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, sessionDetail, messages } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Conversation messages are required" },
        { status: 400 },
      );
    }

    const doctorSpecialist =
      (sessionDetail as SessionDetail)?.specialist || "AI Medical Specialist";

    // Format the conversation transcript for the LLM
    const transcriptText = (messages as ConversationMessage[])
      .map(
        (msg) =>
          `${msg.role === "user" ? "Patient" : `Dr. (${doctorSpecialist})`}: ${msg.content}`,
      )
      .join("\n");

    const isMentalHealth =
      doctorSpecialist.toLowerCase().includes("mental health") ||
      doctorSpecialist.toLowerCase().includes("maya");

    const effectiveSystemPrompt = isMentalHealth
      ? `${REPORT_SYSTEM_PROMPT}
CRITICAL NOTE FOR MENTAL HEALTH COUNSELLING:
- The AI never prescribes, recommends, or suggests medications. medicationsMentioned should ONLY contain medications the patient explicitly said they take on their own (if none, return an empty array []).
- recommendations must focus on emotional wellness, coping strategies (e.g. mindfulness, journaling, deep breathing), social support, and referral to a licensed human therapist or crisis lifeline if distressed.`
      : REPORT_SYSTEM_PROMPT;

    const userPrompt = `Session ID: ${sessionId}\nAgent: ${doctorSpecialist}\nTimestamp: ${new Date().toISOString()}\n\nTranscript:\n---\n${transcriptText}\n---`;

    let reportData: MedicalReport | null = null;

    // 1. Try OpenRouter with multi-model fallback
    if (process.env.OPEN_ROUTER_API_KEY) {
      const modelsToTry = [
        "openai/gpt-4o-mini",
        "inclusionai/ling-3.0-flash-sante:free",
        "nvidia/nemotron-3.5-lightning:free",
        "liquid/lfm-2.5-2.6b:free",
      ];

      for (const model of modelsToTry) {
        try {
          const completion = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: effectiveSystemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
          });

          const rawText = completion.choices[0]?.message?.content;
          if (rawText) {
            reportData = parseReportJSON(rawText, sessionId, doctorSpecialist);
            if (reportData) break;
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`Report model ${model} failed:`, errMsg);
        }
      }
    }

    // 2. Try Gemini API directly
    if (!reportData) {
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
                systemInstruction: {
                  parts: [{ text: effectiveSystemPrompt }],
                },
                contents: [
                  {
                    role: "user",
                    parts: [{ text: userPrompt }],
                  },
                ],
                generationConfig: {
                  maxOutputTokens: 1500,
                  temperature: 0.3,
                },
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              reportData = parseReportJSON(
                rawText,
                sessionId,
                doctorSpecialist,
              );
            }
          }
        } catch (err) {
          console.error("Gemini report generation error:", err);
        }
      }
    }

    // 3. Fallback: generate a basic report from the transcript
    if (!reportData) {
      reportData = generateFallbackReport(
        messages as ConversationMessage[],
        sessionId,
        doctorSpecialist,
      );
    }

    // Persist the report and final conversation messages to the database
    const result = await db
      .update(SessionChatTable)
      .set({
        report: reportData,
        conversation: messages,
      })
      .where(eq(SessionChatTable.sessionId, sessionId))
      .returning();

    return NextResponse.json({
      success: true,
      report: reportData,
      session: result[0] || null,
    });
  } catch (error) {
    console.error("Error generating medical report:", error);
    return NextResponse.json(
      { error: "Failed to generate medical report" },
      { status: 500 },
    );
  }
}

/**
 * Parse the LLM JSON response, handling markdown code fences and edge cases.
 */
function parseReportJSON(
  rawText: string,
  sessionId: string,
  doctorSpecialist: string,
): MedicalReport | null {
  try {
    // Strip markdown code fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleaned);

    return {
      sessionId: parsed.sessionId || sessionId,
      agent: parsed.agent || doctorSpecialist,
      user: parsed.user || "Anonymous",
      timestamp: parsed.timestamp || new Date().toISOString(),
      chiefComplaint: parsed.chiefComplaint || "Not specified",
      summary: parsed.summary || "Consultation completed.",
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      duration: parsed.duration || "Not specified",
      severity: parsed.severity || "Not assessed",
      medicationsMentioned: Array.isArray(parsed.medicationsMentioned)
        ? parsed.medicationsMentioned
        : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
    };
  } catch {
    console.warn("Failed to parse LLM report JSON:", rawText?.slice(0, 200));
    return null;
  }
}

/**
 * Generate a basic report when all LLM providers fail.
 */
function generateFallbackReport(
  messages: ConversationMessage[],
  sessionId: string,
  doctorSpecialist: string,
): MedicalReport {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  return {
    sessionId,
    agent: doctorSpecialist,
    user: "Anonymous",
    timestamp: new Date().toISOString(),
    chiefComplaint: userMessages[0] || "Not specified",
    summary: `Patient consulted with AI ${doctorSpecialist}. ${userMessages.length} messages were exchanged during the session.`,
    symptoms: userMessages.slice(0, 5),
    duration: "Not specified",
    severity: "Not assessed",
    medicationsMentioned: [],
    recommendations: [
      "Please consult a qualified healthcare provider for an in-person evaluation.",
      "Monitor your symptoms and note any changes.",
    ],
  };
}
