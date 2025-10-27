/**
 * Complaint Flow Module
 * Handles customer complaints with warm apology and human escalation
 *
 * Steps:
 * 1. FLOW_START - User complains → Display warm apology
 * 2. ESCALATE_HUMAN - Transfer to live agent with needsHuman flag
 * 3. FLOW_END
 */

import { SobotService } from "../services/sobot-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";

export type ComplaintFlowStep =
  | "FLOW_START"
  | "ESCALATE_HUMAN";

export interface ComplaintFlowData {
  complaintText?: string;
  escalationReason?: string;
}

export class ComplaintFlow {
  /**
   * Main handler for complaint flow
   */
  static async handleComplaintFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as ComplaintFlowStep;
    const data: ComplaintFlowData = flowData || { complaintText: userMessage };

    console.log(`[ComplaintFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
        break;

      case "ESCALATE_HUMAN":
        await this.handleEscalateHuman(threadId, userSsid, language);
        break;

      default:
        console.warn(`[ComplaintFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
    }
  }

  /**
   * FLOW_START - Display warm apology message
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    userMessage: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[ComplaintFlow] Starting complaint flow with warm apology...");

    // Warm apology message (professional and empathetic)
    const apologyMessage = this.getWarmApology(language);

    await SobotService.sendTextMessage(userSsid, apologyMessage);
    await createMessage({
      senderSsid: userSsid,
      content: apologyMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Move to escalation step
    await ConversationManager.updateFlowStep(threadId, "ESCALATE_HUMAN", {
      complaintText: userMessage,
      escalationReason: "customer_complaint",
    });

    // Small delay for better UX (shows bot is "thinking")
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this.showEscalationMessage(threadId, userSsid, language);
  }

  /**
   * Get warm apology message based on language
   */
  private static getWarmApology(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "😔 We're truly sorry to hear about your experience.\n\n" +
        "Your satisfaction is our top priority, and we want to make this right. " +
        "Let me connect you with our team who can help resolve this issue immediately.";
    } else if (language === "tl") {
      return "😔 Humihingi kami ng tawad sa inyong karanasan.\n\n" +
        "Ang inyong kasiyahan ay aming pangunahing layunin, at gusto naming ayusin ito. " +
        "Ikonekta ko kayo sa aming team na makakatulong na resolbahin ang problemang ito kaagad.";
    } else {
      return "😔 We're truly sorry po to hear about your experience.\n\n" +
        "Your satisfaction po is our top priority, and gusto namin to make this right. " +
        "Let me connect po you with our team who can help resolve this issue immediately.";
    }
  }

  /**
   * Show escalation message
   */
  private static async showEscalationMessage(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const escalationMessage = this.getEscalationMessage(language);

    await SobotService.sendTextMessage(userSsid, escalationMessage);
    await createMessage({
      senderSsid: userSsid,
      content: escalationMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Escalate to human
    await this.escalateToHuman(threadId, userSsid, language);
  }

  /**
   * Get escalation message
   */
  private static getEscalationMessage(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "👥 Connecting you to our customer care team...\n\n" +
        "A human agent will be with you shortly to personally assist with your concern. " +
        "Thank you for your patience! 🙏";
    } else if (language === "tl") {
      return "👥 Ikonekta ka namin sa aming customer care team...\n\n" +
        "Isang tao ay makikipag-ugnayan sa inyo sa lalong madaling panahon para tumulong sa inyong problema. " +
        "Salamat sa inyong pasensya! 🙏";
    } else {
      return "👥 Connecting po you to our customer care team...\n\n" +
        "A human agent po will be with you shortly para personally assist with your concern. " +
        "Thank you po for your patience! 🙏";
    }
  }

  /**
   * ESCALATE_HUMAN - Set needsHuman flag and end flow
   */
  private static async handleEscalateHuman(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await this.escalateToHuman(threadId, userSsid, language);
  }

  /**
   * Escalate conversation to human agent
   */
  private static async escalateToHuman(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[ComplaintFlow] Escalating to human agent...");

    // Set needsHuman flag in ConversationManager
    await ConversationManager.escalateToHuman(threadId, "complaint");

    // Send final message
    const finalMessage = language === "en"
      ? "💬 A member of our team will respond to you shortly. We appreciate your understanding!"
      : language === "tl"
      ? "💬 Sasagot sa inyo ang aming team sa lalong madaling panahon. Salamat sa inyong pag-unawa!"
      : "💬 A member po of our team will respond to you shortly. We appreciate po your understanding!";

    await SobotService.sendTextMessage(userSsid, finalMessage);
    await createMessage({
      senderSsid: userSsid,
      content: finalMessage,
      messageType: "text",
      isFromBot: true,
    });

    // End flow
    await ConversationManager.endFlow(threadId);
    console.log("[ComplaintFlow] Flow completed - escalated to human");
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
      ? "We're experiencing technical difficulties. Please contact our hotline for immediate assistance: 02-8888-8888"
      : language === "tl"
      ? "May teknikal na problema kami. Pakitawagan ang aming hotline para sa agarang tulong: 02-8888-8888"
      : "We're experiencing po technical difficulties. Please contact our hotline for immediate assistance: 02-8888-8888";

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });

    // Try to escalate anyway
    try {
      await ConversationManager.escalateToHuman(threadId, "complaint");
      await ConversationManager.endFlow(threadId);
    } catch (err) {
      console.error("[ComplaintFlow] Failed to escalate:", err);
    }
  }
}
