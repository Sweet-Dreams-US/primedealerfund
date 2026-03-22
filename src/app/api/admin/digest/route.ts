import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";
import { getMailFolders } from "@/lib/microsoft-graph";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// POST — Send daily digest email to Ralph
export async function POST() {
  try {
    const supabase = createServerClient();
    const today = new Date().toISOString().split("T")[0];

    // Fetch overdue tasks
    const { data: overdueTasks } = await supabase
      .from("tasks")
      .select("*, investors(first_name, last_name)")
      .eq("completed", false)
      .lt("due_date", today)
      .order("due_date");

    // Fetch today's tasks
    const { data: todayTasks } = await supabase
      .from("tasks")
      .select("*, investors(first_name, last_name)")
      .eq("completed", false)
      .eq("due_date", today)
      .order("priority");

    // Fetch new leads (added in last 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { data: newLeads } = await supabase
      .from("investors")
      .select("first_name, last_name, email, source, amount_of_interest")
      .eq("category", "New Lead")
      .gte("created_at", yesterday.toISOString());

    // Fetch investors with overdue next_action
    const { data: overdueActions } = await supabase
      .from("investors")
      .select("first_name, last_name, next_action, next_action_date")
      .lt("next_action_date", today)
      .not("next_action", "is", null)
      .not("next_action_date", "is", null);

    // Get email counts
    let mailInfo = { inbox: { unread: 0 }, drafts: { total: 0 }, sentItems: { total: 0 } };
    try {
      mailInfo = await getMailFolders();
    } catch { /* Outlook might not be configured */ }

    // Pipeline stats
    const { data: stats } = await supabase
      .from("investors")
      .select("category, amount_of_interest, amount_invested");

    const totalInvestors = stats?.length || 0;
    const totalInterest = stats?.reduce((sum, i) => sum + (i.amount_of_interest || 0), 0) || 0;
    const totalInvested = stats?.reduce((sum, i) => sum + (i.amount_invested || 0), 0) || 0;

    // Build HTML
    const sections: string[] = [];

    // Overdue tasks
    if (overdueTasks && overdueTasks.length > 0) {
      sections.push(`
        <div style="margin-bottom:24px;">
          <h2 style="color:#dc2626;font-size:16px;margin:0 0 12px;">Overdue Tasks (${overdueTasks.length})</h2>
          ${overdueTasks.map((t) => `
            <div style="padding:8px 12px;background:#fef2f2;border-radius:6px;margin-bottom:6px;font-size:14px;">
              <strong>${t.title}</strong>
              ${t.investors ? ` — ${t.investors.first_name} ${t.investors.last_name || ""}` : ""}
              <span style="color:#9ca3af;margin-left:8px;">Due: ${t.due_date}</span>
            </div>
          `).join("")}
        </div>
      `);
    }

    // Today's tasks
    if (todayTasks && todayTasks.length > 0) {
      sections.push(`
        <div style="margin-bottom:24px;">
          <h2 style="color:#1e293b;font-size:16px;margin:0 0 12px;">Today's Tasks (${todayTasks.length})</h2>
          ${todayTasks.map((t) => `
            <div style="padding:8px 12px;background:#f0f9ff;border-radius:6px;margin-bottom:6px;font-size:14px;">
              <strong>${t.title}</strong>
              ${t.investors ? ` — ${t.investors.first_name} ${t.investors.last_name || ""}` : ""}
              ${t.priority === "high" ? '<span style="color:#dc2626;font-weight:bold;margin-left:8px;">HIGH</span>' : ""}
            </div>
          `).join("")}
        </div>
      `);
    }

    // New leads
    if (newLeads && newLeads.length > 0) {
      sections.push(`
        <div style="margin-bottom:24px;">
          <h2 style="color:#1e293b;font-size:16px;margin:0 0 12px;">New Leads (${newLeads.length})</h2>
          ${newLeads.map((l) => `
            <div style="padding:8px 12px;background:#f0fdf4;border-radius:6px;margin-bottom:6px;font-size:14px;">
              <strong>${l.first_name} ${l.last_name || ""}</strong>
              ${l.email ? ` · ${l.email}` : ""}
              ${l.amount_of_interest ? ` · Interest: $${l.amount_of_interest.toLocaleString()}` : ""}
              <span style="color:#9ca3af;margin-left:8px;">via ${l.source}</span>
            </div>
          `).join("")}
        </div>
      `);
    }

    // Overdue investor actions
    if (overdueActions && overdueActions.length > 0) {
      sections.push(`
        <div style="margin-bottom:24px;">
          <h2 style="color:#ea580c;font-size:16px;margin:0 0 12px;">Overdue Follow-ups (${overdueActions.length})</h2>
          ${overdueActions.slice(0, 10).map((i) => `
            <div style="padding:8px 12px;background:#fff7ed;border-radius:6px;margin-bottom:6px;font-size:14px;">
              <strong>${i.first_name} ${i.last_name || ""}</strong> — ${i.next_action}
              <span style="color:#9ca3af;margin-left:8px;">Due: ${i.next_action_date}</span>
            </div>
          `).join("")}
        </div>
      `);
    }

    // Quick stats
    sections.push(`
      <div style="margin-bottom:24px;">
        <h2 style="color:#1e293b;font-size:16px;margin:0 0 12px;">Pipeline Snapshot</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;">Total Contacts</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${totalInvestors}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Pipeline Value</td><td style="padding:6px 0;text-align:right;font-weight:bold;">$${totalInterest.toLocaleString()}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Capital Invested</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#059669;">$${totalInvested.toLocaleString()}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Unread Emails</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${mailInfo.inbox.unread}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Drafts Pending</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${mailInfo.drafts.total}</td></tr>
        </table>
      </div>
    `);

    const hasUrgent = (overdueTasks?.length || 0) > 0 || (overdueActions?.length || 0) > 0;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f8fafc;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0f0f1e;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <img src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Fund" width="160" style="height:auto;" />
        </td></tr>
        <tr><td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
          <h1 style="margin:0 0 4px;font-size:20px;color:#1e293b;">
            ${hasUrgent ? "Action Required" : "Good Morning"}, Ralph
          </h1>
          <p style="margin:0 0 24px;color:#64748b;font-size:14px;">
            ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          ${sections.join("")}
          <div style="text-align:center;margin-top:24px;">
            <a href="https://primedealerfund.vercel.app/admin" style="display:inline-block;background:#0f0f1e;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">Open Dashboard</a>
          </div>
        </td></tr>
        <tr><td style="padding:16px;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:11px;">Prime Dealer Equity Fund · Daily Digest</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send
    const resend = getResend();
    await resend.emails.send({
      from: "Prime Dealer Fund <ralph@primedealerfund.com>",
      to: "ralph@primedealerfund.com",
      subject: `${hasUrgent ? "⚡ " : ""}Daily Digest — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}${overdueTasks?.length ? ` · ${overdueTasks.length} overdue` : ""}`,
      html,
    });

    return NextResponse.json({
      success: true,
      summary: {
        overdueTasks: overdueTasks?.length || 0,
        todayTasks: todayTasks?.length || 0,
        newLeads: newLeads?.length || 0,
        overdueActions: overdueActions?.length || 0,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
