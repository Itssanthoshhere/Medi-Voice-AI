import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { checkEmergencySymptoms } from "@/app/(routes)/dashboard/medical-agent/_utils/emergencyDetector";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bodyRegion, symptoms, duration, severity, additionalNotes } =
      await req.json();

    const symptomsList = Array.isArray(symptoms) ? symptoms.join(", ") : symptoms || "";
    const fullInputText = `Body Region: ${bodyRegion || "General"}. Symptoms: ${symptomsList}. Duration: ${duration || "Recent"}. Severity: ${severity || 5}/10. Additional details: ${additionalNotes || "None"}.`;

    // 1. Safety Emergency Check
    const emergencyCheck = checkEmergencySymptoms(fullInputText);
    if (emergencyCheck.isEmergency) {
      return NextResponse.json({
        isEmergency: true,
        emergencyDetails: emergencyCheck,
        matchedDoctorId: 1, // General Physician default
        urgencyLevel: "emergency",
        triageSummary: "CRITICAL: The symptoms you described match potential high-risk emergency criteria. Immediate emergency medical attention is strongly advised.",
        keyQuestionsToAsk: [
          "Should I call emergency medical services immediately?",
          "What immediate stabilization measures should be taken while waiting for paramedics?",
        ],
        suggestedSelfCare: [
          "Do not delay seeking emergency care.",
          "Remain calm and avoid physical exertion.",
        ],
      });
    }

    // 2. AI Doctor Matching & Clinical Triage Prompt
    const doctorRosterSummary = AIDoctorAgents.map((doc) => ({
      id: doc.id,
      specialist: doc.specialist,
      doctorName: doc.doctorName,
      treats: doc.treats,
      description: doc.description,
    }));

    const prompt = `You are an expert clinical triage assistant AI. Analyze the patient's symptom presentation and match them with the single best specialist doctor from the available roster.

Patient Presentation:
- Primary Affected Body Region: ${bodyRegion || "General"}
- Symptoms: ${symptomsList || "Not specified"}
- Symptom Duration: ${duration || "Not specified"}
- Severity Rating (1-10): ${severity || 5}/10
- Patient Additional Notes: ${additionalNotes || "None"}

Available AI Doctor Specialists:
${JSON.stringify(doctorRosterSummary, null, 2)}

Instructions:
1. Select the single best matching doctor ID (integer from 1 to 11).
2. Determine urgency level: "low" (mild/routine), "moderate" (needs evaluation within days), "urgent" (needs evaluation within 24 hours).
3. Write a concise 2-sentence clinical triage summary explaining why this specialist is appropriate.
4. List 3 key questions the patient should ask the doctor during their session.
5. List 2 safe, non-prescriptive supportive care measures (e.g., rest, hydration, ice pack). NEVER recommend specific medications or dosages.

Return ONLY a valid JSON object in this exact format with NO markdown wrapper:
{
  "matchedDoctorId": 1,
  "urgencyLevel": "low",
  "triageSummary": "...",
  "keyQuestionsToAsk": ["question 1", "question 2", "question 3"],
  "suggestedSelfCare": ["care 1", "care 2"]
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = completion.choices[0]?.message?.content || "";
      const cleanJson = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      const doctorId = Number(parsed.matchedDoctorId) || fallbackDoctorMatch(bodyRegion);

      return NextResponse.json({
        isEmergency: false,
        matchedDoctorId: doctorId,
        urgencyLevel: parsed.urgencyLevel || (severity > 7 ? "urgent" : "low"),
        triageSummary:
          parsed.triageSummary ||
          `Based on your ${symptomsList || "symptoms"}, we have matched you with ${
            AIDoctorAgents.find((d) => d.id === doctorId)?.doctorName || "our specialist"
          }.`,
        keyQuestionsToAsk:
          Array.isArray(parsed.keyQuestionsToAsk) && parsed.keyQuestionsToAsk.length > 0
            ? parsed.keyQuestionsToAsk
            : [
                "What could be causing these symptoms?",
                "What warning signs should I watch out for?",
                "What diagnostic tests might be recommended?",
              ],
        suggestedSelfCare:
          Array.isArray(parsed.suggestedSelfCare) && parsed.suggestedSelfCare.length > 0
            ? parsed.suggestedSelfCare
            : [
                "Stay well hydrated and get adequate rest.",
                "Keep track of any changes in symptom severity.",
              ],
      });
    } catch (aiErr) {
      console.warn("AI Triage call failed, falling back to rule-based triage:", aiErr);
      const fallbackId = fallbackDoctorMatch(bodyRegion);
      return NextResponse.json({
        isEmergency: false,
        matchedDoctorId: fallbackId,
        urgencyLevel: severity > 7 ? "urgent" : severity > 4 ? "moderate" : "low",
        triageSummary: `Based on your selected region (${bodyRegion}), we recommend consulting with ${
          AIDoctorAgents.find((d) => d.id === fallbackId)?.doctorName || "our AI Specialist"
        }.`,
        keyQuestionsToAsk: [
          "What could be causing my symptoms?",
          "How long do these symptoms typically last?",
          "When should I consider seeing an in-person specialist?",
        ],
        suggestedSelfCare: [
          "Get plenty of rest and avoid overexertion.",
          "Maintain good hydration throughout the day.",
        ],
      });
    }
  } catch (err: any) {
    console.error("POST /api/symptom-triage error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

function fallbackDoctorMatch(bodyRegion?: string): number {
  if (!bodyRegion) return 1;
  const region = bodyRegion.toLowerCase();
  if (region.includes("chest") || region.includes("heart") || region.includes("cardio")) return 6; // Dr. Sid
  if (region.includes("skin") || region.includes("dermat") || region.includes("rash")) return 3; // Dr. Clara
  if (region.includes("throat") || region.includes("ear") || region.includes("nose") || region.includes("sinus")) return 7; // Dr. Nico
  if (region.includes("mental") || region.includes("anxiety") || region.includes("stress") || region.includes("mind")) return 11; // Dr. Maya
  if (region.includes("bone") || region.includes("joint") || region.includes("back") || region.includes("ortho")) return 8; // Dr. Neil
  if (region.includes("women") || region.includes("gyne") || region.includes("menstrual") || region.includes("pelvic")) return 9; // Dr. Naina
  if (region.includes("dental") || region.includes("teeth") || region.includes("mouth") || region.includes("gum")) return 10; // Dr. Kai
  if (region.includes("child") || region.includes("pediat") || region.includes("baby")) return 2; // Dr. Savannah
  if (region.includes("diet") || region.includes("nutrit") || region.includes("stomach") || region.includes("gut")) return 5; // Dr. Emma
  return 1; // Dr. Elliot
}
