import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/db-operations";
import { revalidatePath } from "next/cache";
import { FlowHandler } from "@/lib/flows/flow-handler";
import { findOrCreateThread } from "@/lib/db-operations";

// Verify token (hard-coded as specified)
const VERIFY_TOKEN = "ShakeyBot2025";

interface GenericMessage {
  sender?: {
    id: string;
  };
  recipient?: {
    id: string;
  };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    attachments?: any[];
  };
  postback?: {
    title?: string;
    payload: string;
  };
  delivery?: {
    mids?: string[];
    watermark?: number;
  };
  read?: {
    watermark?: number;
  };
  [key: string]: any;
}

interface GenericWebhookPayload {
  object?: string;
  entry?: Array<{
    id: string;
    time: number;
    messaging?: GenericMessage[];
    changes?: any[];
  }>;
  [key: string]: any;
}

/**
 * Generic Webhook Verification (GET request)
 * Supports Facebook-style verification with hub.verify_token
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("[Generic Webhook] GET request received");
  console.log("[Generic Webhook] Mode:", mode);
  console.log("[Generic Webhook] Token:", token);
  console.log("[Generic Webhook] Challenge:", challenge);

  // Verify the token
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Generic Webhook] Verification successful");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("[Generic Webhook] Verification failed");
  return NextResponse.json(
    { error: "Verification failed" },
    { status: 403 }
  );
}

/**
 * Generic Webhook Handler (POST request)
 * Handles various webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenericWebhookPayload = await request.json();

    console.log("[Generic Webhook] Received webhook event");
    console.log("[Generic Webhook] Body:", JSON.stringify(body, null, 2));

    // Handle different webhook formats
    if (body.object === "page" && body.entry) {
      // Facebook/Messenger format
      await handleFacebookFormat(body);
    } else if (body.entry && Array.isArray(body.entry)) {
      // Generic entry-based format
      await handleGenericFormat(body);
    } else {
      // Direct message format
      await handleDirectMessage(body);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("[Generic Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle Facebook/Messenger format webhooks
 */
async function handleFacebookFormat(payload: GenericWebhookPayload): Promise<void> {
  console.log("[Generic Webhook] Processing Facebook format");

  if (!payload.entry) return;

  for (const entry of payload.entry) {
    if (entry.messaging) {
      for (const event of entry.messaging) {
        await handleMessagingEvent(event);
      }
    }
  }
}

/**
 * Handle generic entry-based format
 */
async function handleGenericFormat(payload: GenericWebhookPayload): Promise<void> {
  console.log("[Generic Webhook] Processing generic format");

  if (!payload.entry) return;

  for (const entry of payload.entry) {
    if (entry.messaging) {
      for (const event of entry.messaging) {
        await handleMessagingEvent(event);
      }
    } else if (entry.changes) {
      console.log("[Generic Webhook] Changes detected:", entry.changes);
    }
  }
}

/**
 * Handle direct message format (no entry wrapper)
 */
async function handleDirectMessage(payload: any): Promise<void> {
  console.log("[Generic Webhook] Processing direct message format");

  // Treat the entire payload as a message event
  await handleMessagingEvent(payload);
}

/**
 * Handle individual messaging events
 */
async function handleMessagingEvent(event: GenericMessage): Promise<void> {
  console.log("[Generic Webhook] ==========================================");
  console.log("[Generic Webhook] Event structure:", JSON.stringify(event, null, 2));
  console.log("[Generic Webhook] Has message:", !!event.message);
  console.log("[Generic Webhook] Has postback:", !!event.postback);
  console.log("[Generic Webhook] Has delivery:", !!event.delivery);
  console.log("[Generic Webhook] Has read:", !!event.read);
  console.log("[Generic Webhook] ==========================================");

  const senderSsid = event.sender?.id;

  if (!senderSsid) {
    console.warn("[Generic Webhook] No sender ID found, skipping event");
    return;
  }

  try {
    // Handle text messages
    if (event.message?.text) {
      console.log(`[Generic Webhook] Text message from ${senderSsid}: ${event.message.text}`);

      // Get or create thread
      const thread = await findOrCreateThread(senderSsid);

      // Save user message
      await createMessage({
        senderSsid,
        content: event.message.text,
        messageType: "text",
        metadata: {
          mid: event.message.mid,
          timestamp: event.timestamp,
        },
      });

      console.log("[Generic Webhook] Message saved to database");

      // Process message through flow system
      try {
        await FlowHandler.processMessage(thread.id, senderSsid, event.message.text);
        console.log("[Generic Webhook] Message processed through flow system");
      } catch (error) {
        console.error("[Generic Webhook] Error processing flow:", error);
      }

      // Revalidate the home page
      revalidatePath("/");
    }

    // Handle postback (button clicks)
    if (event.postback) {
      console.log(`[Generic Webhook] Postback from ${senderSsid}: ${event.postback.payload}`);

      // Get or create thread
      const thread = await findOrCreateThread(senderSsid);

      await createMessage({
        senderSsid,
        content: event.postback.title || event.postback.payload,
        messageType: "postback",
        metadata: {
          payload: event.postback.payload,
          timestamp: event.timestamp,
        },
      });

      console.log("[Generic Webhook] Postback saved to database");

      // Process postback through flow system
      try {
        await FlowHandler.processMessage(thread.id, senderSsid, event.postback.payload);
        console.log("[Generic Webhook] Postback processed through flow system");
      } catch (error) {
        console.error("[Generic Webhook] Error processing postback:", error);
      }

      // Revalidate the home page
      revalidatePath("/");
    }

    // Handle attachments
    if (event.message?.attachments) {
      console.log(`[Generic Webhook] Attachment from ${senderSsid}`);

      await createMessage({
        senderSsid,
        content: `[Attachment: ${event.message.attachments[0].type}]`,
        messageType: "attachment",
        metadata: {
          attachments: event.message.attachments,
          mid: event.message.mid,
          timestamp: event.timestamp,
        },
      });

      console.log("[Generic Webhook] Attachment saved to database");

      // Revalidate the home page
      revalidatePath("/");
    }

    // Handle delivery events
    if (event.delivery) {
      console.log(`[Generic Webhook] Delivery event from ${senderSsid}`);
      console.log("[Generic Webhook] Delivered messages:", event.delivery.mids);
      console.log("[Generic Webhook] Watermark:", event.delivery.watermark);
    }

    // Handle read events
    if (event.read) {
      console.log(`[Generic Webhook] Read event from ${senderSsid}`);
      console.log("[Generic Webhook] Read watermark:", event.read.watermark);
    }
  } catch (error) {
    console.error("[Generic Webhook] Error handling messaging event:", error);
  }
}
