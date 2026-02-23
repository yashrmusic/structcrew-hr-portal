import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Extract candidate information from the following text and return it as a JSON object.
Fields to extract:
- name: Full name of the candidate
- email: Email address (if not found, leave empty string)
- phone: Phone number (if not found, leave empty string)
- position: Job title / role
- start_date: Joining date (format as "1 March, 2026" style)
- salary: Monthly salary as a number string (e.g. "45000")
- company: Company name (if not found, use "StructCrew")

If a field is not found in the text, leave it as an empty string "".
Output ONLY the raw JSON object, no markdown, no code fences, no explanation.`;

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, message: "No prompt provided" },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: "OPENROUTER_API_KEY not configured." },
                { status: 500 }
            );
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://structcrew.online",
                "X-Title": "StructCrew HR Portal",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Candidate Text: ${prompt}` },
                ],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData?.error?.message || `OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        let text = data.choices?.[0]?.message?.content?.trim() || "";

        // Strip markdown code fences if present
        if (text.startsWith("```json")) text = text.slice(7);
        if (text.startsWith("```")) text = text.slice(3);
        if (text.endsWith("```")) text = text.slice(0, -3);
        text = text.trim();

        const parsed = JSON.parse(text);

        return NextResponse.json({ success: true, data: parsed });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("AI Parse Error:", message);
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}
