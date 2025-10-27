/**
 * Promo Flow Module
 * Handles promo inquiries with beautiful COMPLEX COUPON templates
 *
 * Steps:
 * 1. FLOW_START - User asks about promos
 * 2. SHOW_PROMOS - Display beautiful coupon cards for each promo
 * 3. FLOW_END
 */

import { FacebookService } from "../services/facebook-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";

export type PromoFlowStep =
  | "FLOW_START"
  | "SHOW_PROMOS";

export interface PromoFlowData {
  promoShown?: boolean;
}

export class PromoFlow {
  /**
   * Main handler for promo flow
   */
  static async handlePromoFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as PromoFlowStep;
    const data: PromoFlowData = flowData || {};

    console.log(`[PromoFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, language);
        break;

      case "SHOW_PROMOS":
        await this.handleShowPromos(threadId, userSsid, language);
        break;

      default:
        console.warn(`[PromoFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, language);
    }
  }

  /**
   * FLOW_START - Show exciting promos message
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[PromoFlow] Starting promo flow...");

    const thinkingMessage = language === "en"
      ? "🎉 Let me show you our amazing deals and promos!"
      : language === "tl"
      ? "🎉 Ipapakita ko po sa inyo ang mga kahanga-hangang deals at promos!"
      : "🎉 Let me show you po our amazing deals and promos!";

    await FacebookService.sendTextMessage(userSsid, thinkingMessage);
    await createMessage({
      senderSsid: userSsid,
      content: thinkingMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Move to show promos step
    await ConversationManager.updateFlowStep(threadId, "SHOW_PROMOS", { promoShown: false });
    await this.showPromos(threadId, userSsid, language);
  }

  /**
   * SHOW_PROMOS - Display beautiful coupon cards
   */
  private static async handleShowPromos(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await this.showPromos(threadId, userSsid, language);
  }

  /**
   * Show beautiful COMPLEX COUPON templates for each promo
   */
  private static async showPromos(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[PromoFlow] Showing beautiful promo coupons");

    // Promo URLs (adjust these to actual promo landing pages)
    const familyMealUrl = "https://shakeyspizza.ph/promos/family-meal-deals";
    const mojosUrl = "https://shakeyspizza.ph/promos/pizza-mojos-bundles";
    const supercardUrl = "https://shakeyspizza.ph/promos/supercard-deals";

    // NOTE: These are placeholder attachment IDs - need to upload actual promo images
    // For now, using image URLs from Shakey's website
    const familyMealImage = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop";
    const mojosImage = "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop";
    const supercardImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop";

    const preMessage = language === "en"
      ? "🔥 Here are our HOT deals right now! Grab them before they're gone! 🍕✨"
      : language === "tl"
      ? "🔥 Narito po ang aming mga HOT deals ngayon! Kumuha na bago maubos! 🍕✨"
      : "🔥 Here po are our HOT deals right now! Grab them before maubos na! 🍕✨";

    await FacebookService.sendTextMessage(userSsid, preMessage);
    await createMessage({
      senderSsid: userSsid,
      content: preMessage,
      messageType: "text",
      isFromBot: true,
    });

    // 1. Family Meal Deals Coupon
    const familyTitle = language === "en"
      ? "🍕 Family Meal Deals - Perfect for Sharing!"
      : language === "tl"
      ? "🍕 Family Meal Deals - Perpekto para sa Buong Pamilya!"
      : "🍕 Family Meal Deals - Perfect for Sharing!";

    const familySubtitle = language === "en"
      ? "Complete meal packages from ₱1,149 to ₱2,699! Includes pizza, sides, and drinks. Feed the whole family with love and flavor!"
      : language === "tl"
      ? "Kompletong meal packages mula ₱1,149 hanggang ₱2,699! May kasama pizza, sides, at drinks. Busog ang buong pamilya!"
      : "Complete meal packages from ₱1,149 to ₱2,699! May kasama pizza, sides, and drinks. Busog the whole family!";

    const familyButton = language === "en" ? "VIEW FAMILY DEALS" : language === "tl" ? "TINGNAN ANG FAMILY DEALS" : "VIEW FAMILY DEALS";

    const familyPreMessage = language === "en"
      ? "💰 Best value for families!"
      : language === "tl"
      ? "💰 Pinaka-sulit para sa pamilya!"
      : "💰 Best value po for families!";

    const familyResult = await FacebookService.sendCouponTemplate(
      userSsid,
      familyTitle,
      "FAMILY2025",
      {
        subtitle: familySubtitle,
        coupon_url: familyMealUrl,
        coupon_url_button_title: familyButton,
        coupon_pre_message: familyPreMessage,
        image_url: familyMealImage,
        payload: "promo_family_meal_deals",
      }
    );

    await createMessage({
      senderSsid: userSsid,
      content: `Family Meal Deals coupon sent (₱1,149-₱2,699)`,
      messageType: "coupon",
      isFromBot: true,
    });

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Pizza 'N' Mojos Bundles Coupon
    const mojosTitle = language === "en"
      ? "🍟 Pizza 'N' Mojos Bundles - Unbeatable Combo!"
      : language === "tl"
      ? "🍟 Pizza 'N' Mojos Bundles - Hindi Mapapantayan!"
      : "🍟 Pizza 'N' Mojos Bundles - Unbeatable Combo!";

    const mojosSubtitle = language === "en"
      ? "Your favorite pizza paired with crispy, golden Mojos! The perfect combination for any occasion. Limited time only!"
      : language === "tl"
      ? "Ang paboritong pizza kasama ang crispy, malasang Mojos! Perpektong kombinasyon para sa anumang okasyon. Limited time lang!"
      : "Your favorite pizza paired with crispy, golden Mojos! Perfect combination para sa any occasion. Limited time only!";

    const mojosButton = language === "en" ? "GET BUNDLE NOW" : language === "tl" ? "KUNIN ANG BUNDLE" : "GET BUNDLE NOW";

    const mojosPreMessage = language === "en"
      ? "🎉 Fan favorite combo!"
      : language === "tl"
      ? "🎉 Paborito ng lahat!"
      : "🎉 Fan favorite combo!";

    const mojosResult = await FacebookService.sendCouponTemplate(
      userSsid,
      mojosTitle,
      "MOJOS2025",
      {
        subtitle: mojosSubtitle,
        coupon_url: mojosUrl,
        coupon_url_button_title: mojosButton,
        coupon_pre_message: mojosPreMessage,
        image_url: mojosImage,
        payload: "promo_pizza_mojos_bundle",
      }
    );

    await createMessage({
      senderSsid: userSsid,
      content: `Pizza 'N' Mojos Bundle coupon sent`,
      messageType: "coupon",
      isFromBot: true,
    });

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. SuperCard Exclusive Deals Coupon
    const scTitle = language === "en"
      ? "⭐ SuperCard Exclusive Deals - Members Only!"
      : language === "tl"
      ? "⭐ SuperCard Exclusive Deals - Para sa Members Lang!"
      : "⭐ SuperCard Exclusive Deals - Members Only!";

    const scSubtitle = language === "en"
      ? "Exclusive discounts and perks for SuperCard members! Get special pricing, birthday treats, and priority access to new promos."
      : language === "tl"
      ? "Exclusive discounts at perks para sa SuperCard members! Special pricing, birthday treats, at priority access sa bagong promos."
      : "Exclusive discounts and perks for SuperCard members! Get special pricing, birthday treats, and priority access sa new promos.";

    const scButton = language === "en" ? "VIEW SUPERCARD DEALS" : language === "tl" ? "TINGNAN ANG SUPERCARD DEALS" : "VIEW SUPERCARD DEALS";

    const scPreMessage = language === "en"
      ? "✨ VIP perks await!"
      : language === "tl"
      ? "✨ VIP perks naghihintay!"
      : "✨ VIP perks await po!";

    const scResult = await FacebookService.sendCouponTemplate(
      userSsid,
      scTitle,
      "SCVIP2025",
      {
        subtitle: scSubtitle,
        coupon_url: supercardUrl,
        coupon_url_button_title: scButton,
        coupon_pre_message: scPreMessage,
        image_url: supercardImage,
        payload: "promo_supercard_exclusive",
      }
    );

    await createMessage({
      senderSsid: userSsid,
      content: `SuperCard Exclusive Deals coupon sent`,
      messageType: "coupon",
      isFromBot: true,
    });

    // Follow up message
    if (familyResult.success || mojosResult.success || scResult.success) {
      const followUpMessage = language === "en"
        ? "✨ Tap any promo to learn more and order now! Don't miss out on these amazing deals! 🎉"
        : language === "tl"
        ? "✨ I-tap ang kahit anong promo para matuto pa at mag-order na! Huwag palampasin ang mga kahanga-hangang deals! 🎉"
        : "✨ Tap po any promo to learn more and order na! Don't miss out sa amazing deals! 🎉";

      await FacebookService.sendTextMessage(userSsid, followUpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: followUpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[PromoFlow] Flow completed with beautiful coupon offers");
    } else {
      // If all coupons fail, fallback to text message
      console.warn("[PromoFlow] All coupons failed, falling back to text");

      const fallbackMessage = language === "en"
        ? "🎉 Current Promos:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nVisit shakeyspizza.ph/promos for full details!"
        : language === "tl"
        ? "🎉 Kasalukuyang Promos:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nBisitahin ang shakeyspizza.ph/promos para sa buong detalye!"
        : "🎉 Current Promos po:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nVisit po shakeyspizza.ph/promos for full details!";

      await FacebookService.sendTextMessage(userSsid, fallbackMessage);
      await createMessage({
        senderSsid: userSsid,
        content: fallbackMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[PromoFlow] Flow completed with text fallback");
    }
  }
}
