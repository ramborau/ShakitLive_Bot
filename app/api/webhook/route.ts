import { NextRequest, NextResponse } from "next/server";
import { createMessage, createBotMessage } from "@/lib/db-operations";
import { revalidatePath } from "next/cache";
import { FlowHandler } from "@/lib/flows/flow-handler";
import { findOrCreateThread } from "@/lib/db-operations";
import { ConversationManager } from "@/lib/services/conversation-manager";
import { FacebookService } from "@/lib/services/facebook-service";

interface FacebookMessage {
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: any[];
  };
  postback?: {
    title: string;
    payload: string;
  };
}

interface FacebookEntry {
  id: string;
  time: number;
  messaging: FacebookMessage[];
}

interface FacebookWebhookPayload {
  object: string;
  entry: FacebookEntry[];
}

/**
 * Facebook Webhook Verification (GET request)
 * Facebook sends this when you first setup the webhook
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const hubChallenge = searchParams.get("hub.challenge");
  const challenge = searchParams.get("challenge") || searchParams.get("challange");

  // Accept Facebook verification requests
  if (mode === "subscribe" && hubChallenge) {
    console.log("[Webhook] Webhook verified (Facebook format)");
    return new NextResponse(hubChallenge, { status: 200 });
  }

  // Accept simple challenge parameter
  if (challenge) {
    console.log("[Webhook] Webhook verified (simple challenge)");
    return new NextResponse(challenge, { status: 200 });
  }

  // Default response
  console.log("[Webhook] Verification endpoint accessed");
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

/**
 * Facebook Webhook Handler (POST request)
 * Receives messages from Facebook Messenger
 */
export async function POST(request: NextRequest) {
  try {
    const body: FacebookWebhookPayload = await request.json();

    console.log("[Webhook] Received webhook event");

    // Make sure this is a page subscription
    if (body.object !== "page") {
      return NextResponse.json({ error: "Invalid object type" }, { status: 404 });
    }

    // Iterate over each entry
    for (const entry of body.entry) {
      // Iterate over webhook events
      for (const event of entry.messaging) {
        await handleMessagingEvent(event);
      }
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle individual messaging events
 */
async function handleMessagingEvent(event: FacebookMessage) {
  const senderSsid = event.sender.id;

  // DEBUG: Log full event structure to understand what we're receiving
  console.log("[Webhook DEBUG] ==========================================");
  console.log("[Webhook DEBUG] Full event structure:", JSON.stringify(event, null, 2));
  console.log("[Webhook DEBUG] Has message:", !!event.message);
  console.log("[Webhook DEBUG] Has message.text:", !!event.message?.text);
  console.log("[Webhook DEBUG] Has postback:", !!event.postback);
  console.log("[Webhook DEBUG] Message object:", event.message);
  console.log("[Webhook DEBUG] ==========================================");

  try {
    // Handle text messages
    if (event.message?.text) {
      console.log(
        `[Webhook] Message from ${senderSsid}: ${event.message.text}`
      );

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

      console.log("[Webhook] Message saved to database");

      // Check for "clear" command
      if (event.message.text.trim().toLowerCase() === "clear") {
        console.log("[Webhook] Clear command detected");

        try {
          // Get current language preference before clearing
          const context = await ConversationManager.getContext(thread.id);
          const language = context.language || "en";

          // Clear conversation history and reset thread state
          await ConversationManager.clearHistory(thread.id);

          // Send confirmation message
          const confirmationMessages = {
            en: "Conversation cleared! Starting fresh. How can I help you today?",
            tl: "Na-clear na po ang conversation! Magsisimula tayo from scratch. Paano ko kayo matutulungan ngayon?",
            taglish: "Conversation cleared na po! Fresh start tayo. How can I help you?"
          };

          const confirmationText = confirmationMessages[language];

          await FacebookService.sendTextMessage(senderSsid, confirmationText);
          await createBotMessage(senderSsid, confirmationText);

          console.log("[Webhook] Conversation cleared and confirmation sent");
        } catch (error) {
          console.error("[Webhook] Error clearing conversation:", error);
        }

        // Revalidate the home page to show cleared state
        revalidatePath("/");
        return; // Don't process further
      }

      // Process message through flow system
      try {
        await FlowHandler.processMessage(thread.id, senderSsid, event.message.text);
        console.log("[Webhook] Message processed through flow system");
      } catch (error) {
        console.error("[Webhook] Error processing flow:", error);
      }

      // Revalidate the home page to show new messages
      revalidatePath("/");
    }

    // Handle postback (button clicks)
    if (event.postback) {
      console.log(
        `[Webhook] Postback from ${senderSsid}: ${event.postback.payload}`
      );

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

      console.log("[Webhook] Postback saved to database");

      // Process postback through flow system (CRITICAL FIX)
      try {
        await FlowHandler.processMessage(thread.id, senderSsid, event.postback.payload);
        console.log("[Webhook] Postback processed through flow system");
      } catch (error) {
        console.error("[Webhook] Error processing postback:", error);
      }

      // Revalidate the home page
      revalidatePath("/");
    }

    // Handle attachments
    if (event.message?.attachments) {
      console.log(`[Webhook] Attachment from ${senderSsid}`);

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

      // Revalidate the home page
      revalidatePath("/");

      console.log("[Webhook] Attachment saved to database");
    }
  } catch (error) {
    console.error("[Webhook] Error handling messaging event:", error);
  }
}
