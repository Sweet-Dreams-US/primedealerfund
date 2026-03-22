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
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:20px;">
    <tr>
      <td>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Body -->
          <tr>
            <td style="padding:0;">
              <div style="color:#000000;font-size:14px;line-height:1.6;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
                ${body.split("\n").map((line: string) => line.trim() === "" ? "<br>" : `<p style="margin:0 0 12px 0;">${line}</p>`).join("\n")}
              </div>
              <!-- Signature -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="padding-right:16px;vertical-align:top;">
                    <img src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Equity Fund" width="100" style="height:auto;display:block;" />
                  </td>
                  <td style="vertical-align:top;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#000000;">
                    <strong>Ralph E. Marcuccilli</strong>, Manager<br>
                    Prime Management Partners LLC<br>
                    P: 260.417.6016<br>
                    <a href="mailto:Ralph@PrimeDealerFund.com" style="color:#0563C1;text-decoration:underline;">Ralph@PrimeDealerFund.com</a>
                  </td>
                </tr>
              </table>
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
  try {
    const { recipientIds, manualRecipients, adhocEmails, subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured: RESEND_API_KEY is missing" }, { status: 500 });
    }

    const supabase = createServerClient();
    const resend = getResend();
    const results: { investorId?: string | null; email: string; status: string; resendId?: string; error?: string }[] = [];

    // Send to database investors
    if (recipientIds?.length) {
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

    // Send to manual/adhoc email addresses (not in database)
    const externalRecipients = [
      ...(manualRecipients || []).map((r: { name?: string; address: string }) => ({ email: r.address, name: r.name || r.address.split("@")[0] })),
      ...(adhocEmails || []).map((r: { email: string; name: string }) => ({ email: r.email, name: r.name || r.email.split("@")[0] })),
    ];

    for (const adhoc of externalRecipients) {
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

        results.push({ investorId: null, email: adhoc.email, status: "sent", resendId: data?.id });
      } catch (err) {
        results.push({ investorId: null, email: adhoc.email, status: "failed", error: String(err) });
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
      const commEntries = results.filter((r) => r.investorId).map((r) => ({
        investor_id: r.investorId,
        date: new Date().toISOString().split("T")[0],
        type: "Email",
        subject: `[Admin Email] ${subject}`,
        response: r.status === "sent" ? "Pending" : "Failed to send",
        next_step: r.status === "sent" ? "Await response" : "Retry send",
      }));

      if (commEntries.length > 0) {
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
  } catch (err) {
    return NextResponse.json({ error: `Email send failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}
