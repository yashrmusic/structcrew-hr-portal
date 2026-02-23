import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: "GEMINI_API_KEY not configured. Add it to your environment variables." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nCandidate Text: ${prompt}`);
        const response = result.response;
        let text = response.text().trim();

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
