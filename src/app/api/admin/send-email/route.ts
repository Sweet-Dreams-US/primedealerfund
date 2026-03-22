import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function buildEmailHtml(body: string, recipientName: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f0f1e;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
              <img src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Equity Fund" width="180" style="height:auto;display:block;margin:0 auto;" />
            </td>
          </tr>
          <!-- Gold accent line -->
          <tr>
            <td style="background:linear-gradient(90deg,#d4a853,#b8912a);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-radius:0 0 12px 12px;">
              <div style="color:#1a1a2e;font-size:16px;line-height:1.7;">
                ${body.split("\n").map((line: string) => line.trim() === "" ? "<br>" : `<p style="margin:0 0 16px 0;">${line}</p>`).join("\n")}
              </div>
              <table role="presentation" width="100%" style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:24px;">
                <tr>
                  <td style="color:#6b7280;font-size:13px;line-height:1.5;">
                    <strong style="color:#1a1a2e;">Ralph Marcuccilli</strong><br>
                    Managing Partner<br>
                    Prime Dealer Equity Fund<br>
                    <a href="mailto:ralph@primedealerfund.com" style="color:#d4a853;text-decoration:none;">ralph@primedealerfund.com</a><br>
                    <a href="https://primedealerfund.com" style="color:#d4a853;text-decoration:none;">primedealerfund.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;line-height:1.5;">
                &copy; ${new Date().getFullYear()} Prime Dealer Equity Fund. All rights reserved.<br>
                This email was sent to ${recipientName}. If you believe this was sent in error, please disregard.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const { recipientIds, adhocEmails, subject, body } = await request.json();

  const hasRecipientIds = recipientIds?.length > 0;
  const hasAdhocEmails = adhocEmails?.length > 0;

  if ((!hasRecipientIds && !hasAdhocEmails) || !subject || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServerClient();
  const resend = getResend();
  const results: { investorId?: string; email: string; status: string; resendId?: string; error?: string }[] = [];

  // Send to database investors
  if (hasRecipientIds) {
    const { data: recipients } = await supabase
      .from("investors")
      .select("id, first_name, last_name, email")
      .in("id", recipientIds);

    const validRecipients = (recipients || []).filter((r) => r.email);

    for (const recipient of validRecipients) {
      const personalizedBody = body
        .replace(/{{first_name}}/g, recipient.first_name || "")
        .replace(/{{last_name}}/g, recipient.last_name || "")
        .replace(/{{full_name}}/g, `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim());

      const recipientName = `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim();
      const html = buildEmailHtml(personalizedBody, recipientName);

      try {
        const { data } = await resend.emails.send({
          from: "Ralph Marcuccilli <ralph@primedealerfund.com>",
          to: recipient.email,
          subject,
          html,
        });

        results.push({ investorId: recipient.id, email: recipient.email, status: "sent", resendId: data?.id });
      } catch (err) {
        results.push({ investorId: recipient.id, email: recipient.email, status: "failed", error: String(err) });
      }
    }
  }

  // Send to ad-hoc email addresses (not in database)
  if (hasAdhocEmails) {
    for (const adhoc of adhocEmails as { email: string; name: string }[]) {
      const personalizedBody = body
        .replace(/{{first_name}}/g, adhoc.name || "")
        .replace(/{{last_name}}/g, "")
        .replace(/{{full_name}}/g, adhoc.name || "");

      const html = buildEmailHtml(personalizedBody, adhoc.name || adhoc.email);

      try {
        const { data } = await resend.emails.send({
          from: "Ralph Marcuccilli <ralph@primedealerfund.com>",
          to: adhoc.email,
          subject,
          html,
        });

        results.push({ email: adhoc.email, status: "sent", resendId: data?.id });
      } catch (err) {
        results.push({ email: adhoc.email, status: "failed", error: String(err) });
      }
    }
  }

  if (results.length === 0) {
    return NextResponse.json({ error: "No valid recipients found" }, { status: 400 });
  }

  const { data: emailLog } = await supabase
    .from("email_log")
    .insert({
      sender: "ralph@primedealerfund.com",
      subject,
      body,
      recipient_count: results.length,
      recipients: results,
      status: results.every((r) => r.status === "sent") ? "sent" : "partial",
    })
    .select()
    .single();

  if (emailLog) {
    // Only log communications for database investors
    const investorResults = results.filter((r) => r.investorId);
    if (investorResults.length > 0) {
      const commEntries = investorResults.map((r) => ({
        investor_id: r.investorId,
        date: new Date().toISOString().split("T")[0],
        type: "Email",
        subject: `[Admin Email] ${subject}`,
        response: "Pending",
        next_step: "Await response",
      }));

      await supabase.from("communication_log").insert(commEntries);
    }

    const recipientEntries = results.map((r) => ({
      email_log_id: emailLog.id,
      investor_id: r.investorId || null,
      email: r.email,
      status: r.status,
    }));

    await supabase.from("email_recipients").insert(recipientEntries);
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const failedErrors = results.filter((r) => r.status === "failed").map((r) => r.error).filter(Boolean);

  return NextResponse.json({
    sent,
    failed,
    total: results.length,
    ...(failed > 0 && failedErrors.length > 0 ? { error: failedErrors.join("; ") } : {}),
  });
}
