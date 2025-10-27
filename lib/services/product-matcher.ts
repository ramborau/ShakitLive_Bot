import products from "../../products.json";
import { GeminiService } from "./gemini-service";

export interface MatchedProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  quantity: number;
  confidence: number;
}

export class ProductMatcher {
  /**
   * Match user message to products using Gemini AI
   */
  static async matchProducts(userMessage: string, conversationHistory?: Array<{ role: string; content: string }>): Promise<MatchedProduct[]> {
    try {
      console.log(`[ProductMatcher] Matching products for: "${userMessage}"`);

      // Use Gemini AI to extract products and quantities
      const analysis = await GeminiService.analyzeMessage(userMessage, conversationHistory);

      if (!analysis.suggestedProducts || analysis.suggestedProducts.length === 0) {
        console.log("[ProductMatcher] No products found by Gemini");
        return [];
      }

      // Map to full product details
      const matches: MatchedProduct[] = [];

      for (const suggestion of analysis.suggestedProducts) {
        const product = products.find(p => p.id === suggestion.id);
        if (product) {
          matches.push({
            ...product,
            quantity: (suggestion as any).quantity || 1,
            confidence: suggestion.confidence
          });
        }
      }

      console.log(`[ProductMatcher] Found ${matches.length} matches:`, matches.map(m => `${m.name} x${m.quantity}`));
      return matches.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error("[ProductMatcher] Error:", error);
      return this.fallbackMatch(userMessage);
    }
  }

  /**
   * Fallback product matching using simple keywords
   */
  private static fallbackMatch(userMessage: string): MatchedProduct[] {
    const lowerMsg = userMessage.toLowerCase();
    const matches: MatchedProduct[] = [];

    // Extract quantity
    const quantity = this.extractQuantity(lowerMsg);

    // Search products
    for (const product of products) {
      const productName = product.name.toLowerCase();
      const productWords = productName.split(/\s+/);

      // Check if any word from product name is in the message
      let matchScore = 0;
      for (const word of productWords) {
        if (word.length > 3 && lowerMsg.includes(word)) {
          matchScore += 0.3;
        }
      }

      // Boost score if first word matches
      if (lowerMsg.includes(productWords[0])) {
        matchScore += 0.4;
      }

      if (matchScore > 0.3) {
        matches.push({
          ...product,
          quantity,
          confidence: Math.min(matchScore, 0.85)
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  /**
   * Extract quantity from message
   */
  private static extractQuantity(message: string): number {
    // English patterns
    const patterns = [
      /\b(\d+)\s*x\b/i,           // "4x", "4 x"
      /\bx\s*(\d+)\b/i,           // "x4", "x 4"
      /\b(\d+)\s*(pcs?|pieces?|orders?)\b/i,  // "4 pcs", "4 pieces"
      /\b(\d+)\s+(?:of|ng)\b/i,  // "4 of", "4 ng"
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const qty = parseInt(match[1]);
        if (!isNaN(qty) && qty > 0 && qty <= 100) {
          return qty;
        }
      }
    }

    // Filipino number words
    const filipinoNumbers: Record<string, number> = {
      "isa": 1, "isang": 1,
      "dalawa": 2, "dalawang": 2,
      "tatlo": 3, "tatlong": 3,
      "apat": 4,
      "lima": 5, "limang": 5,
      "anim": 6,
      "pito": 7,
      "walo": 8,
      "siyam": 9,
      "sampu": 10,
    };

    for (const [word, number] of Object.entries(filipinoNumbers)) {
      if (message.includes(word)) {
        return number;
      }
    }

    // Default to 1 if no quantity specified
    return 1;
  }

  /**
   * Get product by ID
   */
  static getProductById(id: number): MatchedProduct | null {
    const product = products.find(p => p.id === id);
    if (!product) return null;

    return {
      ...product,
      quantity: 1,
      confidence: 1.0
    };
  }

  /**
   * Get products by category
   */
  static getProductsByCategory(category: string): MatchedProduct[] {
    return products
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => ({
        ...p,
        quantity: 1,
        confidence: 1.0
      }));
  }

  /**
   * Search products by name
   */
  static searchProducts(query: string, limit: number = 10): MatchedProduct[] {
    const lowerQuery = query.toLowerCase();

    const results = products
      .map(p => ({
        product: p,
        score: this.calculateSearchScore(lowerQuery, p)
      }))
      .filter(r => r.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({
        ...r.product,
        quantity: 1,
        confidence: r.score
      }));

    return results;
  }

  /**
   * Calculate search relevance score
   */
  private static calculateSearchScore(query: string, product: typeof products[0]): number {
    let score = 0;

    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const category = product.category.toLowerCase();

    // Exact name match
    if (name === query) {
      score += 1.0;
    }
    // Name contains query
    else if (name.includes(query)) {
      score += 0.8;
    }
    // Query contains name words
    else {
      const nameWords = name.split(/\s+/);
      const queryWords = query.split(/\s+/);

      for (const nameWord of nameWords) {
        if (nameWord.length > 3) {
          for (const queryWord of queryWords) {
            if (queryWord.includes(nameWord) || nameWord.includes(queryWord)) {
              score += 0.2;
            }
          }
        }
      }
    }

    // Description match
    if (description.includes(query)) {
      score += 0.3;
    }

    // Category match
    if (category.includes(query)) {
      score += 0.5;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    return [...new Set(products.map(p => p.category))];
  }

  /**
   * Calculate total price for matched products
   */
  static calculateTotal(matches: MatchedProduct[]): { total: string; items: number } {
    let totalCents = 0;
    let totalItems = 0;

    for (const match of matches) {
      // Parse price (₱XXX.XX format)
      const priceStr = match.price.replace(/[₱,]/g, "");
      const price = parseFloat(priceStr);

      if (!isNaN(price)) {
        totalCents += price * match.quantity * 100; // Convert to cents to avoid floating point issues
        totalItems += match.quantity;
      }
    }

    const total = (totalCents / 100).toFixed(2);
    return {
      total: `₱${total}`,
      items: totalItems
    };
  }
}
