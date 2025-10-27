/**
 * Location Flow Module
 * Handles location inquiries with carousel display and Google Maps integration
 *
 * Steps:
 * 1. FLOW_START - User asks for locations
 * 2. SHOW_LOCATION_CAROUSEL - Display 5 locations with images and directions
 * 3. LOCATION_SELECTED - User clicks Get Directions → Google Maps webview
 * 4. FLOW_END
 */

import { FacebookService } from "../services/facebook-service";
import { ConversationManager } from "../services/conversation-manager";
import { createMessage } from "../db-operations";
import locations from "../../locations.json";

export type LocationFlowStep =
  | "FLOW_START"
  | "SHOW_LOCATION_CAROUSEL"
  | "LOCATION_SELECTED";

export interface LocationFlowData {
  selectedLocation?: {
    id: number;
    name: string;
    address: string;
    googleMapsUrl: string;
  };
}

export class LocationFlow {
  /**
   * Main handler for location flow
   */
  static async handleLocationFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as LocationFlowStep;
    const data: LocationFlowData = flowData || {};

    console.log(`[LocationFlow] Step: ${step}, User: ${userMessage}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, language);
        break;

      case "SHOW_LOCATION_CAROUSEL":
        await this.handleLocationSelection(threadId, userSsid, userMessage, data, language);
        break;

      case "LOCATION_SELECTED":
        await this.handleLocationSelected(threadId, userSsid, userMessage, data, language);
        break;

      default:
        console.warn(`[LocationFlow] Unknown step: ${step}`);
        await this.handleFlowStart(threadId, userSsid, language);
    }
  }

  /**
   * FLOW_START - Display location carousel
   */
  private static async handleFlowStart(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[LocationFlow] Starting location flow...");

    await ConversationManager.updateFlowStep(threadId, "SHOW_LOCATION_CAROUSEL", {});

    const message = language === "en"
      ? "📍 I can help you find the nearest Shakey's branch! Would you like me to show you branches near you?"
      : language === "tl"
      ? "📍 Makakatulong ako na hanapin ang pinakamalapit na Shakey's branch! Gusto niyo bang ipakita ko ang mga branch malapit sa inyo?"
      : "📍 I can help you po find the nearest Shakey's branch! Would you like me po to show you branches near you?";

    // Show typing indicator before message
    await FacebookService.sendTypingIndicator(userSsid, 1500);

    const quickReplies = [
      { content_type: "text" as const, title: "✅ Yes, show me", payload: "show_locations" },
      { content_type: "text" as const, title: "📞 Call instead", payload: "call_hotline" },
      { content_type: "text" as const, title: "🌐 Visit website", payload: "visit_website" }
    ];

    await FacebookService.sendQuickReplies(userSsid, message, quickReplies);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "quick_reply",
      isFromBot: true,
    });
  }

  /**
   * SHOW_LOCATION_CAROUSEL - Display locations with images and Get Directions buttons
   */
  private static async showLocationCarousel(
    threadId: string,
    userSsid: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[LocationFlow] Showing location carousel...");

    // Show typing indicator before carousel
    await FacebookService.sendTypingIndicator(userSsid, 1500);

    const carouselItems = locations.map((location) => ({
      title: location.name,
      subtitle: `${location.address}\n📞 ${location.phone}`,
      image_url: location.image,
      buttons: [
        {
          title: language === "en" ? "Get Directions" : language === "tl" ? "Kunin Direksyon" : "Get Directions",
          type: "web_url" as const,
          url: location.googleMapsUrl,
        },
      ],
    }));

    const result = await FacebookService.sendCarouselMessage(userSsid, carouselItems);

    if (result.success) {
      console.log("[LocationFlow] Location carousel sent successfully");

      // Log carousel message
      await createMessage({
        senderSsid: userSsid,
        content: `📍 Showing ${locations.length} locations carousel`,
        messageType: "carousel",
        isFromBot: true,
      });

      // Send additional help message
      const helpMessage = language === "en"
        ? "Click 'Get Directions' to open Google Maps and navigate to your chosen location! 🗺️"
        : language === "tl"
        ? "I-click ang 'Kunin Direksyon' para buksan ang Google Maps at pumunta sa inyong napiling lokasyon! 🗺️"
        : "Click 'Get Directions' para open Google Maps and navigate sa chosen location niyo! 🗺️";

      await FacebookService.sendTextMessage(userSsid, helpMessage);
      await createMessage({
        senderSsid: userSsid,
        content: helpMessage,
        messageType: "text",
        isFromBot: true,
      });

      // Mark flow as completed since user will click external link
      await ConversationManager.endFlow(threadId);
      console.log("[LocationFlow] Flow completed - waiting for user action");
    } else {
      console.error("[LocationFlow] Failed to send carousel");
      await this.handleError(threadId, userSsid, language);
    }
  }

  /**
   * Handle location selection (if user sends text instead of clicking)
   */
  private static async handleLocationSelection(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: LocationFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log(`[LocationFlow] Handling location selection: ${userMessage}`);

    // Handle quick reply responses
    if (userMessage === "show_locations") {
      // User wants to see locations - show carousel
      await this.showLocationCarousel(threadId, userSsid, language);
      return;
    }

    if (userMessage === "call_hotline") {
      const message = language === "en"
        ? "📞 You can call Shakey's hotline at 7777-7777 or Globe/TM #77-777 (toll-free). How else can I help you?"
        : language === "tl"
        ? "📞 Maaari ninyong tawagan ang Shakey's hotline sa 7777-7777 o Globe/TM #77-777 (libre). Ano pa ang maitutulong ko?"
        : "📞 You can call po Shakey's hotline at 7777-7777 or Globe/TM #77-777 (toll-free). How else can I help you po?";

      await FacebookService.sendTypingIndicator(userSsid, 1500);
      await FacebookService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
      await ConversationManager.endFlow(threadId);
      return;
    }

    if (userMessage === "visit_website") {
      const message = language === "en"
        ? "🌐 Visit our website at shakeyspizza.ph/stores to find all our locations! How else can I help you?"
        : language === "tl"
        ? "🌐 Bisitahin ang aming website sa shakeyspizza.ph/stores para makita ang lahat ng aming lokasyon! Ano pa ang maitutulong ko?"
        : "🌐 Visit po our website at shakeyspizza.ph/stores to find all our locations! How else can I help you po?";

      await FacebookService.sendTypingIndicator(userSsid, 1500);
      await FacebookService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
      await ConversationManager.endFlow(threadId);
      return;
    }

    // Check if user is asking for directions or another location query
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("direction") ||
      lowerMessage.includes("direksyon") ||
      lowerMessage.includes("map") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("location")
    ) {
      // Re-show carousel
      await this.showLocationCarousel(threadId, userSsid, language);
      return;
    }

    // Try to match location by number or name
    const locationIndex = parseInt(userMessage) - 1;
    let selectedLocation = null;

    if (!isNaN(locationIndex) && locationIndex >= 0 && locationIndex < locations.length) {
      selectedLocation = locations[locationIndex];
    } else {
      // Try to find by name
      selectedLocation = locations.find((loc) =>
        loc.name.toLowerCase().includes(lowerMessage) ||
        lowerMessage.includes(loc.name.toLowerCase())
      );
    }

    if (selectedLocation) {
      await ConversationManager.updateFlowStep(threadId, "LOCATION_SELECTED", {
        selectedLocation: {
          id: selectedLocation.id,
          name: selectedLocation.name,
          address: selectedLocation.address,
          googleMapsUrl: selectedLocation.googleMapsUrl,
        },
      });

      const message = language === "en"
        ? `📍 Great! Here's how to get to ${selectedLocation.name}:`
        : language === "tl"
        ? `📍 Salamat! Narito kung paano pumunta sa ${selectedLocation.name}:`
        : `📍 Great po! Here's kung paano pumunta sa ${selectedLocation.name}:`;

      await FacebookService.sendTextMessage(userSsid, message);
      await createMessage({
        senderSsid: userSsid,
        content: message,
        messageType: "text",
        isFromBot: true,
      });

      // Send webview button for Google Maps
      await FacebookService.sendWebviewButton(
        userSsid,
        `${selectedLocation.name}\n${selectedLocation.address}`,
        language === "en" ? "Open in Google Maps" : language === "tl" ? "Buksan sa Google Maps" : "Open sa Google Maps",
        selectedLocation.googleMapsUrl,
        "full"
      );

      await createMessage({
        senderSsid: userSsid,
        content: `Google Maps button sent for ${selectedLocation.name}`,
        messageType: "button",
        isFromBot: true,
      });

      // End flow
      await ConversationManager.endFlow(threadId);
      console.log("[LocationFlow] Flow completed with selected location");
    } else {
      // Unknown response - show options again
      const message = language === "en"
        ? "I didn't quite catch that. Let me show you our locations again:"
        : language === "tl"
        ? "Hindi ko po naintindihan. Ipakita ko ulit ang aming mga lokasyon:"
        : "Hindi ko po naintindihan. Let me show ulit our locations:";

      await FacebookService.sendTextMessage(userSsid, message);
      await createMessage({
        senderSsid: userSsid,
        content: message,
        messageType: "text",
        isFromBot: true,
      });

      await this.showLocationCarousel(threadId, userSsid, language);
    }
  }

  /**
   * Handle location selected (final step)
   */
  private static async handleLocationSelected(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: LocationFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    console.log("[LocationFlow] Location already selected, ending flow");

    const message = language === "en"
      ? "Is there anything else I can help you with? 😊"
      : language === "tl"
      ? "May iba pa ba akong matutulungan sa inyo? 😊"
      : "May iba pa po ba akong pwedeng tulungan? 😊";

    await FacebookService.sendTextMessage(userSsid, message);
    await createMessage({
      senderSsid: userSsid,
      content: message,
      messageType: "text",
      isFromBot: true,
    });

    await ConversationManager.endFlow(threadId);
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
      ? "Oops! I'm having trouble showing our locations right now. Please try again or type 'live agent' for human assistance."
      : language === "tl"
      ? "Pasensya na! May problema ako sa pagpapakita ng aming mga lokasyon. Subukan muli o i-type ang 'live agent' para sa tao."
      : "Oops! May problema po ako sa pagshow ng locations. Please try ulit or type 'live agent' para sa human assistance.";

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
