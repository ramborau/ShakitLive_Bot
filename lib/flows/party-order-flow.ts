/**
 * Party Order Flow Module
 * Handles party/group order inquiries with packages carousel and inquiry options
 *
 * Steps:
 * 1. FLOW_START - Show party order intro + buttons (Packages / Inquire Now)
 * 2. SHOW_PACKAGES - Display package carousel with Inquire/Call buttons
 * 3. FLOW_END
 */

import { FacebookService } from "../services/facebook-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";

export type PartyOrderFlowStep =
  | "FLOW_START"
  | "SHOW_PACKAGES";

export interface PartyOrderFlowData {
  selectedPackage?: string;
}

// Party packages data
const PARTY_PACKAGES = [
  {
    id: "plated-a",
    name: "Plated Package A",
    price: "₱220",
    description: "1 pc Chicken 'N' Mojos® • 2 slices Hawaiian Delight pizza • 1 glass House Blend Iced Tea",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
  },
  {
    id: "plated-b",
    name: "Plated Package B",
    price: "₱250",
    description: "1 pc Chicken 'N' Mojos® • 1 serving Skilletti with garlic bread • 1 glass House Blend Iced Tea",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800"
  },
  {
    id: "plated-c",
    name: "Plated Package C",
    price: "₱299",
    description: "1 pc Chicken 'N' Mojos® • Skilletti with garlic bread • 2 slices Hawaiian pizza • House Blend Iced Tea",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800"
  },
  {
    id: "buffet-a",
    name: "Buffet Package A",
    price: "₱4,099",
    description: "Good for 10-12 pax • 2 Large Pizzas • 2 Pasta Family • 12 pcs Chicken • 2 rice platters • 3 pitchers drinks",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
  },
  {
    id: "buffet-b",
    name: "Buffet Package B",
    price: "₱4,799",
    description: "Good for 10-12 pax • 2 Large Pizzas • 2 Pasta Family • 12 pcs Chicken • 2 Salad Family • 3 pitchers drinks",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800"
  }
];

const INQUIRY_URL = "https://shakeys-app.vercel.app/group-order";
const CALL_NUMBER = "7777";

export class PartyOrderFlow {
  /**
   * Main handler for party order flow
   */
  static async handlePartyOrderFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as PartyOrderFlowStep;
    const data: PartyOrderFlowData = flowData || {};

    console.log(`[PartyOrderFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
        break;

      case "SHOW_PACKAGES":
        await this.handleShowPackages(threadId, userSsid, language);
        break;

      default:
        console.warn(`[PartyOrderFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, userMessage, language);
    }
  }

  /**
   * FLOW_START - Show party order intro and options
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    userMessage: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[PartyOrderFlow] Starting party order flow...");

    await ConversationManager.updateFlowStep(threadId, "FLOW_START", {});

    // Send intro message about party orders
    const introMessage = this.getIntroMessage(language);

    await FacebookService.sendTextMessage(userSsid, introMessage);
    await createMessage({
      senderSsid: userSsid,
      content: introMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Show buttons: Packages and Inquire Now
    const buttons = [
      {
        title: this.getButtonText("packages", language),
        type: "postback" as const,
        payload: "show_party_packages"
      },
      {
        title: this.getButtonText("inquire", language),
        type: "web_url" as const,
        url: INQUIRY_URL
      }
    ];

    const buttonMessage = this.getButtonMessage(language);

    await FacebookService.sendMixedButtonMessage(userSsid, buttonMessage, "", buttons);
    await createMessage({
      senderSsid: userSsid,
      content: `Party order buttons sent`,
      messageType: "button",
      isFromBot: true,
    });

    console.log("[PartyOrderFlow] Intro and buttons sent");
  }

  /**
   * SHOW_PACKAGES - Display package carousel
   */
  private static async handleShowPackages(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[PartyOrderFlow] Showing party packages carousel...");

    await ConversationManager.updateFlowStep(threadId, "SHOW_PACKAGES", {});

    const packagesMessage = this.getPackagesMessage(language);

    await FacebookService.sendTextMessage(userSsid, packagesMessage);
    await createMessage({
      senderSsid: userSsid,
      content: packagesMessage,
      messageType: "text",
      isFromBot: true,
    });

    // Create carousel items for packages
    const carouselItems = PARTY_PACKAGES.map(pkg => ({
      title: pkg.name,
      subtitle: `${pkg.price}\n${pkg.description}`,
      image_url: pkg.image,
      buttons: [
        {
          title: this.getButtonText("inquire", language),
          type: "web_url" as const,
          url: INQUIRY_URL
        },
        {
          title: this.getButtonText("call", language),
          type: "web_url" as const,
          url: `tel:${CALL_NUMBER}`
        }
      ]
    }));

    const result = await FacebookService.sendCarouselMessage(userSsid, carouselItems);

    await createMessage({
      senderSsid: userSsid,
      content: `Party packages carousel sent: ${PARTY_PACKAGES.length} packages`,
      messageType: "carousel",
      isFromBot: true,
    });

    if (result.success) {
      // Send follow-up message
      const followUpMessage = this.getFollowUpMessage(language);

      await FacebookService.sendTextMessage(userSsid, followUpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: followUpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[PartyOrderFlow] Flow completed with packages shown");
    } else {
      console.error("[PartyOrderFlow] Failed to send carousel");
      await this.handleError(threadId, userSsid, language);
    }
  }

  /**
   * Get intro message based on language
   */
  private static getIntroMessage(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "🎉 *Planning a Party or Group Event?*\n\n" +
        "Celebrate with Shakey's! We offer special party packages perfect for birthdays, gatherings, and corporate events.\n\n" +
        "📦 *What We Offer:*\n" +
        "• Plated Packages (₱220-₱299 per person)\n" +
        "• Buffet Packages (₱4,099-₱4,799 for 10-12 pax)\n" +
        "• Party Themes & Decorations\n" +
        "• Mascot Appearances\n\n" +
        "Let's make your celebration WOW-tastic! 🎈";
    } else if (language === "tl") {
      return "🎉 *Nagpaplano ng Party o Group Event?*\n\n" +
        "Ipagdiwang kasama ang Shakey's! Mayroon kaming special party packages para sa birthday, gatherings, at corporate events.\n\n" +
        "📦 *Ang Aming Alok:*\n" +
        "• Plated Packages (₱220-₱299 bawat tao)\n" +
        "• Buffet Packages (₱4,099-₱4,799 para sa 10-12 pax)\n" +
        "• Party Themes at Decorations\n" +
        "• Mascot Appearances\n\n" +
        "Gawing WOW-tastic ang inyong celebration! 🎈";
    } else {
      return "🎉 *Planning a Party or Group Event?*\n\n" +
        "Celebrate with Shakey's po! We offer special party packages perfect for birthdays, gatherings, and corporate events.\n\n" +
        "📦 *What We Offer:*\n" +
        "• Plated Packages (₱220-₱299 per person)\n" +
        "• Buffet Packages (₱4,099-₱4,799 for 10-12 pax)\n" +
        "• Party Themes at Decorations\n" +
        "• Mascot Appearances\n\n" +
        "Let's make your celebration WOW-tastic po! 🎈";
    }
  }

  /**
   * Get button message based on language
   */
  private static getButtonMessage(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "How would you like to proceed?";
    } else if (language === "tl") {
      return "Paano ninyo gustong magpatuloy?";
    } else {
      return "How po would you like to proceed?";
    }
  }

  /**
   * Get packages intro message based on language
   */
  private static getPackagesMessage(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "🎊 *Our Party Packages*\n\nHere are our available party packages. Choose what fits your celebration best!";
    } else if (language === "tl") {
      return "🎊 *Ang Aming Party Packages*\n\nNarito ang aming available party packages. Pumili ng pinakaangkop para sa inyong celebration!";
    } else {
      return "🎊 *Our Party Packages*\n\nHere po are our available party packages. Choose what fits your celebration best po!";
    }
  }

  /**
   * Get follow-up message based on language
   */
  private static getFollowUpMessage(language: "en" | "tl" | "taglish"): string {
    if (language === "en") {
      return "👆 Click 'Inquire Now' to submit your party details, or 'Call Us' to speak with our team directly!\n\n" +
        "📞 You can also call us at " + CALL_NUMBER + " for immediate assistance.";
    } else if (language === "tl") {
      return "👆 I-click ang 'Magtanong Ngayon' para isumite ang inyong party details, o 'Tawagan Kami' para makausap ang aming team!\n\n" +
        "📞 Pwede rin kayong tumawag sa " + CALL_NUMBER + " para sa agarang tulong.";
    } else {
      return "👆 Click po 'Inquire Now' to submit your party details, or 'Call Us' to speak with our team directly!\n\n" +
        "📞 You can also call po sa " + CALL_NUMBER + " for immediate assistance.";
    }
  }

  /**
   * Get button text based on type and language
   */
  private static getButtonText(type: string, language: "en" | "tl" | "taglish"): string {
    if (type === "packages") {
      if (language === "en") return "📦 Packages";
      if (language === "tl") return "📦 Mga Package";
      return "📦 Packages";
    }

    if (type === "inquire") {
      if (language === "en") return "📝 Inquire Now";
      if (language === "tl") return "📝 Magtanong Ngayon";
      return "📝 Inquire Now";
    }

    if (type === "call") {
      if (language === "en") return "📞 Call Us";
      if (language === "tl") return "📞 Tawagan Kami";
      return "📞 Call Us";
    }

    return "Button";
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
      ? "Oops! I'm having trouble showing the packages. Please call us at " + CALL_NUMBER + " or visit " + INQUIRY_URL + " to inquire about party orders."
      : language === "tl"
      ? "Pasensya na! May problema ako sa pagpakita ng packages. Mangyaring tumawag sa " + CALL_NUMBER + " o bisitahin ang " + INQUIRY_URL + " para magtanong tungkol sa party orders."
      : "Oops! May problema po ako sa pagshow ng packages. Please call po sa " + CALL_NUMBER + " or visit " + INQUIRY_URL + " to inquire about party orders.";

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
