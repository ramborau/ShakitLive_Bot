/**
 * Supercard Flow Module
 * Handles Supercard inquiries with FAQ lookup and GET CARD offer
 *
 * Steps:
 * 1. FLOW_START - User asks about Supercard → Gemini searches FAQ
 * 2. SHOW_ANSWER - Display FAQ answer
 * 3. OFFER_CARD - Show "GET CARD" button with image + webview
 * 4. FLOW_END
 */

import { SobotService } from "../services/sobot-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";
import { FAQService } from "../services/faq-service";

export type SupercardFlowStep =
  | "FLOW_START"
  | "SHOW_ANSWER"
  | "OFFER_CARD";

export interface SupercardFlowData {
  question?: string;
  answer?: string;
}

export class SupercardFlow {
  /**
   * Main handler for supercard flow
   */
  static async handleSupercardFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as SupercardFlowStep;
    const data: SupercardFlowData = flowData || {};

    console.log(`[SupercardFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
        break;

      case "SHOW_ANSWER":
        await this.handleShowAnswer(threadId, userSsid, data, language);
        break;

      case "OFFER_CARD":
        await this.handleOfferCard(threadId, userSsid, language);
        break;

      default:
        console.warn(`[SupercardFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
    }
  }

  /**
   * FLOW_START - Search FAQ database using Gemini
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    userMessage: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[SupercardFlow] Starting supercard flow...");

    const thinkingMessage = language === "en"
      ? "🔍 Let me find information about Supercard for you..."
      : language === "tl"
      ? "🔍 Hanapin ko po ang impormasyon tungkol sa Supercard..."
      : "🔍 Let me find po info about Supercard for you...";

    await SobotService.sendTextMessage(userSsid, thinkingMessage);
    await createMessage({
      senderSsid: userSsid,
      content: thinkingMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Search FAQ using FAQService
    try {
      const faqResults = await FAQService.searchFAQs(userMessage, language);
      const faqResult = faqResults.length > 0 ? { found: true, answer: faqResults[0].answer, question: faqResults[0].question } : { found: false };

      if (faqResult.found && faqResult.answer) {
        // FAQ found, show answer
        await ConversationManager.updateFlowStep(threadId, "SHOW_ANSWER", {
          question: faqResult.question || userMessage,
          answer: faqResult.answer,
        });

        await this.showAnswer(threadId, userSsid, faqResult.answer, language);
      } else {
        // No FAQ found, provide generic Supercard info
        await ConversationManager.updateFlowStep(threadId, "SHOW_ANSWER", {
          question: userMessage,
          answer: this.getGenericSupercardInfo(language),
        });

        await this.showAnswer(threadId, userSsid, this.getGenericSupercardInfo(language), language);
      }
    } catch (error) {
      console.error("[SupercardFlow] Error searching FAQ:", error);
      // Fallback to generic info
      await ConversationManager.updateFlowStep(threadId, "SHOW_ANSWER", {
        question: userMessage,
        answer: this.getGenericSupercardInfo(language),
      });

      await this.showAnswer(threadId, userSsid, this.getGenericSupercardInfo(language), language);
    }
  }

  /**
   * Get generic Supercard information (fallback)
   */
  private static getGenericSupercardInfo(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "🎴 *Shakey's Supercard*\n\n" +
        "Our loyalty card gives you amazing perks:\n" +
        "✅ Exclusive discounts\n" +
        "✅ Birthday treats\n" +
        "✅ Priority reservations\n" +
        "✅ Special promos\n\n" +
        "Get your Supercard today and enjoy the benefits!";
    } else if (language === "tl") {
      return "🎴 *Shakey's Supercard*\n\n" +
        "Ang aming loyalty card ay may mga kahanga-hangang benepisyo:\n" +
        "✅ Eksklusibong diskwento\n" +
        "✅ Birthday treats\n" +
        "✅ Priority reservations\n" +
        "✅ Special promos\n\n" +
        "Kumuha ng inyong Supercard ngayon at tamasahin ang mga benepisyo!";
    } else {
      return "🎴 *Shakey's Supercard*\n\n" +
        "Our loyalty card po gives amazing perks:\n" +
        "✅ Exclusive discounts\n" +
        "✅ Birthday treats\n" +
        "✅ Priority reservations\n" +
        "✅ Special promos\n\n" +
        "Get po your Supercard today and enjoy the benefits!";
    }
  }

  /**
   * Show FAQ answer
   */
  private static async showAnswer(
    threadId: string,
    userSsid: string,
    answer: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[SupercardFlow] Showing FAQ answer");

    await SobotService.sendTextMessage(userSsid, answer);
    await createMessage({
      senderSsid: userSsid,
      content: answer,
      messageType: "text",
      isFromBot: true,
    });

    // Move to offer card step
    await ConversationManager.updateFlowStep(threadId, "OFFER_CARD", {});
    await this.showOfferCard(threadId, userSsid, language);
  }

  /**
   * SHOW_ANSWER - Handle showing answer
   */
  private static async handleShowAnswer(
    threadId: string,
    userSsid: string,
    data: SupercardFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    // If answer exists in data, show it
    if (data.answer) {
      await this.showAnswer(threadId, userSsid, data.answer, language);
    } else {
      // Otherwise, show offer card directly
      await ConversationManager.updateFlowStep(threadId, "OFFER_CARD", {});
      await this.showOfferCard(threadId, userSsid, language);
    }
  }

  /**
   * OFFER_CARD - Show GET CARD button with image
   */
  private static async handleOfferCard(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await this.showOfferCard(threadId, userSsid, language);
  }

  /**
   * Show GET CARD button with webview
   */
  private static async showOfferCard(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[SupercardFlow] Showing GET CARD offer");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shakeys-app.vercel.app";

    // Card URLs as specified
    const goldCardUrl = "https://shakeys-app.vercel.app/card#gold";
    const classicCardUrl = "https://shakeys-app.vercel.app/card#classic";

    // Card images from public folder
    const goldCardImage = `${baseUrl}/goldcard.png`;
    const classicCardImage = `${baseUrl}/classiccard.png`;

    const message = language === "en"
      ? "🎴 Ready to unlock exclusive rewards?"
      : language === "tl"
      ? "🎴 Handa na ba kayong mag-unlock ng exclusive rewards?"
      : "🎴 Ready na po ba kayo to unlock exclusive rewards?";

    // Send carousel with both Gold and Classic cards
    const carouselItems = [
      // Gold Card - First
      {
        title: "Supercard Gold",
        subtitle: "Supercard Gold includes all your favorite Supercard Benefits and an upgraded Party Sized Welcome Pizza!\n\n₱ 999.00",
        image_url: goldCardImage,
        buttons: [
          {
            title: language === "en" ? "BUY NOW" : language === "tl" ? "BILHIN NGAYON" : "BUY NOW",
            type: "web_url" as const,
            url: goldCardUrl,
          },
        ],
      },
      // Classic Card - Second
      {
        title: "Supercard Classic",
        subtitle: "Experience the benefit of the Supercard Classic. Enjoy even more discounts than before.\n\nONLY ₱ 699.00",
        image_url: classicCardImage,
        buttons: [
          {
            title: language === "en" ? "BUY NOW" : language === "tl" ? "BILHIN NGAYON" : "BUY NOW",
            type: "web_url" as const,
            url: classicCardUrl,
          },
        ],
      },
    ];

    const result = await SobotService.sendCarouselMessage(userSsid, carouselItems);

    await createMessage({
      senderSsid: userSsid,
      content: `Supercard carousel sent: Gold (₱999) and Classic (₱699)`,
      messageType: "carousel",
      isFromBot: true,
    });

    if (result.success) {
      const followUpMessage = language === "en"
        ? "👆 Choose your Supercard and click 'BUY NOW' to get started! 🎉"
        : language === "tl"
        ? "👆 Pumili ng inyong Supercard at i-click ang 'BILHIN NGAYON' para magsimula! 🎉"
        : "👆 Choose po your Supercard and click 'BUY NOW' to get started! 🎉";

      await SobotService.sendTextMessage(userSsid, followUpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: followUpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[SupercardFlow] Flow completed with GET CARD offer");
    } else {
      // If carousel fails, try webview button for Gold card
      console.warn("[SupercardFlow] Carousel failed, falling back to webview button");

      const buttonText = language === "en"
        ? "Choose your Shakey's Supercard (Gold ₱999 or Classic ₱699)"
        : language === "tl"
        ? "Pumili ng inyong Shakey's Supercard (Gold ₱999 o Classic ₱699)"
        : "Choose po your Shakey's Supercard (Gold ₱999 or Classic ₱699)";

      const buttonTitle = language === "en" ? "VIEW CARDS" : language === "tl" ? "TINGNAN ANG MGA CARD" : "VIEW CARDS";

      await SobotService.sendWebviewButton(userSsid, buttonText, buttonTitle, goldCardUrl, "full");

      await createMessage({
        senderSsid: userSsid,
        content: `Webview button sent for Supercard: Gold and Classic options`,
        messageType: "button",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[SupercardFlow] Flow completed with webview button fallback");
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
      ? "Oops! I'm having trouble accessing Supercard information right now. Please try again or contact our hotline."
      : language === "tl"
      ? "Pasensya na! May problema ako sa pag-access ng Supercard information. Subukan muli o tawagan ang aming hotline."
      : "Oops! May problema po ako sa pag-access ng Supercard info. Please try ulit or tawagan our hotline.";

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });

    await ConversationManager.endFlow(threadId);
  }
}
