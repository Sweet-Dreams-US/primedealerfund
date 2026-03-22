import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  const { recipientIds, subject, body, senderEmail } = await request.json();

  if (!recipientIds?.length || !subject || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Fetch recipient emails
  const { data: recipients } = await supabase
    .from("investors")
    .select("id, first_name, last_name, email")
    .in("id", recipientIds);

  if (!recipients?.length) {
    return NextResponse.json({ error: "No valid recipients found" }, { status: 400 });
  }

  const validRecipients = recipients.filter((r) => r.email);

  if (!validRecipients.length) {
    return NextResponse.json({ error: "No recipients have email addresses" }, { status: 400 });
  }

  // Send emails via Resend (batch)
  const resend = getResend();
  const results = [];
  for (const recipient of validRecipients) {
    const personalizedBody = body
      .replace(/{{first_name}}/g, recipient.first_name || "")
      .replace(/{{last_name}}/g, recipient.last_name || "")
      .replace(/{{full_name}}/g, `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim());

    try {
      const { data } = await resend.emails.send({
        from: "Prime Dealer Equity Fund <invest@primedealerfund.com>",
        to: recipient.email,
        subject,
        html: personalizedBody,
      });

      results.push({ investorId: recipient.id, email: recipient.email, status: "sent", resendId: data?.id });
    } catch (err) {
      results.push({ investorId: recipient.id, email: recipient.email, status: "failed", error: String(err) });
    }
  }

  // Log to email_log
  const { data: emailLog } = await supabase
    .from("email_log")
    .insert({
      sender: senderEmail || "admin",
      subject,
      body,
      recipient_count: validRecipients.length,
      recipients: results,
      status: results.every((r) => r.status === "sent") ? "sent" : "partial",
    })
    .select()
    .single();

  // Log to communication_log for each recipient
  if (emailLog) {
    const commEntries = validRecipients.map((r) => ({
      investor_id: r.id,
      date: new Date().toISOString().split("T")[0],
      type: "Email",
      subject: `[Admin Email] ${subject}`,
      response: "Pending",
      next_step: "Await response",
    }));

    await supabase.from("communication_log").insert(commEntries);

    // Log email recipients
    const recipientEntries = results.map((r) => ({
      email_log_id: emailLog.id,
      investor_id: r.investorId,
      email: r.email,
      status: r.status,
    }));

    await supabase.from("email_recipients").insert(recipientEntries);
  }

  return NextResponse.json({
    sent: results.filter((r) => r.status === "sent").length,
    failed: results.filter((r) => r.status === "failed").length,
    total: validRecipients.length,
  });
}
