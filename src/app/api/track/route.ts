import { NextResponse } from "next/server";

// In-memory store for usage events (reset on server restart; production would use a database)
interface UsageEvent {
    event: string;
    name: string;
    email: string | null;
    timestamp: string;
}

const usageEvents: UsageEvent[] = [];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event: UsageEvent = {
            event: body.event || "unknown",
            name: body.name || "Anonymous",
            email: body.email || null,
            timestamp: body.timestamp || new Date().toISOString(),
        };
        usageEvents.push(event);
        return NextResponse.json({ ok: true, total: usageEvents.length });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function GET() {
    const totalUsers = usageEvents.filter((e) => e.event === "platform_use").length;
    const loggedInUsers = usageEvents.filter((e) => e.event === "platform_use" && e.email).length;
    const loginRate = totalUsers > 0 ? Math.round((loggedInUsers / totalUsers) * 100) : 0;

    return NextResponse.json({
        total_users: totalUsers,
        logged_in_users: loggedInUsers,
        login_rate: loginRate,
        events: usageEvents.slice(-50), // Return last 50 events
    });
}
