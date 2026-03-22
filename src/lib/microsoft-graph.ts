const TENANT_ID = process.env.AZURE_TENANT_ID!;
const CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;
const RALPH_EMAIL = "Ralph@PrimeDealerFund.com";
const KYLE_EMAIL = "kyle.coleman@colemanauto.com";
const TIMEZONE = "America/New_York";

let cachedToken: { token: string; expires: number } | null = null;

async function getGraphToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );

  const data = await res.json();

  if (!data.access_token) {
    throw new Error(`Graph token error: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 120) * 1000,
  };

  return data.access_token;
}

interface CalendarEvent {
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  showAs: string;
}

/**
 * Get available 30-min slots for a given date.
 * Business hours: M-F 9am-6pm, Sat-Sun 10am-3pm (Eastern).
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  const token = await getGraphToken();

  const d = new Date(date + "T12:00:00");
  const day = d.getDay();

  let startHour: number, endHour: number;
  if (day === 0 || day === 6) {
    startHour = 10;
    endHour = 15;
  } else {
    startHour = 9;
    endHour = 18;
  }

  const startDT = `${date}T${String(startHour).padStart(2, "0")}:00:00`;
  const endDT = `${date}T${String(endHour).padStart(2, "0")}:00:00`;

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/calendarView?startDateTime=${startDT}&endDateTime=${endDT}&$select=start,end,showAs&$top=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: `outlook.timezone="${TIMEZONE}"`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph calendarView error: ${err}`);
  }

  const data = await res.json();
  const events: CalendarEvent[] = data.value || [];

  // Build busy intervals (only busy/oof/tentative block slots)
  const busyIntervals = events
    .filter((e) => e.showAs !== "free")
    .map((e) => ({
      start: new Date(e.start.dateTime).getTime(),
      end: new Date(e.end.dateTime).getTime(),
    }));

  // Generate all 30-min slots within business hours
  const slots: string[] = [];
  const baseDate = new Date(`${date}T${String(startHour).padStart(2, "0")}:00:00`);

  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 30]) {
      const slotStart = new Date(baseDate);
      slotStart.setHours(h, m, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      // Don't offer slots in the past
      const now = new Date();
      if (slotStart.getTime() < now.getTime()) continue;

      // Check if slot overlaps any busy interval
      const isBusy = busyIntervals.some(
        (b) => slotStart.getTime() < b.end && slotEnd.getTime() > b.start
      );

      if (!isBusy) {
        const timeStr = slotStart.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        slots.push(timeStr);
      }
    }
  }

  return slots;
}

/**
 * Create a calendar event on Ralph's calendar.
 * Kyle is always invited. Prospect + optional guest are also attendees.
 */
export async function createBooking(params: {
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType: string;
  capitalRange: string;
  guestName?: string;
  guestEmail?: string;
}): Promise<{ success: boolean; error?: string }> {
  const token = await getGraphToken();

  // Parse the time string (e.g., "2:30 PM") into hours/minutes
  const timeParts = params.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeParts) return { success: false, error: "Invalid time format" };

  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const ampm = timeParts[3].toUpperCase();

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const startDT = `${params.date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  const endDate = new Date(`${params.date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
  endDate.setMinutes(endDate.getMinutes() + 30);
  const endDT = `${params.date}T${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}:00`;

  const attendees: { emailAddress: { address: string; name: string }; type: string }[] = [
    {
      emailAddress: { address: KYLE_EMAIL, name: "Kyle Coleman" },
      type: "required",
    },
    {
      emailAddress: {
        address: params.email,
        name: `${params.firstName} ${params.lastName}`,
      },
      type: "required",
    },
  ];

  if (params.guestEmail && params.guestName) {
    attendees.push({
      emailAddress: { address: params.guestEmail, name: params.guestName },
      type: "optional",
    });
  }

  const event = {
    subject: `Prime Dealer Fund - Investor Consultation: ${params.firstName} ${params.lastName}`,
    body: {
      contentType: "HTML",
      content: `
        <h3>Investor Consultation</h3>
        <p><strong>Prospect:</strong> ${params.firstName} ${params.lastName}</p>
        <p><strong>Email:</strong> ${params.email}</p>
        <p><strong>Phone:</strong> ${params.phone}</p>
        <p><strong>Investor Type:</strong> ${params.investorType}</p>
        <p><strong>Capital Range:</strong> ${params.capitalRange}</p>
        ${params.guestName ? `<p><strong>Guest:</strong> ${params.guestName} (${params.guestEmail})</p>` : ""}
      `,
    },
    start: { dateTime: startDT, timeZone: TIMEZONE },
    end: { dateTime: endDT, timeZone: TIMEZONE },
    attendees,
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",
  };

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  return { success: true };
}

// ═══════════════════════════════════════════════
// OUTLOOK MAIL — Read inbox, create drafts, send
// ═══════════════════════════════════════════════

export interface OutlookMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { contentType: string; content: string };
  from: { emailAddress: { name: string; address: string } };
  toRecipients: { emailAddress: { name: string; address: string } }[];
  ccRecipients: { emailAddress: { name: string; address: string } }[];
  receivedDateTime: string;
  sentDateTime: string;
  isRead: boolean;
  isDraft: boolean;
  hasAttachments: boolean;
  importance: string;
  flag: { flagStatus: string };
  conversationId: string;
  webLink: string;
}

export interface OutlookMailResponse {
  value: OutlookMessage[];
  "@odata.nextLink"?: string;
}

/**
 * Fetch Ralph's inbox messages.
 * Supports pagination, filtering, and search.
 */
export async function getInboxMessages(params: {
  top?: number;
  skip?: number;
  search?: string;
  filter?: string;
  folder?: string;
  orderBy?: string;
}): Promise<{ messages: OutlookMessage[]; total: number; nextLink?: string }> {
  const token = await getGraphToken();
  const { top = 25, skip = 0, search, filter, folder = "inbox", orderBy = "receivedDateTime desc" } = params;

  let url = `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/mailFolders/${folder}/messages?$top=${top}&$skip=${skip}&$orderby=${orderBy}&$select=id,subject,bodyPreview,body,from,toRecipients,ccRecipients,receivedDateTime,sentDateTime,isRead,isDraft,hasAttachments,importance,flag,conversationId,webLink`;

  if (search) {
    url += `&$search="${encodeURIComponent(search)}"`;
  }
  if (filter) {
    url += `&$filter=${encodeURIComponent(filter)}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: `outlook.timezone="${TIMEZONE}"`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph mail error: ${err}`);
  }

  const data: OutlookMailResponse = await res.json();
  return {
    messages: data.value || [],
    total: data.value?.length || 0,
    nextLink: data["@odata.nextLink"],
  };
}

/**
 * Get a single message by ID with full body.
 */
export async function getMessage(messageId: string): Promise<OutlookMessage> {
  const token = await getGraphToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/messages/${messageId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: `outlook.timezone="${TIMEZONE}"`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph message error: ${err}`);
  }

  return res.json();
}

/**
 * Mark a message as read/unread.
 */
export async function markMessageRead(messageId: string, isRead: boolean): Promise<void> {
  const token = await getGraphToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/messages/${messageId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isRead }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph markRead error: ${err}`);
  }
}

/**
 * Create a draft in Ralph's Outlook drafts folder.
 */
export async function createDraft(params: {
  subject: string;
  body: string;
  bodyType?: "HTML" | "Text";
  toRecipients: { name?: string; address: string }[];
  ccRecipients?: { name?: string; address: string }[];
  importance?: "low" | "normal" | "high";
}): Promise<OutlookMessage> {
  const token = await getGraphToken();

  const message = {
    subject: params.subject,
    body: {
      contentType: params.bodyType || "HTML",
      content: params.body,
    },
    toRecipients: params.toRecipients.map((r) => ({
      emailAddress: { name: r.name || r.address, address: r.address },
    })),
    ccRecipients: (params.ccRecipients || []).map((r) => ({
      emailAddress: { name: r.name || r.address, address: r.address },
    })),
    importance: params.importance || "normal",
  };

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph createDraft error: ${err}`);
  }

  return res.json();
}

/**
 * Send a draft that's already in Outlook.
 */
export async function sendDraft(messageId: string): Promise<void> {
  const token = await getGraphToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/messages/${messageId}/send`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph sendDraft error: ${err}`);
  }
}

/**
 * Send a new message directly (no draft step).
 */
export async function sendMail(params: {
  subject: string;
  body: string;
  bodyType?: "HTML" | "Text";
  toRecipients: { name?: string; address: string }[];
  ccRecipients?: { name?: string; address: string }[];
}): Promise<void> {
  const token = await getGraphToken();

  const payload = {
    message: {
      subject: params.subject,
      body: {
        contentType: params.bodyType || "HTML",
        content: params.body,
      },
      toRecipients: params.toRecipients.map((r) => ({
        emailAddress: { name: r.name || r.address, address: r.address },
      })),
      ccRecipients: (params.ccRecipients || []).map((r) => ({
        emailAddress: { name: r.name || r.address, address: r.address },
      })),
    },
    saveToSentItems: true,
  };

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph sendMail error: ${err}`);
  }
}

/**
 * Reply to a message.
 */
export async function replyToMessage(messageId: string, comment: string): Promise<void> {
  const token = await getGraphToken();
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/messages/${messageId}/reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Graph reply error: ${err}`);
  }
}

/**
 * Get mail folder counts (inbox unread, drafts count, etc.)
 */
export async function getMailFolders(): Promise<{
  inbox: { total: number; unread: number };
  drafts: { total: number };
  sentItems: { total: number };
}> {
  const token = await getGraphToken();

  const folders = ["inbox", "drafts", "sentitems"];
  const results = await Promise.all(
    folders.map(async (folder) => {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${RALPH_EMAIL}/mailFolders/${folder}?$select=totalItemCount,unreadItemCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return { totalItemCount: 0, unreadItemCount: 0 };
      return res.json();
    })
  );

  return {
    inbox: { total: results[0].totalItemCount, unread: results[0].unreadItemCount },
    drafts: { total: results[1].totalItemCount },
    sentItems: { total: results[2].totalItemCount },
  };
}
