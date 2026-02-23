import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
const APP_PASSWORD = process.env.PYTHON_API_PASSWORD || "admin123";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { endpoint, ...data } = body;

        const response = await fetch(`${PYTHON_API_URL}/api/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${APP_PASSWORD}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to connect to automation backend";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const endpoint = searchParams.get("endpoint") || "";

        const response = await fetch(`${PYTHON_API_URL}/api/${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${APP_PASSWORD}`,
            },
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to connect to automation backend";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
