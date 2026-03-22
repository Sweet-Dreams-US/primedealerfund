import { NextResponse } from "next/server";
import {
  getInboxMessages,
  getMessage,
  markMessageRead,
  createDraft,
  sendDraft,
  sendMail,
  replyToMessage,
  getMailFolders,
} from "@/lib/microsoft-graph";

// GET — Fetch inbox, drafts, sent, or a single message
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "inbox";
    const messageId = searchParams.get("id");

    // Single message
    if (action === "message" && messageId) {
      const message = await getMessage(messageId);
      return NextResponse.json(message);
    }

    // Mail folder counts
    if (action === "folders") {
      const folders = await getMailFolders();
      return NextResponse.json(folders);
    }

    // List messages from a folder
    const folder =
      action === "drafts" ? "drafts" : action === "sent" ? "sentitems" : "inbox";
    const top = parseInt(searchParams.get("top") || "25");
    const skip = parseInt(searchParams.get("skip") || "0");
    const search = searchParams.get("search") || undefined;

    const result = await getInboxMessages({ top, skip, search, folder });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Outlook GET error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — Create draft, send draft, send mail, reply, mark read
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create-draft") {
      const draft = await createDraft({
        subject: body.subject,
        body: body.body,
        bodyType: body.bodyType || "HTML",
        toRecipients: body.toRecipients || [],
        ccRecipients: body.ccRecipients || [],
        importance: body.importance,
      });
      return NextResponse.json({ success: true, draft });
    }

    if (action === "send-draft") {
      await sendDraft(body.messageId);
      return NextResponse.json({ success: true });
    }

    if (action === "send") {
      await sendMail({
        subject: body.subject,
        body: body.body,
        bodyType: body.bodyType || "HTML",
        toRecipients: body.toRecipients || [],
        ccRecipients: body.ccRecipients || [],
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reply") {
      await replyToMessage(body.messageId, body.comment);
      return NextResponse.json({ success: true });
    }

    if (action === "mark-read") {
      await markMessageRead(body.messageId, body.isRead ?? true);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Outlook POST error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
