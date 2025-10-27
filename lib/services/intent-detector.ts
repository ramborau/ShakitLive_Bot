import { GeminiService, GeminiIntentResult } from "./gemini-service";

export type Intent =
  | "greeting"
  | "faq"
  | "menu_inquiry"
  | "order_placement"
  | "location_inquiry"
  | "promo_inquiry"
  | "party_inquiry"
  | "tracking_inquiry"
  | "supercard_inquiry"
  | "complaint"
  | "human_request"
  | "unknown";

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities?: Record<string, any>;
  language?: "en" | "tl" | "taglish";
  suggestedProducts?: any[];
  reasoning?: string;
}

export class IntentDetector {
  /**
   * Detect intent from user message using Gemini AI
   * Falls back to keyword matching if AI fails
   */
  static async detect(message: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<IntentResult> {
    try {
      // Use Gemini AI for intelligent intent detection
      const analysis = await GeminiService.analyzeMessage(message, conversationHistory);

      return {
        intent: analysis.intent,
        confidence: analysis.confidence,
        entities: analysis.entities,
        language: analysis.language,
        suggestedProducts: analysis.suggestedProducts,
        reasoning: analysis.reasoning
      };
    } catch (error) {
      console.error("[IntentDetector] Gemini failed, using fallback:", error);
      return this.detectFallback(message);
    }
  }

  /**
   * Fallback keyword-based detection
   */
  static detectFallback(message: string): IntentResult {
    const lowerMsg = message.toLowerCase();

    // Check for greeting patterns
    if (this.matchesGreeting(lowerMsg)) {
      return { intent: "greeting", confidence: 0.95, reasoning: "Keyword match: greeting" };
    }

    // Check for human request (highest priority)
    if (this.matchesHumanRequest(lowerMsg)) {
      return { intent: "human_request", confidence: 1.0, reasoning: "Keyword match: human request" };
    }

    // Check for complaints
    if (this.matchesComplaint(lowerMsg)) {
      return { intent: "complaint", confidence: 0.9, reasoning: "Keyword match: complaint" };
    }

    // Check for orders
    if (this.matchesOrder(lowerMsg)) {
      return { intent: "order_placement", confidence: 0.85, reasoning: "Keyword match: order" };
    }

    // Check for menu inquiries
    if (this.matchesMenuInquiry(lowerMsg)) {
      return { intent: "menu_inquiry", confidence: 0.85, reasoning: "Keyword match: menu" };
    }

    // Check for location inquiries
    if (this.matchesLocation(lowerMsg)) {
      return { intent: "location_inquiry", confidence: 0.85, reasoning: "Keyword match: location" };
    }

    // Check for promo inquiries
    if (this.matchesPromo(lowerMsg)) {
      return { intent: "promo_inquiry", confidence: 0.85, reasoning: "Keyword match: promo" };
    }

    // Check for party inquiries
    if (this.matchesParty(lowerMsg)) {
      return { intent: "party_inquiry", confidence: 0.85, reasoning: "Keyword match: party" };
    }

    // Check for tracking inquiries
    if (this.matchesTracking(lowerMsg)) {
      return { intent: "tracking_inquiry", confidence: 0.85, reasoning: "Keyword match: tracking" };
    }

    // Check for supercard inquiries
    if (this.matchesSupercard(lowerMsg)) {
      return { intent: "supercard_inquiry", confidence: 0.85, reasoning: "Keyword match: supercard" };
    }

    // Check for FAQs
    if (this.matchesFAQ(lowerMsg)) {
      return { intent: "faq", confidence: 0.75, reasoning: "Keyword match: FAQ" };
    }

    // Default to unknown
    return { intent: "unknown", confidence: 0.5, reasoning: "No keyword matches" };
  }

  /**
   * Synchronous detection for backward compatibility
   * Uses keyword matching only
   */
  static detectSync(message: string): IntentResult {
    return this.detectFallback(message);
  }

  private static matchesGreeting(msg: string): boolean {
    const greetingKeywords = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "kumusta",
      "kamusta",
      "musta",
    ];

    return greetingKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesHumanRequest(msg: string): boolean {
    const humanKeywords = [
      "live agent",
      "human",
      "talk to someone",
      "speak to agent",
      "representative",
      "customer service",
      "tao",
      "agent",
    ];

    return humanKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesComplaint(msg: string): boolean {
    const complaintKeywords = [
      "complaint",
      "complain",
      "issue",
      "problem",
      "wrong order",
      "late delivery",
      "not delivered",
      "cold food",
      "reklamo",
      "late",
      "wrong",
      "missing",
      "refund",
      "cancel",
    ];

    return complaintKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesOrder(msg: string): boolean {
    const orderKeywords = [
      "order",
      "buy",
      "purchase",
      "want",
      "need",
      "gusto",
      "kailangan",
      "pabili",
      "bili",
      "delivery",
      "carryout",
      "pick up",
      "checkout",
      "cart",
      "add to cart",
      "pa-order",
    ];

    const negativeKeywords = ["how to order", "paano mag-order"];

    // Don't match if it's asking HOW to order
    if (negativeKeywords.some((kw) => msg.includes(kw))) {
      return false;
    }

    return orderKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesMenuInquiry(msg: string): boolean {
    const menuKeywords = [
      "menu",
      "pizza",
      "chicken",
      "pasta",
      "drinks",
      "food",
      "what do you have",
      "ano meron",
      "ano ang",
      "available",
      "price",
      "presyo",
      "magkano",
      "how much",
    ];

    return menuKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesLocation(msg: string): boolean {
    const locationKeywords = [
      "location",
      "branch",
      "store",
      "nearest",
      "near me",
      "saan",
      "where",
      "address",
      "malapit",
      "deliver",
      "delivery area",
      "coverage",
    ];

    return locationKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesPromo(msg: string): boolean {
    const promoKeywords = [
      "promo",
      "promotion",
      "discount",
      "sale",
      "offer",
      "deal",
      "voucher",
      "coupon",
      "off",
      "50%",
      "buy one",
      "bogo",
    ];

    return promoKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesParty(msg: string): boolean {
    const partyKeywords = [
      "party",
      "group order",
      "birthday",
      "celebration",
      "event",
      "buffet",
      "package",
      "pista",
      "kaarawan",
      "handaan",
      "grupo",
      "party package",
      "plated",
      "mascot",
    ];

    return partyKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesTracking(msg: string): boolean {
    const trackingKeywords = [
      "track",
      "tracking",
      "order status",
      "where is my order",
      "saan na",
      "nasaan",
      "order number",
      "delivery status",
      "asan na",
    ];

    return trackingKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesSupercard(msg: string): boolean {
    const supercardKeywords = [
      "supercard",
      "super card",
      "loyalty",
      "loyalty card",
      "rewards",
      "points",
      "membership",
      "member",
      "card",
    ];

    return supercardKeywords.some((keyword) => msg.includes(keyword));
  }

  private static matchesFAQ(msg: string): boolean {
    const faqKeywords = [
      "how",
      "what",
      "when",
      "why",
      "paano",
      "ano",
      "kailan",
      "bakit",
      "open",
      "close",
      "hours",
      "contact",
      "hotline",
      "payment",
      "bayad",
    ];

    return faqKeywords.some((keyword) => msg.includes(keyword));
  }

  /**
   * Map intent to flow type
   */
  static intentToFlow(intent: Intent): "faq" | "order" | "location" | "promo" | "complaint" | "party" | "tracking" | "supercard" | null {
    const mapping: Record<Intent, "faq" | "order" | "location" | "promo" | "complaint" | "party" | "tracking" | "supercard" | null> = {
      greeting: null,
      faq: "faq",
      menu_inquiry: "faq",
      order_placement: "order",
      location_inquiry: "location",
      promo_inquiry: "promo",
      party_inquiry: "party",
      tracking_inquiry: "tracking",
      supercard_inquiry: "supercard",
      complaint: "complaint",
      human_request: "complaint",
      unknown: null,
    };

    return mapping[intent];
  }
}
