import { NextResponse } from "next/server";

const TENANT_ID = process.env.AZURE_TENANT_ID!;
const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;
const RALPH_EMAIL = "Ralph@PrimeDealerFund.com";
const TIMEZONE = "America/New_York";

let cachedToken: { token: string; expires: number } | null = null;

async function getGraphToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 120) * 1000 };
  return data.access_token;
}

// GET — Fetch upcoming calendar events for the admin dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");

    const token = await getGraphToken();
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    const startDT = now.toISOString();
    const endDT = end.toISOString();

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/calendarView?startDateTime=${startDT}&endDateTime=${endDT}&$top=50&$orderby=start/dateTime&$select=id,subject,start,end,attendees,isOnlineMeeting,onlineMeeting,location,bodyPreview,webLink,showAs,organizer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Prefer: `outlook.timezone="${TIMEZONE}"`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    const events = (data.value || []).map((e: Record<string, unknown>) => ({
      id: e.id,
      subject: e.subject,
      start: e.start,
      end: e.end,
      attendees: e.attendees,
      isOnlineMeeting: e.isOnlineMeeting,
      onlineMeeting: e.onlineMeeting,
      location: e.location,
      bodyPreview: e.bodyPreview,
      webLink: e.webLink,
      showAs: e.showAs,
    }));

    // Group by date
    const grouped: Record<string, typeof events> = {};
    for (const event of events) {
      const dateKey = (event.start as { dateTime: string }).dateTime.split("T")[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    }

    return NextResponse.json({ events, grouped, total: events.length });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
