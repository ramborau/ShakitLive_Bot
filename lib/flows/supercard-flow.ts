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

import { FacebookService } from "../services/facebook-service";
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

    await FacebookService.sendTextMessage(userSsid, thinkingMessage);
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

    await FacebookService.sendTextMessage(userSsid, answer);
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
   * Show GET CARD button with beautiful coupon templates
   */
  private static async showOfferCard(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[SupercardFlow] Showing GET CARD offer with beautiful coupons");

    // Card URLs as specified
    const goldCardUrl = "https://shakeys-app.vercel.app/card#gold";
    const classicCardUrl = "https://shakeys-app.vercel.app/card#classic";

    // Facebook attachment IDs for uploaded images (permanent storage)
    const goldCardAttachmentId = "1882177566051424";
    const classicCardAttachmentId = "1060843276051770";

    const preMessage = language === "en"
      ? "🎴 Ready to unlock exclusive rewards? Here are your options!"
      : language === "tl"
      ? "🎴 Handa na ba kayong mag-unlock ng exclusive rewards? Eto po ang mga options!"
      : "🎴 Ready na po ba kayo to unlock exclusive rewards? Here are your options!";

    await FacebookService.sendTextMessage(userSsid, preMessage);
    await createMessage({
      senderSsid: userSsid,
      content: preMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Send Gold Card Coupon - Premium Option
    const goldTitle = language === "en"
      ? "🌟 Supercard Gold - Premium Benefits"
      : language === "tl"
      ? "🌟 Supercard Gold - Premium na Benepisyo"
      : "🌟 Supercard Gold - Premium Benefits";

    const goldSubtitle = language === "en"
      ? "Upgrade your experience! Includes Party Sized Welcome Pizza + all Supercard benefits. Limited time offer!"
      : language === "tl"
      ? "I-upgrade ang inyong experience! May kasamang Party Sized Welcome Pizza + lahat ng Supercard benefits. Limited time offer!"
      : "Upgrade po your experience! May kasama Party Sized Welcome Pizza + all Supercard benefits. Limited time offer!";

    const goldButtonTitle = language === "en" ? "GET GOLD CARD NOW" : language === "tl" ? "KUNIN ANG GOLD CARD" : "GET GOLD CARD NOW";

    const goldCouponPreMessage = language === "en"
      ? "🎉 Premium deal just for you!"
      : language === "tl"
      ? "🎉 Premium deal para sa inyo!"
      : "🎉 Premium deal just for you po!";

    const goldResult = await FacebookService.sendCouponTemplate(
      userSsid,
      goldTitle,
      "GOLD999",
      {
        subtitle: goldSubtitle,
        coupon_url: goldCardUrl,
        coupon_url_button_title: goldButtonTitle,
        coupon_pre_message: goldCouponPreMessage,
        attachment_id: goldCardAttachmentId,
        payload: "supercard_gold_999",
      }
    );

    await createMessage({
      senderSsid: userSsid,
      content: `Supercard Gold coupon sent (₱999)`,
      messageType: "coupon",
      isFromBot: true,
    });

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send Classic Card Coupon - Best Value Option
    const classicTitle = language === "en"
      ? "💳 Supercard Classic - Best Value"
      : language === "tl"
      ? "💳 Supercard Classic - Pinakamahusay na Halaga"
      : "💳 Supercard Classic - Best Value";

    const classicSubtitle = language === "en"
      ? "Start saving today! Enjoy amazing discounts, exclusive promos, and special perks. Great value for everyone!"
      : language === "tl"
      ? "Magsimula ng pag-save ngayon! Tamasahin ang mga diskwento, exclusive promos, at special perks. Sulit na sulit!"
      : "Start saving ngayon! Enjoy amazing discounts, exclusive promos, and special perks. Great value para sa lahat!";

    const classicButtonTitle = language === "en" ? "GET CLASSIC CARD NOW" : language === "tl" ? "KUNIN ANG CLASSIC CARD" : "GET CLASSIC CARD NOW";

    const classicCouponPreMessage = language === "en"
      ? "💰 Amazing value offer!"
      : language === "tl"
      ? "💰 Sulit na sulit na offer!"
      : "💰 Amazing value offer po!";

    const classicResult = await FacebookService.sendCouponTemplate(
      userSsid,
      classicTitle,
      "CLASSIC699",
      {
        subtitle: classicSubtitle,
        coupon_url: classicCardUrl,
        coupon_url_button_title: classicButtonTitle,
        coupon_pre_message: classicCouponPreMessage,
        attachment_id: classicCardAttachmentId,
        payload: "supercard_classic_699",
      }
    );

    await createMessage({
      senderSsid: userSsid,
      content: `Supercard Classic coupon sent (₱699)`,
      messageType: "coupon",
      isFromBot: true,
    });

    if (goldResult.success || classicResult.success) {
      const followUpMessage = language === "en"
        ? "✨ Click on your preferred card to get started! Both cards offer amazing benefits! 🎉"
        : language === "tl"
        ? "✨ I-click ang gusto ninyong card para magsimula! Parehong may kahanga-hangang benepisyo! 🎉"
        : "✨ Click po your preferred card to get started! Both cards offer amazing benefits! 🎉";

      await FacebookService.sendTextMessage(userSsid, followUpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: followUpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[SupercardFlow] Flow completed with beautiful coupon offers");
    } else {
      // If both coupons fail, fallback to webview button
      console.warn("[SupercardFlow] Coupons failed, falling back to webview button");

      const buttonText = language === "en"
        ? "Choose your Shakey's Supercard (Gold ₱999 or Classic ₱699)"
        : language === "tl"
        ? "Pumili ng inyong Shakey's Supercard (Gold ₱999 o Classic ₱699)"
        : "Choose po your Shakey's Supercard (Gold ₱999 or Classic ₱699)";

      const buttonTitle = language === "en" ? "VIEW CARDS" : language === "tl" ? "TINGNAN ANG MGA CARD" : "VIEW CARDS";

      await FacebookService.sendWebviewButton(userSsid, buttonText, buttonTitle, goldCardUrl, "full");

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
