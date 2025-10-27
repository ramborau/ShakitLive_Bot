import { GoogleGenerativeAI } from "@google/generative-ai";
import products from "../../products.json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface GeminiIntentResult {
  intent: "greeting" | "faq" | "menu_inquiry" | "order_placement" | "location_inquiry" | "promo_inquiry" | "complaint" | "human_request" | "unknown";
  confidence: number;
  language: "en" | "tl" | "taglish";
  entities?: {
    products?: Array<{
      name: string;
      quantity: number;
      confidence: number;
    }>;
    location?: string;
    orderType?: "delivery" | "carryout";
  };
  suggestedProducts?: Array<{
    id: number;
    name: string;
    price: string;
    confidence: number;
  }>;
  reasoning?: string;
}

export class GeminiService {
  /**
   * Analyze user message with Gemini AI
   * Returns intent, entities, language, and product suggestions
   */
  static async analyzeMessage(userMessage: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<GeminiIntentResult> {
    try {
      // Build product catalog summary for context
      const productsList = products.map(p => `${p.id}: ${p.name} (${p.category}) - ${p.price}`).join("\n");

      const prompt = `You are Zappy, an AI assistant for Shakey's Pizza Philippines. Analyze this customer message and extract structured information.

AVAILABLE PRODUCTS:
${productsList}

USER MESSAGE: "${userMessage}"

${conversationHistory && conversationHistory.length > 0 ? `
CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
` : ''}

ANALYZE AND RETURN A JSON RESPONSE WITH:
{
  "intent": "<greeting|faq|menu_inquiry|order_placement|location_inquiry|promo_inquiry|complaint|human_request|unknown>",
  "confidence": <0-1 float>,
  "language": "<en|tl|taglish>",
  "entities": {
    "products": [{ "name": "Product Name", "quantity": number, "confidence": 0-1 }],
    "location": "location if mentioned",
    "orderType": "delivery or carryout if mentioned"
  },
  "suggestedProducts": [{ "id": number, "name": "Product Name", "price": "₱XXX", "confidence": 0-1 }],
  "reasoning": "Brief explanation of your analysis"
}

INTENT DETECTION RULES:
- greeting: Hi, hello, kumusta, good morning, etc.
- order_placement: User wants to order/buy food (kailangan, gusto, pabili, want, need, order, buy, etc.)
- menu_inquiry: Asking about menu, food items, prices, what's available
- location_inquiry: Asking about branches, locations, nearest store, saan, where
- promo_inquiry: Asking about promos, deals, discounts, offers
- complaint: Reporting problems, late order, wrong food, reklamo, issue, problem
- human_request: Wants to talk to human agent (live agent, tao, representative)
- faq: General questions about hours, payment, delivery, etc.
- unknown: Cannot determine intent

PRODUCT MATCHING:
- Match user's request to products from the list above
- Handle variations and typos (shawarma = beef shawarma = angus shawarma)
- Extract quantities (x 4, x4, 4 pcs, dalawang, tatlo, apat, lima)
- Filipino numbers: isa=1, dalawa=2, tatlo=3, apat=4, lima=5, anim=6
- Suggest multiple products if ambiguous with confidence scores

LANGUAGE DETECTION:
- en: Pure English
- tl: Pure Tagalog/Filipino
- taglish: Mix of English and Tagalog

Return ONLY valid JSON, no markdown or extra text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse Gemini response");
      }

      const parsed: GeminiIntentResult = JSON.parse(jsonMatch[0]);

      // Validate and enhance product suggestions
      if (parsed.entities?.products && parsed.entities.products.length > 0) {
        parsed.suggestedProducts = this.matchProductsFromCatalog(parsed.entities.products);
      }

      console.log("[GeminiService] Analysis:", JSON.stringify(parsed, null, 2));
      return parsed;

    } catch (error) {
      console.error("[GeminiService] Error:", error);

      // Fallback to simple keyword matching
      return this.fallbackAnalysis(userMessage);
    }
  }

  /**
   * Match extracted products to actual catalog
   */
  private static matchProductsFromCatalog(extractedProducts: Array<{ name: string; quantity: number; confidence: number }>) {
    const matches: Array<{ id: number; name: string; price: string; confidence: number; quantity: number }> = [];

    for (const extracted of extractedProducts) {
      const searchTerm = extracted.name.toLowerCase();

      // Find best matches in catalog
      const catalogMatches = products
        .map(p => ({
          product: p,
          score: this.calculateMatchScore(searchTerm, p.name.toLowerCase())
        }))
        .filter(m => m.score > 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      for (const match of catalogMatches) {
        matches.push({
          id: match.product.id,
          name: match.product.name,
          price: match.product.price,
          confidence: match.score * extracted.confidence,
          quantity: extracted.quantity
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate string similarity score
   */
  private static calculateMatchScore(search: string, target: string): number {
    // Exact match
    if (target === search) return 1.0;

    // Contains search term
    if (target.includes(search)) return 0.9;

    // Check individual words
    const searchWords = search.split(/\s+/);
    const targetWords = target.split(/\s+/);

    let matchCount = 0;
    for (const searchWord of searchWords) {
      if (targetWords.some(tw => tw.includes(searchWord) || searchWord.includes(tw))) {
        matchCount++;
      }
    }

    const wordScore = matchCount / Math.max(searchWords.length, targetWords.length);

    // Fuzzy matching for typos (simplified Levenshtein)
    if (wordScore < 0.5) {
      const distance = this.levenshteinDistance(search, target);
      const maxLength = Math.max(search.length, target.length);
      const fuzzyScore = 1 - (distance / maxLength);
      return Math.max(fuzzyScore, wordScore);
    }

    return wordScore;
  }

  /**
   * Levenshtein distance for fuzzy matching
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + 1
          );
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Fallback analysis when Gemini fails
   */
  private static fallbackAnalysis(userMessage: string): GeminiIntentResult {
    const lowerMsg = userMessage.toLowerCase();

    // Simple keyword-based detection
    let intent: GeminiIntentResult["intent"] = "unknown";
    let confidence = 0.5;

    if (/(hi|hello|hey|kumusta|kamusta)/i.test(lowerMsg)) {
      intent = "greeting";
      confidence = 0.8;
    } else if (/(order|buy|want|need|gusto|kailangan|pabili)/i.test(lowerMsg)) {
      intent = "order_placement";
      confidence = 0.7;
    } else if (/(menu|what do you have|ano meron|available)/i.test(lowerMsg)) {
      intent = "menu_inquiry";
      confidence = 0.7;
    } else if (/(location|branch|near|saan|where)/i.test(lowerMsg)) {
      intent = "location_inquiry";
      confidence = 0.7;
    } else if (/(promo|deal|discount|offer)/i.test(lowerMsg)) {
      intent = "promo_inquiry";
      confidence = 0.7;
    } else if (/(live agent|human|tao|representative)/i.test(lowerMsg)) {
      intent = "human_request";
      confidence = 0.9;
    } else if (/(complaint|problem|issue|wrong|late|reklamo)/i.test(lowerMsg)) {
      intent = "complaint";
      confidence = 0.8;
    }

    // Detect language
    const tagalogWords = ["po", "ako", "opo", "salamat", "kumusta", "gusto", "saan", "ng", "ko", "na"];
    const hasTagalog = tagalogWords.some(word => lowerMsg.includes(word));
    const hasEnglish = /[a-z]/i.test(userMessage);

    let language: "en" | "tl" | "taglish" = "en";
    if (hasTagalog && hasEnglish) {
      language = "taglish";
    } else if (hasTagalog) {
      language = "tl";
    }

    return {
      intent,
      confidence,
      language,
      reasoning: "Fallback keyword-based analysis (Gemini unavailable)"
    };
  }
}
