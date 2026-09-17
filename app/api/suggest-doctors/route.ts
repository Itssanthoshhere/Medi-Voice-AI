import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    const prompt = `Based on the following user symptoms/notes: "${notes}", select the most relevant doctor specialists from the provided list of AI doctor agents.
Return ONLY a valid JSON array containing the full doctor object(s) from the provided list. Do not include markdown code blocks or extra conversational text.

List of available AI Doctor Agents:
${JSON.stringify(AIDoctorAgents)}`;

    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3.5-lightning:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    const cleanJson = content.replace(/```json|```/g, "").trim();

    let doctors: any[] = [];
    try {
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed)) {
        doctors = parsed;
      } else if (parsed && typeof parsed === "object") {
        doctors =
          parsed.doctors ||
          parsed.suggestedDoctors ||
          parsed.suggested_doctors ||
          Object.values(parsed).find(Array.isArray) ||
          [];
      }
    } catch {
      const match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          doctors = JSON.parse(match[0]);
        } catch {
          doctors = [];
        }
      }
    }

    if (!Array.isArray(doctors) || doctors.length === 0) {
      doctors = AIDoctorAgents;
    }

    return NextResponse.json(doctors);
  } catch (e) {
    console.error("Error in suggest-doctors API:", e);
    return NextResponse.json(AIDoctorAgents);
  }
}
