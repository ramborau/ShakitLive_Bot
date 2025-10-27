import { ConversationManager, FlowType, Language } from "../services/conversation-manager";
import { IntentDetector } from "../services/intent-detector";
import { FacebookService } from "../services/facebook-service";
import { createMessage, getUserByPsid, createBotMessageWithTracking } from "../db-operations";
import { ProductMatcher } from "../services/product-matcher";
import { OrderFlow } from "./order-flow";
import { LocationFlow } from "./location-flow";
import { TrackingFlow } from "./tracking-flow";
import { SupercardFlow } from "./supercard-flow";
import { PromoFlow } from "./promo-flow";
import { ComplaintFlow } from "./complaint-flow";
import { PartyOrderFlow } from "./party-order-flow";
import { FAQService } from "../services/faq-service";
import products from "../../products.json";
import locations from "../../locations.json";

export interface FlowResponse {
  message: string;
  shouldEnd?: boolean;
  buttons?: Array<{
    title: string;
    type: "postback" | "web_url";
    payload?: string;
    url?: string;
  }>;
}

export class FlowHandler {
  /**
   * Process incoming message and handle appropriate flow
   */
  static async processMessage(
    threadId: string,
    userSsid: string,
    userMessage: string
  ): Promise<void> {
    console.log(`[FlowHandler] Processing message for thread ${threadId}`);

    // Check if escalated to human
    const needsHuman = await ConversationManager.checkNeedsHuman(threadId);
    if (needsHuman) {
      console.log(`[FlowHandler] Thread escalated to human, skipping bot response`);
      return;
    }

    // Handle button payloads from welcome message
    if (userMessage === "start_order") {
      await ConversationManager.startFlow(threadId, "order");
      await OrderFlow.handleOrderFlow(threadId, userSsid, userMessage, null, null, "en", null);
      return;
    }

    if (userMessage === "start_tracking") {
      await ConversationManager.startFlow(threadId, "tracking");
      await TrackingFlow.handleTrackingFlow(threadId, userSsid, userMessage, null, null, "en");
      return;
    }

    if (userMessage === "show_menu") {
      await this.handleGreetingOrUnknown(threadId, userSsid, "unknown", language);
      return;
    }

    // Handle party order package button
    if (userMessage === "show_party_packages") {
      const language = await ConversationManager.updateLanguage(threadId, userMessage);
      const context = await ConversationManager.getContext(threadId);

      // If already in party flow, move to SHOW_PACKAGES step
      if (context.currentFlow === "party") {
        await ConversationManager.updateFlowStep(threadId, "SHOW_PACKAGES", {});
        await PartyOrderFlow.handlePartyOrderFlow(threadId, userSsid, userMessage, "SHOW_PACKAGES", {}, language);
      } else {
        // Start party flow and go directly to SHOW_PACKAGES
        await ConversationManager.startFlow(threadId, "party");
        await ConversationManager.updateFlowStep(threadId, "SHOW_PACKAGES", {});
        await PartyOrderFlow.handlePartyOrderFlow(threadId, userSsid, userMessage, "SHOW_PACKAGES", {}, language);
      }
      return;
    }

    // Get conversation history for context (reduced from 5 to 2 for speed)
    const history = await ConversationManager.getHistory(threadId, 2);

    // ALWAYS detect intent with Gemini AI (no shortcuts)
    const intentResult = await IntentDetector.detect(userMessage, history);
    console.log(`[FlowHandler] Detected intent: ${intentResult.intent} (${intentResult.confidence})`);
    if (intentResult.reasoning) {
      console.log(`[FlowHandler] Reasoning: ${intentResult.reasoning}`);
    }

    // Use AI-detected language or fallback to detection
    const language = intentResult.language || await ConversationManager.updateLanguage(threadId, userMessage);
    console.log(`[FlowHandler] Language: ${language}`);

    // Get current context
    const context = await ConversationManager.getContext(threadId);

    // Handle human request immediately
    if (intentResult.intent === "human_request") {
      await this.handleHumanRequest(threadId, userSsid, language);
      return;
    }

    // If in a flow, continue it
    if (context.currentFlow) {
      console.log(`[FlowHandler] Continuing ${context.currentFlow} flow`);
      await this.continueFlow(threadId, userSsid, userMessage, context.currentFlow, language, intentResult);
      return;
    }

    // Start new flow based on intent
    const flowType = IntentDetector.intentToFlow(intentResult.intent);
    if (flowType) {
      console.log(`[FlowHandler] Starting new flow: ${flowType}`);
      await ConversationManager.startFlow(threadId, flowType);
      await this.handleFlow(threadId, userSsid, userMessage, flowType, language, intentResult);
    } else {
      // Handle greeting or unknown
      await this.handleGreetingOrUnknown(threadId, userSsid, intentResult.intent, language);
    }
  }

  /**
   * Continue existing flow
   */
  private static async continueFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    flowType: FlowType,
    language: Language,
    intentResult?: any
  ): Promise<void> {
    if (!flowType) return;
    await this.handleFlow(threadId, userSsid, userMessage, flowType, language, intentResult);
  }

  /**
   * Route to appropriate flow handler
   */
  private static async handleFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    flowType: FlowType,
    language: Language,
    intentResult?: any
  ): Promise<void> {
    let response: FlowResponse;

    switch (flowType) {
      case "faq":
        response = await this.handleFAQFlow(userMessage, language);
        break;
      case "order":
        // Use comprehensive OrderFlow module
        await OrderFlow.handleOrderFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language,
          intentResult
        );
        return; // OrderFlow handles messaging internally
      case "location":
        // Use comprehensive LocationFlow module
        await LocationFlow.handleLocationFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // LocationFlow handles messaging internally
      case "tracking":
        // Use comprehensive TrackingFlow module
        await TrackingFlow.handleTrackingFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // TrackingFlow handles messaging internally
      case "supercard":
        // Use comprehensive SupercardFlow module
        await SupercardFlow.handleSupercardFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // SupercardFlow handles messaging internally
      case "promo":
        // Use comprehensive PromoFlow module
        await PromoFlow.handlePromoFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // PromoFlow handles messaging internally
      case "complaint":
        // Use comprehensive ComplaintFlow module
        await ComplaintFlow.handleComplaintFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // ComplaintFlow handles messaging internally
      case "party":
        // Use comprehensive PartyOrderFlow module
        await PartyOrderFlow.handlePartyOrderFlow(
          threadId,
          userSsid,
          userMessage,
          await ConversationManager.getContext(threadId).then(c => c.flowStep),
          await ConversationManager.getContext(threadId).then(c => c.flowData),
          language
        );
        return; // PartyOrderFlow handles messaging internally
      default:
        response = { message: this.getLocalizedMessage("default_response", language) };
    }

    // Send response
    if (response.buttons && response.buttons.length > 0) {
      await this.sendBotMessageWithButtons(userSsid, response.message, response.buttons, threadId);
    } else {
      await this.sendBotMessage(userSsid, response.message, threadId);
    }

    // End flow if indicated
    if (response.shouldEnd) {
      await ConversationManager.endFlow(threadId);
    }
  }

  /**
   * FAQ Flow Handler
   */
  private static async handleFAQFlow(userMessage: string, language: Language): Promise<FlowResponse> {
    const lowerMsg = userMessage.toLowerCase();

    // Menu inquiry
    if (lowerMsg.includes("menu") || lowerMsg.includes("what do you have") || lowerMsg.includes("ano meron")) {
      const categories = [...new Set(products.map(p => p.category))];
      return {
        message: this.getLocalizedMessage("menu_categories", language, { categories: categories.join(", ") }),
        shouldEnd: false,
      };
    }

    // Price inquiry
    if (lowerMsg.includes("price") || lowerMsg.includes("magkano") || lowerMsg.includes("how much")) {
      return {
        message: this.getLocalizedMessage("price_inquiry", language),
        shouldEnd: false,
      };
    }

    // Operating hours
    if (lowerMsg.includes("open") || lowerMsg.includes("hours") || lowerMsg.includes("bukas")) {
      return {
        message: this.getLocalizedMessage("operating_hours", language),
        shouldEnd: true,
      };
    }

    // Contact inquiry
    if (lowerMsg.includes("contact") || lowerMsg.includes("hotline") || lowerMsg.includes("number")) {
      return {
        message: this.getLocalizedMessage("contact_info", language),
        shouldEnd: true,
      };
    }

    // Generic FAQ response
    return {
      message: this.getLocalizedMessage("faq_general", language),
      shouldEnd: false,
    };
  }

  /**
   * Handle human request
   */
  private static async handleHumanRequest(threadId: string, userSsid: string, language: Language): Promise<void> {
    await ConversationManager.escalateToHuman(threadId, "user_requested");
    const message = this.getLocalizedMessage("human_escalation", language);
    await this.sendBotMessage(userSsid, message, threadId);
  }

  /**
   * Handle greeting or unknown intent
   */
  private static async handleGreetingOrUnknown(
    threadId: string,
    userSsid: string,
    intent: string,
    language: Language
  ): Promise<void> {
    if (intent === "greeting") {
      // Send Zappy welcome message with personalization (Hey {firstName}!)
      const welcomeText = this.getLocalizedMessage("zappy_welcome", language);
      await this.sendBotMessage(userSsid, welcomeText, threadId, true); // personalize=true

      // Send buttons after welcome message
      const buttons = [
        { title: "Order Now", type: "postback" as const, payload: "start_order" },
        { title: "Track Order", type: "postback" as const, payload: "start_tracking" },
        { title: "Other", type: "postback" as const, payload: "show_menu" }
      ];

      await this.sendBotMessageWithButtons(
        userSsid,
        "How can I help you today?",
        buttons,
        threadId
      );
    } else {
      const message = this.getLocalizedMessage("unknown", language);
      await this.sendBotMessage(userSsid, message, threadId);
    }
  }

  /**
   * Send bot message with optional personalization
   */
  private static async sendBotMessage(userSsid: string, message: string, threadId: string, personalize: boolean = false): Promise<void> {
    let finalMessage = message;

    // Personalize message if requested
    if (personalize) {
      const user = await getUserByPsid(userSsid);
      if (user && user.firstName) {
        finalMessage = `Hey ${user.firstName}! ${message}`;
      }
    }

    // Create message with tracking first
    const trackingMessageId = await createBotMessageWithTracking(
      userSsid,
      finalMessage,
      "text"
    );

    // Show typing indicator before sending message
    await FacebookService.sendTypingIndicator(userSsid, 1500);

    // Send message with tracking ID
    await FacebookService.sendTextMessage(userSsid, finalMessage, trackingMessageId);
  }

  /**
   * Send bot message with buttons
   */
  private static async sendBotMessageWithButtons(
    userSsid: string,
    message: string,
    buttons: Array<{ title: string; type: "postback" | "web_url"; payload?: string; url?: string }>,
    threadId: string
  ): Promise<void> {
    // Create text message with tracking first
    const textTrackingId = await createBotMessageWithTracking(
      userSsid,
      message,
      "text"
    );

    // Show typing indicator before first message
    await FacebookService.sendTypingIndicator(userSsid, 1500);

    // Send text message with tracking
    await FacebookService.sendTextMessage(userSsid, message, textTrackingId);

    // Show typing indicator before buttons
    await FacebookService.sendTypingIndicator(userSsid, 800);

    // Create button message with tracking
    const buttonMessage = buttons.length === 1 && buttons[0].type === "web_url"
      ? "Click the button below:"
      : "Choose an option:";

    const buttonTrackingId = await createBotMessageWithTracking(
      userSsid,
      `[Buttons: ${buttons.map(b => b.title).join(", ")}]`,
      "template",
      { buttons }
    );

    // Send buttons with tracking
    await FacebookService.sendMixedButtonMessage(userSsid, buttonMessage, "", buttons, buttonTrackingId);
  }

  /**
   * Get localized message templates
   */
  private static getLocalizedMessage(key: string, language: Language, variables?: Record<string, string>): string {
    const templates: Record<string, Record<Language, string>> = {
      zappy_welcome: {
        en: "🎉 WOW-ing day to you!\n\nI'm Zappy, your virtual assistant.\nI'm still learning, but I can already help with most questions.\nIf you'd prefer to talk to a human, just type \"Live Agent.\" 😊",
        tl: "🎉 Magandang araw sa inyo!\n\nAko si Zappy, ang inyong virtual assistant.\nNag-aaral pa ako, pero matutulungan ko na kayo sa karamihan ng tanong.\nKung gusto niyo ng tao, i-type lang \"Live Agent.\" 😊",
        taglish: "🎉 WOW-ing day po!\n\nI'm Zappy, your virtual assistant.\nStill learning pa po, but I can help na with most questions.\nIf gusto niyo human, just type po \"Live Agent.\" 😊",
      },
      greeting: {
        en: "Hello! I'm Zappy, your Shakey's assistant. How can I help you today?",
        tl: "Kumusta! Ako si Zappy, ang inyong Shakey's assistant. Paano ko kayo matutulungan?",
        taglish: "Hello po! I'm Zappy. How can I help you today?",
      },
      menu_categories: {
        en: `We have these delicious categories: ${variables?.categories}\n\nWhich one interests you? 🍕`,
        tl: `Mayroon po kami ng mga kategorya: ${variables?.categories}\n\nAno po ang gusto niyo? 🍕`,
        taglish: `We have po these categories: ${variables?.categories}\n\nAno gusto niyo? 🍕`,
      },
      price_inquiry: {
        en: "Our prices range from ₱70 to ₱3,749! Pizza starts at ₱299, Chicken meals from ₱229. What would you like to know more about?",
        tl: "Ang aming presyo ay mula ₱70 hanggang ₱3,749! Pizza ay nagsisimula sa ₱299, Chicken meals mula ₱229. Ano pa ang gusto ninyong malaman?",
        taglish: "Our prices po are from ₱70 to ₱3,749! Pizza starts at ₱299, Chicken meals from ₱229. Ano pa po gusto ninyong malaman?",
      },
      operating_hours: {
        en: "Most Shakey's branches are open from 10:00 AM to 10:00 PM daily. Specific hours may vary by location. Would you like to check a specific branch?",
        tl: "Karamihan ng Shakey's branches ay bukas mula 10:00 AM hanggang 10:00 PM araw-araw. Ang oras ay maaaring mag-iba depende sa lokasyon. Gusto niyo bang tignan ang isang specific branch?",
        taglish: "Most branches po are open 10:00 AM to 10:00 PM daily. Specific hours may vary po. Gusto niyo check specific branch?",
      },
      contact_info: {
        en: "📞 Shakey's Hotline: 7777-7777\n📱 Globe/TM: #77-777 (toll-free)\n🌐 Website: shakeyspizza.ph\n\nHow else can I assist you?",
        tl: "📞 Shakey's Hotline: 7777-7777\n📱 Globe/TM: #77-777 (libre)\n🌐 Website: shakeyspizza.ph\n\nAno pa ang maitutulong ko?",
        taglish: "📞 Hotline po: 7777-7777\n📱 Globe/TM: #77-777 (toll-free)\n🌐 Website: shakeyspizza.ph\n\nHow else can I help po?",
      },
      order_start: {
        en: "Great! Let's start your order. What would you like to have? (e.g., 'Hawaiian Pizza', 'Chicken')",
        tl: "Sige! Simulan natin ang inyong order. Ano po ang gusto niyo? (halimbawa: 'Hawaiian Pizza', 'Chicken')",
        taglish: "Sige po! Let's start your order. Ano gusto niyo? (like 'Hawaiian Pizza', 'Chicken')",
      },
      order_confirm: {
        en: `Here's your order:\n${variables?.items}\n\nReady to checkout? 🛍️`,
        tl: `Ito po ang inyong order:\n${variables?.items}\n\nReady na po ba kayong mag-checkout? 🛍️`,
        taglish: `Here's po your order:\n${variables?.items}\n\nReady na po to checkout? 🛍️`,
      },
      order_confirm_quantity: {
        en: `Perfect! Here's what I got:\n\n${variables?.items}\n\nTotal: ${variables?.total} (${variables?.count} items)\n\nWould you like to add drinks or sides? Or ready to checkout? 🍟`,
        tl: `Perfect po! Ito ang inyong order:\n\n${variables?.items}\n\nTotal: ${variables?.total} (${variables?.count} items)\n\nGusto niyo pa ng drinks o sides? O ready na kayong mag-checkout? 🍟`,
        taglish: `Sige po! Here's your order:\n\n${variables?.items}\n\nTotal: ${variables?.total} (${variables?.count} items)\n\nGusto pa ng drinks or sides? Or ready na to checkout? 🍟`,
      },
      order_clarify: {
        en: `I found a few matches! Which one would you like?\n\n${variables?.matches}\n\nJust tell me the number or name! 😊`,
        tl: `May nakita akong mga match! Alin po ang gusto niyo?\n\n${variables?.matches}\n\nSabihin lang po ang number o pangalan! 😊`,
        taglish: `Found po these matches! Which one gusto niyo?\n\n${variables?.matches}\n\nJust say po the number or name! 😊`,
      },
      order_clarify_buttons: {
        en: "I found several options for you! Which one would you like? 🍕",
        tl: "May nakita akong ilang options para sa inyo! Alin po ang gusto ninyo? 🍕",
        taglish: "Found po several options! Which one gusto ninyo? 🍕",
      },
      order_suggest: {
        en: `Did you mean ${variables?.product} (${variables?.price})? 🍕`,
        tl: `${variables?.product} (${variables?.price}) po ba? 🍕`,
        taglish: `You mean po ${variables?.product} (${variables?.price})? 🍕`,
      },
      order_confirmation: {
        en: `Got it! I added ${variables?.product} x${variables?.quantity} to your cart.\n\n${variables?.cart}\n\nIs this correct? ✅`,
        tl: `Nakuha ko na po! Nag-add ako ng ${variables?.product} x${variables?.quantity} sa cart ninyo.\n\n${variables?.cart}\n\nTama po ba ito? ✅`,
        taglish: `Got it po! Added na ${variables?.product} x${variables?.quantity} sa cart.\n\n${variables?.cart}\n\nIs this correct po? ✅`,
      },
      order_change: {
        en: "No problem! Let's start over. What would you like to order? 🍕",
        tl: "No problem po! Magsimula tayo ulit. Ano po ang gusto ninyong orderin? 🍕",
        taglish: "No problem po! Let's start over. Ano gusto ninyong orderin? 🍕",
      },
      order_not_found: {
        en: "I couldn't find that item. Could you try again or ask to see our menu?",
        tl: "Hindi ko mahanap ang item na iyan. Pwede po bang subukan ulit o tingnan ang menu?",
        taglish: "Hindi ko po mahanap yan. Can you try again po or check our menu?",
      },
      order_redirect: {
        en: "Perfect! Please continue your order here: https://botpe.in\n\nYour items are saved!",
        tl: "Perfect po! Ituloy niyo ang order dito: https://botpe.in\n\nNaka-save na ang items!",
        taglish: "Perfect po! Continue your order here: https://botpe.in\n\nSaved na ang items!",
      },
      order_help: {
        en: "Tell me what you'd like to order, or type 'menu' to see options!",
        tl: "Sabihin po sa akin kung ano ang gusto ninyong i-order, o type 'menu' para sa options!",
        taglish: "Tell me po what you want to order, or type 'menu' for options!",
      },
      order_ask_drinks: {
        en: `Great choice! Added to cart.\n\n${variables?.cart}\n\nWould you like to add drinks? (e.g., Coke, Iced Tea) 🥤`,
        tl: `Magandang choice po! Naidagdag na sa cart.\n\n${variables?.cart}\n\nGusto niyo po ng drinks? (halimbawa: Coke, Iced Tea) 🥤`,
        taglish: `Nice choice po! Added na sa cart.\n\n${variables?.cart}\n\nGusto niyo ba ng drinks? (like Coke, Iced Tea) 🥤`,
      },
      order_ask_desserts: {
        en: `Perfect! Here's your cart so far:\n\n${variables?.cart}\n\nHow about some desserts? (e.g., Banana Split, Mango Float) 🍰`,
        tl: `Perfect po! Ito ang inyong cart:\n\n${variables?.cart}\n\nGusto niyo pa ng desserts? (halimbawa: Banana Split, Mango Float) 🍰`,
        taglish: `Perfect po! Here's your cart:\n\n${variables?.cart}\n\nGusto pa ba ng desserts? (like Banana Split, Mango Float) 🍰`,
      },
      order_ask_complete: {
        en: `Awesome! Your cart:\n\n${variables?.cart}\n\nReady to complete your order? 🛍️`,
        tl: `Salamat po! Ang inyong cart:\n\n${variables?.cart}\n\nReady na po ba kayong kumpletuhin ang order? 🛍️`,
        taglish: `Thank you po! Your cart:\n\n${variables?.cart}\n\nReady na ba to complete order? 🛍️`,
      },
      order_checkout: {
        en: `Perfect! Here's your final cart:\n\n${variables?.cart}\n\nClick below to complete your order! 🎉`,
        tl: `Perfect po! Ito ang final cart:\n\n${variables?.cart}\n\nClick po sa baba para kumpletuhin ang order! 🎉`,
        taglish: `Perfect po! Final cart:\n\n${variables?.cart}\n\nClick below to complete order! 🎉`,
      },
      location_response: {
        en: "We have branches nationwide! To find the nearest one, call 7777-7777 or visit shakeyspizza.ph/stores\n\nWhich area are you in?",
        tl: "Mayroon kaming branches sa buong bansa! Para mahanap ang pinakamalapit, tawagan ang 7777-7777 o bisitahin ang shakeyspizza.ph/stores\n\nNasaan kayo?",
        taglish: "We have po branches nationwide! To find nearest, call 7777-7777 or visit shakeyspizza.ph/stores\n\nSaan area po kayo?",
      },
      promo_response: {
        en: "🎉 Current Promos:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nCheck shakeyspizza.ph/promos for details!",
        tl: "🎉 Kasalukuyang Promos:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nTingnan ang shakeyspizza.ph/promos para sa detalye!",
        taglish: "🎉 Current Promos po:\n• Family Meal Deals (₱1,149-₱2,699)\n• Pizza 'N' Mojos Bundles\n• SuperCard Exclusive Deals\n\nCheck shakeyspizza.ph/promos for details po!",
      },
      complaint_escalation: {
        en: "I'm sorry to hear that. Let me connect you with our customer service team right away. They'll assist you shortly.\n\nYou can also call 7777-7777 for immediate help.",
        tl: "Pasensya na po. Ikokonekta ko kayo sa aming customer service team ngayon. Tutulungan kayo kaagad.\n\nPwede din kayong tumawag sa 7777-7777 para sa agarang tulong.",
        taglish: "Sorry to hear that po. Let me connect you sa customer service team. They'll help po shortly.\n\nYou can also call 7777-7777 for immediate help.",
      },
      human_escalation: {
        en: "I'm connecting you to a live agent now. Please wait a moment...\n\nOr call us directly at 7777-7777.",
        tl: "Ikokonekta ko po kayo sa live agent ngayon. Sandali lang po...\n\nO tawagan ninyo kami sa 7777-7777.",
        taglish: "Connecting you po to a live agent now. Wait lang po...\n\nOr call us at 7777-7777.",
      },
      unknown: {
        en: "I can help you with:\n• Menu and prices\n• Store locations\n• Promos and offers\n• Placing orders\n\nWhat would you like to know?",
        tl: "Matutulungan ko kayo sa:\n• Menu at presyo\n• Store locations\n• Promos at offers\n• Pag-order\n\nAno ang gusto ninyong malaman?",
        taglish: "I can help you po with:\n• Menu and prices\n• Store locations\n• Promos and offers\n• Placing orders\n\nAno po gusto ninyong malaman?",
      },
      default_response: {
        en: "I'm here to help! What would you like to know about Shakey's?",
        tl: "Nandito ako para tumulong! Ano ang gusto ninyong malaman tungkol sa Shakey's?",
        taglish: "I'm here po to help! Ano gusto ninyong malaman about Shakey's?",
      },
      faq_general: {
        en: "I can answer questions about:\n• Menu items and prices\n• Store hours and locations\n• Delivery and ordering\n• Promotions\n\nWhat would you like to know?",
        tl: "Masasagot ko ang mga tanong tungkol sa:\n• Menu items at presyo\n• Store hours at locations\n• Delivery at pag-order\n• Promotions\n\nAno ang gusto ninyong malaman?",
        taglish: "I can answer po questions about:\n• Menu items and prices\n• Store hours and locations\n• Delivery and ordering\n• Promotions\n\nAno po gusto ninyong malaman?",
      },
    };

    const template = templates[key]?.[language] || templates[key]?.en || "How can I help you?";
    return template;
  }
}
