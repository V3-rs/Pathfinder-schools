import { NextRequest, NextResponse } from "next/server";

const DEMO_CREDENTIALS = {
    email: "employer@pathfinder.com",
    password: "demo2024",
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, error: "Invalid email or password" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: "Login failed" },
            { status: 500 }
        );
    }
}
