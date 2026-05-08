import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Test-send endpoint.
 *
 * Sends a single preview email to the user's chosen test address using the
 * exact same branded HTML wrapper the queue worker produces. This lets Ralph
 * see the final layout in his own inbox before committing to a real send.
 *
 * Bypasses the queue / database / personalization (uses the supplied
 * preview name verbatim) so the response is synchronous and the email
 * arrives immediately.
 */

// Resend verifies domains case-sensitively against its stored record. Same
// caveat as the queue worker — domain MUST be lowercase or Resend rejects.
const FROM_ADDRESS = "Ralph Marcuccilli <Ralph@primedealerfund.com>";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Same wrapper the queue worker uses, with HTML-paste support. */
function buildEmailHtml(body: string) {
  const trimmed = body.trim();
  // If the body looks like an HTML fragment (starts with a tag), insert it
  // verbatim. Otherwise paragraphize each line as before.
  const isHtml = trimmed.startsWith("<");
  const rendered = isHtml
    ? body
    : body.split("\n").map((line: string) => line.trim() === "" ? "<br>" : `<p style="margin:0 0 12px 0;">${line}</p>`).join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:20px;">
    <tr>
      <td>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0;">
              <div style="color:#000000;font-size:14px;line-height:1.6;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
                ${rendered}
              </div>
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
    const { subject, body, testEmail, previewName } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing subject or body" }, { status: 400 });
    }
    if (!testEmail || !isValidEmail(String(testEmail))) {
      return NextResponse.json({ error: "Invalid test email address" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured: RESEND_API_KEY is missing" }, { status: 500 });
    }

    // Personalize using the preview name so {{first_name}} etc. render the
    // way they would in a real send.
    const first = String(previewName || "Ralph").trim();
    const last = "";
    const personalize = (text: string) =>
      text
        .replace(/{{first_name}}/g, first)
        .replace(/{{last_name}}/g, last)
        .replace(/{{full_name}}/g, `${first} ${last}`.trim());

    const personalizedSubject = `[TEST] ${personalize(subject)}`;
    const personalizedBody = personalize(body);
    const html = buildEmailHtml(personalizedBody);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [String(testEmail)],
      subject: personalizedSubject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message || "Resend rejected the test send" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sentTo: testEmail });
  } catch (err) {
    return NextResponse.json(
      { error: `Test send failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
