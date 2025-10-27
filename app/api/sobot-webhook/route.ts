import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/db-operations";
import { revalidatePath } from "next/cache";
import { FlowHandler } from "@/lib/flows/flow-handler";
import { findOrCreateThread } from "@/lib/db-operations";

// Verification token (hard-coded as per Sobot requirements)
const VERIFICATION_TOKEN = "BotPe2025!";

interface SobotVerificationRequest {
  verification_token: string;
  challenge: string;
}

interface SobotMessage {
  event_type: "messages:in" | "messages:out" | "messages:status";
  message_id?: string;
  channel_id?: string;
  sender_id?: string;
  recipient_id?: string;
  text?: string;
  timestamp?: number;
  status?: string;
  status_code?: number;
  [key: string]: any;
}

interface SobotWebhookPayload {
  event_type: "messages:in" | "messages:out" | "messages:status";
  data: SobotMessage;
}

/**
 * Sobot Webhook Verification and Message Handler
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[Sobot Webhook] Received request");
    console.log("[Sobot Webhook] Body:", JSON.stringify(body, null, 2));

    // Check if this is a verification request
    if ("verification_token" in body && "challenge" in body) {
      return handleVerification(body as SobotVerificationRequest);
    }

    // Handle webhook events
    if ("event_type" in body && "data" in body) {
      return handleWebhookEvent(body as SobotWebhookPayload);
    }

    console.error("[Sobot Webhook] Unknown request format");
    return NextResponse.json(
      { error: "Unknown request format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Sobot Webhook] Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle webhook verification
 */
function handleVerification(
  request: SobotVerificationRequest
): NextResponse {
  console.log("[Sobot Webhook] Verification request received");
  console.log("[Sobot Webhook] Token:", request.verification_token);
  console.log("[Sobot Webhook] Challenge:", request.challenge);

  // Verify the token
  if (request.verification_token !== VERIFICATION_TOKEN) {
    console.error(
      "[Sobot Webhook] Verification failed: Invalid token"
    );
    return NextResponse.json(
      { error: "Invalid verification token" },
      { status: 403 }
    );
  }

  console.log("[Sobot Webhook] Verification successful");

  // Return the challenge as required by Sobot
  return NextResponse.json(
    { challenge: request.challenge },
    { status: 200 }
  );
}

/**
 * Handle webhook events (messages:in, messages:out, messages:status)
 */
async function handleWebhookEvent(
  payload: SobotWebhookPayload
): Promise<NextResponse> {
  console.log(`[Sobot Webhook] Event type: ${payload.event_type}`);

  switch (payload.event_type) {
    case "messages:in":
      await handleIncomingMessage(payload.data);
      break;

    case "messages:out":
      await handleOutgoingMessage(payload.data);
      break;

    case "messages:status":
      await handleMessageStatus(payload.data);
      break;

    default:
      console.warn(
        `[Sobot Webhook] Unknown event type: ${payload.event_type}`
      );
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}

/**
 * Handle incoming messages (messages:in)
 */
async function handleIncomingMessage(data: SobotMessage): Promise<void> {
  console.log("[Sobot Webhook] Incoming message");
  console.log("[Sobot Webhook] Sender:", data.sender_id);
  console.log("[Sobot Webhook] Text:", data.text);

  if (!data.sender_id || !data.text) {
    console.error("[Sobot Webhook] Missing sender_id or text");
    return;
  }

  try {
    const senderSsid = data.sender_id;
    const messageText = data.text;

    // Get or create thread
    const thread = await findOrCreateThread(senderSsid);

    // Save user message
    await createMessage({
      senderSsid,
      content: messageText,
      messageType: "text",
      metadata: {
        messageId: data.message_id,
        channelId: data.channel_id,
        timestamp: data.timestamp,
      },
    });

    console.log("[Sobot Webhook] Message saved to database");

    // Check for "clear" command
    if (messageText.trim().toLowerCase() === "clear") {
      console.log("[Sobot Webhook] Clear command detected");
      // Note: Clear command handling would go here
      // For now, just process normally
    }

    // Process message through flow system
    try {
      await FlowHandler.processMessage(thread.id, senderSsid, messageText);
      console.log("[Sobot Webhook] Message processed through flow system");
    } catch (error) {
      console.error("[Sobot Webhook] Error processing flow:", error);
    }

    // Revalidate the home page to show new messages
    revalidatePath("/");
  } catch (error) {
    console.error("[Sobot Webhook] Error handling incoming message:", error);
  }
}

/**
 * Handle outgoing message status (messages:out)
 */
async function handleOutgoingMessage(data: SobotMessage): Promise<void> {
  console.log("[Sobot Webhook] Outgoing message status");
  console.log("[Sobot Webhook] Message ID:", data.message_id);
  console.log("[Sobot Webhook] Status:", data.status);

  // Log outgoing message confirmation
  // This is useful for tracking which messages were successfully sent
  if (data.message_id && data.status) {
    console.log(
      `[Sobot Webhook] Message ${data.message_id} sent with status: ${data.status}`
    );
  }
}

/**
 * Handle message status updates (messages:status)
 */
async function handleMessageStatus(data: SobotMessage): Promise<void> {
  console.log("[Sobot Webhook] Message status update");
  console.log("[Sobot Webhook] Message ID:", data.message_id);
  console.log("[Sobot Webhook] Status:", data.status);
  console.log("[Sobot Webhook] Status Code:", data.status_code);

  // Log status updates (delivered, read, failed, etc.)
  if (data.message_id && data.status) {
    console.log(
      `[Sobot Webhook] Message ${data.message_id} status: ${data.status} (code: ${data.status_code})`
    );

    // Handle failures
    if (data.status === "failed" && data.status_code) {
      console.error(
        `[Sobot Webhook] Message failed with code ${data.status_code}`
      );

      // Special handling for specific error codes
      if (data.status_code === 470) {
        console.error(
          "[Sobot Webhook] Error 470: User not in 24h window - message template required"
        );
      }
    }
  }
}
