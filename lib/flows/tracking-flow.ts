/**
 * Tracking Flow Module
 * Handles order tracking inquiries with webview or text input options
 *
 * Steps:
 * 1. FLOW_START - Random choice: Webview or Text input
 * 2. SHOW_WEBVIEW - Display /track page button
 * 3. ASK_TRACKING_ID - Request tracking number
 * 4. SHOW_TRACKING_STATUS - Display formatted delivery time
 * 5. FLOW_END
 */

import { FacebookService } from "../services/facebook-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";

export type TrackingFlowStep =
  | "FLOW_START"
  | "SHOW_WEBVIEW"
  | "ASK_TRACKING_ID"
  | "SHOW_TRACKING_STATUS";

export interface TrackingFlowData {
  trackingId?: string;
  method?: "webview" | "text";
}

export class TrackingFlow {
  /**
   * Main handler for tracking flow
   */
  static async handleTrackingFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as TrackingFlowStep;
    const data: TrackingFlowData = flowData || {};

    console.log(`[TrackingFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, language);
        break;

      case "SHOW_WEBVIEW":
        await this.handleShowWebview(threadId, userSsid, language);
        break;

      case "ASK_TRACKING_ID":
        await this.handleAskTrackingId(threadId, userSsid, userMessage, data, language);
        break;

      case "SHOW_TRACKING_STATUS":
        await this.handleShowTrackingStatus(threadId, userSsid, language);
        break;

      default:
        console.warn(`[TrackingFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, language);
    }
  }

  /**
   * FLOW_START - Random choice between webview and text input
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[TrackingFlow] Starting tracking flow...");

    // Random choice: 50% webview, 50% text input
    const useWebview = Math.random() < 0.5;

    const message = language === "en"
      ? "🚚 Let me help you track your order!"
      : language === "tl"
      ? "🚚 Tulungan ko kayong i-track ang inyong order!"
      : "🚚 Let me help po you track your order!";

    await FacebookService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });

    if (useWebview) {
      await ConversationManager.updateFlowStep(threadId, "SHOW_WEBVIEW", { method: "webview" });
      await this.handleShowWebview(threadId, userSsid, language);
    } else {
      await ConversationManager.updateFlowStep(threadId, "ASK_TRACKING_ID", { method: "text" });
      await this.showAskTrackingIdMessage(threadId, userSsid, language);
    }
  }

  /**
   * SHOW_WEBVIEW - Display webview button to /track page
   */
  private static async handleShowWebview(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[TrackingFlow] Showing webview button...");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shakeys-app.vercel.app";
    const trackUrl = `${baseUrl}/track`;

    const buttonText = language === "en"
      ? "Track your order online"
      : language === "tl"
      ? "I-track ang inyong order online"
      : "Track po your order online";

    const buttonTitle = language === "en"
      ? "Open Tracker"
      : language === "tl"
      ? "Buksan Tracker"
      : "Open Tracker";

    const result = await FacebookService.sendWebviewButton(
      userSsid,
      buttonText,
      buttonTitle,
      trackUrl,
      "full"
    );

    await createMessage({
      senderSsid: userSsid,
      content: `Webview button sent for tracking: ${trackUrl}`,
      messageType: "button",
      isFromBot: true,
    });

    if (result.success) {
      const followUpMessage = language === "en"
        ? "Click the button above to track your order in real-time! 📦"
        : language === "tl"
        ? "I-click ang button sa itaas para i-track ang inyong order sa real-time! 📦"
        : "Click po the button above para ma-track your order in real-time! 📦";

      await FacebookService.sendTextMessage(userSsid, followUpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: followUpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow after showing webview
      await ConversationManager.endFlow(threadId);
      console.log("[TrackingFlow] Flow completed with webview option");
    } else {
      // If webview fails, fall back to text input
      console.warn("[TrackingFlow] Webview failed, falling back to text input");
      await ConversationManager.updateFlowStep(threadId, "ASK_TRACKING_ID", { method: "text" });
      await this.showAskTrackingIdMessage(threadId, userSsid, language);
    }
  }

  /**
   * Show message asking for tracking ID
   */
  private static async showAskTrackingIdMessage(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const message = language === "en"
      ? "Please enter your tracking number (e.g., #12345):"
      : language === "tl"
      ? "Pakiusap ilagay ang inyong tracking number (halimbawa: #12345):"
      : "Please po enter your tracking number (example: #12345):";

    await FacebookService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });
  }

  /**
   * ASK_TRACKING_ID - Handle tracking ID input
   */
  private static async handleAskTrackingId(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: TrackingFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log(`[TrackingFlow] Received tracking ID: ${userMessage}`);

    // Extract tracking ID from message (look for numbers or #)
    const trackingIdMatch = userMessage.match(/#?(\d+)/);
    const trackingId = trackingIdMatch ? trackingIdMatch[1] : userMessage.trim();

    if (!trackingId || trackingId.length < 3) {
      // Invalid tracking ID
      const message = language === "en"
        ? "I couldn't find a valid tracking number. Please enter a valid tracking ID (e.g., #12345):"
        : language === "tl"
        ? "Hindi ko nahanap ang valid tracking number. Pakiusap ilagay ang valid tracking ID (halimbawa: #12345):"
        : "Hindi po ko nakahanap ng valid tracking number. Please enter valid tracking ID (example: #12345):";

      await FacebookService.sendTextMessage(userSsid, message);
      await createMessage({
        senderSsid: userSsid,
        content: message,
        messageType: "text",
        isFromBot: true,
      });
      return;
    }

    // Save tracking ID and show status
    await ConversationManager.updateFlowStep(threadId, "SHOW_TRACKING_STATUS", {
      ...data,
      trackingId,
    });

    await this.showTrackingStatus(threadId, userSsid, trackingId, language);
  }

  /**
   * SHOW_TRACKING_STATUS - Display formatted delivery time
   */
  private static async handleShowTrackingStatus(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const context = await ConversationManager.getContext(threadId);
    const trackingId = context.flowData?.trackingId || "12345";

    await this.showTrackingStatus(threadId, userSsid, trackingId, language);
  }

  /**
   * Show formatted tracking status
   */
  private static async showTrackingStatus(
    threadId: string,
    userSsid: string,
    trackingId: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log(`[TrackingFlow] Showing status for tracking ID: ${trackingId}`);

    // Simulate delivery time (in production, this would query a real tracking system)
    const deliveryMinutes = Math.floor(Math.random() * 20) + 15; // Random between 15-35 mins

    const statusMessage = this.formatTrackingStatus(trackingId, deliveryMinutes, language);

    await FacebookService.sendTextMessage(userSsid, statusMessage);
    await createMessage({
      senderSsid: userSsid,
      content: statusMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Send additional info
    const followUpMessage = language === "en"
      ? "We'll notify you when your order is on the way! 🎉"
      : language === "tl"
      ? "Aabisuhan ka namin kapag papunta na ang inyong order! 🎉"
      : "We'll notify po you when your order is on the way na! 🎉";

    await FacebookService.sendTextMessage(userSsid, followUpMessage);
    await createMessage({
      senderSsid: userSsid,
      content: followUpMessage,
      messageType: "text",
      isFromBot: true,
    });

    // End flow
    await ConversationManager.endFlow(threadId);
    console.log("[TrackingFlow] Flow completed with tracking status shown");
  }

  /**
   * Format tracking status message (nicely formatted with emoji)
   */
  private static formatTrackingStatus(
    trackingId: string,
    minutes: number,
    language: "en" | "tl" | "taglish"
  ): string {
    if (language === "en") {
      return `🚚 *Order Status*\n\n` +
        `📦 Tracking ID: #${trackingId}\n` +
        `⏱️ Estimated Delivery: *${minutes} Minutes*\n\n` +
        `✅ Your order is being prepared and will be delivered shortly!\n` +
        `🍕 Fresh and hot pizza on the way! 🔥`;
    } else if (language === "tl") {
      return `🚚 *Status ng Order*\n\n` +
        `📦 Tracking ID: #${trackingId}\n` +
        `⏱️ Tinatayang Oras ng Delivery: *${minutes} Minuto*\n\n` +
        `✅ Ang inyong order ay inihahanda na at maglalapit-lapit na!\n` +
        `🍕 Sariwang mainit na pizza! 🔥`;
    } else {
      return `🚚 *Order Status*\n\n` +
        `📦 Tracking ID: #${trackingId}\n` +
        `⏱️ Estimated Delivery: *${minutes} Minutes*\n\n` +
        `✅ Your order is being prepared na po and will be delivered soon!\n` +
        `🍕 Fresh and hot pizza on the way! 🔥`;
    }
  }

  /**
   * Handle errors
   */
  private static async handleError(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const message = language === "en"
      ? "Oops! I'm having trouble accessing the tracking system. Please try again later or contact our hotline."
      : language === "tl"
      ? "Pasensya na! May problema ako sa tracking system. Subukan muli mamaya o tawagan ang aming hotline."
      : "Oops! May problema po ako sa tracking system. Please try ulit later or tawagan our hotline.";

    await FacebookService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });

    await ConversationManager.endFlow(threadId);
  }
}
