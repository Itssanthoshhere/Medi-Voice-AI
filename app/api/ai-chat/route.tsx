import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";

export async function POST(req: NextRequest) {
  try {
    const { messages, doctorPrompt, notes } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    const systemInstruction = `${doctorPrompt || "You are a professional medical AI assistant doctor."}
Patient Consultation Notes: ${notes || "None provided"}
Instructions:
- Respond in a compassionate, professional, and clear tone as a medical specialist.
- Keep your answers concise, structured, and easy for a patient to digest.
- Ask clarifying questions when relevant to better understand symptoms.
- Always provide helpful initial medical insights while reminding the patient to seek in-person professional care when appropriate.`;

    // 1. Try OpenRouter with multi-model fallback
    if (process.env.OPEN_ROUTER_API_KEY) {
      const modelsToTry = [
        "inclusionai/ling-3.0-flash-sante:free",
        "nvidia/nemotron-3.5-lightning:free",
        "liquid/lfm-2.5-2.6b:free",
        "z-ai/glm-5.2:free",
        "dots-studio/dots-3-note-preview:free",
      ];

      const formattedMessages = [
        { role: "system", content: systemInstruction },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      for (const model of modelsToTry) {
        try {
          const completion = await openai.chat.completions.create({
            model: model,
            messages: formattedMessages as unknown as Array<{ role: "system" | "user" | "assistant"; content: string }>,
          });

          const replyText = completion.choices[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({ result: replyText });
          }
        } catch (err: any) {
          console.warn(`Model ${model} failed/overloaded:`, err?.message || err);
          // continue to next model in loop
        }
      }
    }

    // 2. Try Gemini API directly
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (geminiKey) {
      try {
        const contents = messages.map(
          (m: { role: string; content: string }) => ({
            role: m.role === "assistant" || m.role === "model" ? "model" : "user",
            parts: [{ text: m.content }],
          })
        );

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
              contents: contents,
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I understand your concerns. Could you describe your symptoms in a bit more detail?";
          return NextResponse.json({ result: replyText });
        }
      } catch (err) {
        console.error("Gemini API call error:", err);
      }
    }

    // 3. Fallback response generator
    const lastUserMsg =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const fallbackResponse = `Thank you for sharing that with me. Based on what you described ("${lastUserMsg.slice(
      0,
      50
    )}${lastUserMsg.length > 50 ? "..." : ""}"), I recommend monitoring your symptoms closely, staying hydrated, and consulting a healthcare provider in person if symptoms persist or worsen. Is there any specific symptom causing you concern right now?`;

    return NextResponse.json({ result: fallbackResponse });
  } catch (error: unknown) {
    console.error("Error in ai-chat route:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
