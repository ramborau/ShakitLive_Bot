/**
 * ORDER FLOW - Enterprise-Grade Implementation
 * Handles complete ordering process with AI and webview options
 */

import { ConversationManager } from "../services/conversation-manager";
import { SobotService } from "../services/sobot-service";
import { ProductMatcher } from "../services/product-matcher";
import { PaymentService } from "../services/payment-service";
import { WebhookService } from "../services/webhook-service";
import { createMessage } from "../db-operations";
import products from "../../products.json";

export type OrderFlowStep =
  | "FLOW_START"
  | "CHOOSE_ORDER_METHOD"
  | "AI_ORDER_START"
  | "SHOW_PRODUCT_CAROUSEL"
  | "SHOW_PRODUCT_LIST"
  | "PRODUCT_SELECTED"
  | "ASK_DRINKS"
  | "SHOW_DRINKS_CAROUSEL"
  | "DRINK_SELECTED"
  | "ASK_DESSERTS"
  | "SHOW_DESSERTS_CAROUSEL"
  | "DESSERT_SELECTED"
  | "COLLECT_LOCATION"
  | "GENERATE_PAYMENT";

export interface OrderFlowData {
  cart: Array<{
    productId: number;
    name: string;
    price: string;
    quantity: number;
    category: string;
  }>;
  orderMethod?: "ai" | "webview";
  matchedProducts?: any[];
  location?: string;
  phone?: string;
}

export class OrderFlow {
  /**
   * Main entry point for ORDER flow
   */
  static async handleOrderFlow(
    threadId: string,
    userSsid: string,
    userMessage: string,
    currentStep: string | null,
    flowData: any,
    language: "en" | "tl" | "taglish",
    intentResult?: any
  ): Promise<void> {
    const step = (currentStep || "FLOW_START") as OrderFlowStep;
    const data: OrderFlowData = flowData || { cart: [] };

    console.log(`[OrderFlow] Step: ${step}, Message: ${userMessage.substring(0, 50)}`);

    switch (step) {
      case "FLOW_START":
        await this.handleFlowStart(threadId, userSsid, language);
        break;

      case "CHOOSE_ORDER_METHOD":
        await this.handleChooseMethod(threadId, userSsid, userMessage, language);
        break;

      case "AI_ORDER_START":
        await this.handleAIOrderStart(threadId, userSsid, userMessage, data, language, intentResult);
        break;

      case "SHOW_PRODUCT_CAROUSEL":
      case "SHOW_PRODUCT_LIST":
        await this.handleProductSelection(threadId, userSsid, userMessage, data, step, language);
        break;

      case "PRODUCT_SELECTED":
        await this.handleProductSelected(threadId, userSsid, userMessage, data, language);
        break;

      case "ASK_DRINKS":
        await this.handleAskDrinks(threadId, userSsid, userMessage, data, language);
        break;

      case "SHOW_DRINKS_CAROUSEL":
        await this.handleDrinkSelection(threadId, userSsid, userMessage, data, language);
        break;

      case "ASK_DESSERTS":
        await this.handleAskDesserts(threadId, userSsid, userMessage, data, language);
        break;

      case "SHOW_DESSERTS_CAROUSEL":
        await this.handleDessertSelection(threadId, userSsid, userMessage, data, language);
        break;

      case "COLLECT_LOCATION":
        await this.handleCollectLocation(threadId, userSsid, userMessage, data, language);
        break;

      case "GENERATE_PAYMENT":
        await this.handleGeneratePayment(threadId, userSsid, data, language);
        break;

      default:
        await this.handleFlowStart(threadId, userSsid, language);
    }
  }

  /**
   * FLOW_START: Show AI Order vs Order Online options
   */
  private static async handleFlowStart(threadId: string, userSsid: string, language: "en" | "tl" | "taglish"): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "CHOOSE_ORDER_METHOD", { cart: [] });

    const message = language === "en"
      ? "🍕 Great! Let's get your order started!\n\nHow would you like to order?"
      : language === "tl"
      ? "🍕 Salamat! Simulan natin ang inyong order!\n\nPaano ninyo gusto mag-order?"
      : "🍕 Let's start po your order!\n\nHow gusto niyo mag-order?";

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    const buttons = [
      { title: "🤖 AI Order", type: "postback" as const, payload: "choose_ai_order" },
      { title: "🌐 Order Online", type: "web_url" as const, url: "https://shakeys-app.vercel.app/" }
    ];

    await SobotService.sendMixedButtonMessage(userSsid, "Choose your ordering method:", "", buttons);
    await createMessage({ senderSsid: userSsid, content: "[Order Method Buttons]", messageType: "template", isFromBot: true });
  }

  /**
   * CHOOSE_ORDER_METHOD: Handle AI vs Webview selection
   */
  private static async handleChooseMethod(
    threadId: string,
    userSsid: string,
    userMessage: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    if (userMessage === "choose_ai_order") {
      await ConversationManager.updateFlowStep(threadId, "AI_ORDER_START", { cart: [], orderMethod: "ai" });

      const message = language === "en"
        ? "🍕 Perfect! Tell me what you'd like to order.\n\nYou can say things like:\n• \"I want pizza\"\n• \"Large pepperoni pizza\"\n• \"Chicken and mojos\""
        : language === "tl"
        ? "🍕 Sige po! Sabihin ninyo sa akin kung ano ang gusto ninyong i-order.\n\nPwede kayong magsabi ng:\n• \"Gusto ko ng pizza\"\n• \"Large pepperoni pizza\"\n• \"Chicken at mojos\""
        : "🍕 Sige po! Tell me what you want to order.\n\nPwede po like:\n• \"I want pizza\"\n• \"Large pepperoni pizza\"\n• \"Chicken and mojos\"";

      await SobotService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
    }
  }

  /**
   * AI_ORDER_START: Use Gemini to match products
   */
  private static async handleAIOrderStart(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish",
    intentResult?: any
  ): Promise<void> {
    // Use Gemini-matched products from intent or match now
    let matchedProducts = intentResult?.suggestedProducts || [];

    if (matchedProducts.length === 0) {
      const history = await ConversationManager.getHistory(threadId, 2);
      matchedProducts = await ProductMatcher.matchProducts(userMessage, history);
    }

    if (matchedProducts.length === 0) {
      const message = language === "en"
        ? "Hmm, I couldn't find that. Could you try describing it differently? Or type 'menu' to see all options."
        : language === "tl"
        ? "Hindi ko mahanap iyan. Pwede bang subukan ninyong ipaliwanag ng iba? O i-type 'menu' para sa lahat ng options."
        : "Hindi ko po mahanap yan. Can you describe differently po? Or type 'menu' for all options.";

      await SobotService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
      return;
    }

    // Store matched products
    data.matchedProducts = matchedProducts;

    // If ≤6 products, show carousel. If >6, show numbered list
    if (matchedProducts.length <= 6) {
      await this.showProductCarousel(threadId, userSsid, matchedProducts, data, language);
    } else {
      await this.showProductList(threadId, userSsid, matchedProducts, data, language);
    }
  }

  /**
   * Show product carousel (≤6 items)
   */
  private static async showProductCarousel(
    threadId: string,
    userSsid: string,
    matchedProducts: any[],
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "SHOW_PRODUCT_CAROUSEL", data);

    const message = language === "en"
      ? `🍕 Found ${matchedProducts.length} delicious options for you!`
      : language === "tl"
      ? `🍕 Nakakita ako ng ${matchedProducts.length} masarap na options para sa inyo!`
      : `🍕 Found ${matchedProducts.length} masarap options for you po!`;

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    const carouselItems = matchedProducts.slice(0, 6).map(product => ({
      title: product.name,
      subtitle: `${product.price} • ${product.category || ''}`,
      image_url: product.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      buttons: [
        {
          title: "Add to Cart",
          type: "postback" as const,
          payload: `add_product_${product.id}`
        }
      ]
    }));

    await SobotService.sendCarouselMessage(userSsid, carouselItems);
    await createMessage({ senderSsid: userSsid, content: `[Product Carousel: ${matchedProducts.length} items]`, messageType: "template", isFromBot: true });
  }

  /**
   * Show product numbered list (7-10 items)
   */
  private static async showProductList(
    threadId: string,
    userSsid: string,
    matchedProducts: any[],
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "SHOW_PRODUCT_LIST", data);

    const topProducts = matchedProducts.slice(0, 10);
    const productList = topProducts.map((p, idx) =>
      `${idx + 1}) *${p.name}* - ${p.price}`
    ).join("\n");

    const message = language === "en"
      ? `🍕 Here are your options:\n\n${productList}\n\nJust type the number to add to cart!`
      : language === "tl"
      ? `🍕 Ito ang inyong mga options:\n\n${productList}\n\nI-type lang ang number para i-add sa cart!`
      : `🍕 Here po are your options:\n\n${productList}\n\nType lang po the number to add!`;

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
  }

  /**
   * Handle product selection from carousel or list
   */
  private static async handleProductSelection(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    currentStep: string,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    let selectedProduct = null;

    // Handle carousel button: add_product_123
    if (userMessage.startsWith("add_product_")) {
      const productId = parseInt(userMessage.replace("add_product_", ""));
      selectedProduct = products.find(p => p.id === productId);
    }
    // Handle numbered list: user types "1", "2", etc.
    else if (/^\d+$/.test(userMessage.trim())) {
      const index = parseInt(userMessage.trim()) - 1;
      if (data.matchedProducts && data.matchedProducts[index]) {
        selectedProduct = data.matchedProducts[index];
      }
    }

    if (!selectedProduct) {
      const message = language === "en"
        ? "Please select a valid option from the list above."
        : language === "tl"
        ? "Pumili po ng valid option sa listahan sa itaas."
        : "Please select po valid option from list above.";

      await SobotService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
      return;
    }

    // Add to cart
    data.cart.push({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
      category: selectedProduct.category || "Other"
    });

    await this.handleProductSelected(threadId, userSsid, "", data, language);
  }

  /**
   * PRODUCT_SELECTED: Show cart and ask for drinks
   */
  private static async handleProductSelected(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    const cartDisplay = PaymentService.formatCart(data.cart);
    const message = language === "en"
      ? `✅ Added to cart!\n\n${cartDisplay}`
      : language === "tl"
      ? `✅ Naidagdag sa cart!\n\n${cartDisplay}`
      : `✅ Added na po sa cart!\n\n${cartDisplay}`;

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    // Move to drinks
    await this.handleAskDrinks(threadId, userSsid, "", data, language);
  }

  /**
   * ASK_DRINKS: Offer drinks carousel
   */
  private static async handleAskDrinks(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "ASK_DRINKS", data);

    const message = language === "en"
      ? "🥤 How about some drinks to go with that?"
      : language === "tl"
      ? "🥤 Paano po ang drinks para sa order?"
      : "🥤 How about drinks po to go with that?";

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    const buttons = [
      { title: "Add Drinks", type: "postback" as const, payload: "show_drinks" },
      { title: "Skip Drinks", type: "postback" as const, payload: "skip_drinks" }
    ];

    await SobotService.sendMixedButtonMessage(userSsid, "Choose an option:", "", buttons);
    await createMessage({ senderSsid: userSsid, content: "[Drinks Buttons]", messageType: "template", isFromBot: true });
  }

  /**
   * Handle drinks selection
   */
  private static async handleDrinkSelection(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    if (userMessage === "show_drinks") {
      const drinks = products.filter(p => p.category === "Drinks").slice(0, 6);

      const carouselItems = drinks.map(drink => ({
        title: drink.name,
        subtitle: `${drink.price}`,
        image_url: drink.image || "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800",
        buttons: [
          {
            title: "Add to Cart",
            type: "postback" as const,
            payload: `add_drink_${drink.id}`
          }
        ]
      }));

      await ConversationManager.updateFlowStep(threadId, "SHOW_DRINKS_CAROUSEL", data);
      await SobotService.sendCarouselMessage(userSsid, carouselItems);
      await createMessage({ senderSsid: userSsid, content: "[Drinks Carousel]", messageType: "template", isFromBot: true });
    } else if (userMessage === "skip_drinks") {
      await this.handleAskDesserts(threadId, userSsid, "", data, language);
    } else if (userMessage.startsWith("add_drink_")) {
      const drinkId = parseInt(userMessage.replace("add_drink_", ""));
      const drink = products.find(p => p.id === drinkId);
      if (drink) {
        data.cart.push({
          productId: drink.id,
          name: drink.name,
          price: drink.price,
          quantity: 1,
          category: "Drinks"
        });
        await this.handleAskDesserts(threadId, userSsid, "", data, language);
      }
    }
  }

  /**
   * ASK_DESSERTS: Offer desserts carousel
   */
  private static async handleAskDesserts(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "ASK_DESSERTS", data);

    const message = language === "en"
      ? "🍰 And how about dessert?"
      : language === "tl"
      ? "🍰 At paano naman ang dessert?"
      : "🍰 And how about dessert po?";

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    const buttons = [
      { title: "Add Desserts", type: "postback" as const, payload: "show_desserts" },
      { title: "Skip Desserts", type: "postback" as const, payload: "skip_desserts" },
      { title: "Proceed to Checkout", type: "postback" as const, payload: "proceed_checkout" }
    ];

    await SobotService.sendMixedButtonMessage(userSsid, "Choose an option:", "", buttons);
    await createMessage({ senderSsid: userSsid, content: "[Desserts Buttons]", messageType: "template", isFromBot: true });
  }

  /**
   * Handle dessert selection
   */
  private static async handleDessertSelection(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    if (userMessage === "show_desserts") {
      const desserts = products.filter(p => p.category === "Desserts").slice(0, 6);

      const carouselItems = desserts.map(dessert => ({
        title: dessert.name,
        subtitle: `${dessert.price}`,
        image_url: dessert.image || "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
        buttons: [
          {
            title: "Add to Cart",
            type: "postback" as const,
            payload: `add_dessert_${dessert.id}`
          }
        ]
      }));

      await ConversationManager.updateFlowStep(threadId, "SHOW_DESSERTS_CAROUSEL", data);
      await SobotService.sendCarouselMessage(userSsid, carouselItems);
      await createMessage({ senderSsid: userSsid, content: "[Desserts Carousel]", messageType: "template", isFromBot: true });
    } else if (userMessage === "skip_desserts" || userMessage === "proceed_checkout") {
      await this.handleCollectLocation(threadId, userSsid, "", data, language);
    } else if (userMessage.startsWith("add_dessert_")) {
      const dessertId = parseInt(userMessage.replace("add_dessert_", ""));
      const dessert = products.find(p => p.id === dessertId);
      if (dessert) {
        data.cart.push({
          productId: dessert.id,
          name: dessert.name,
          price: dessert.price,
          quantity: 1,
          category: "Desserts"
        });
        await this.handleCollectLocation(threadId, userSsid, "", data, language);
      }
    }
  }

  /**
   * COLLECT_LOCATION: Ask for delivery address
   */
  private static async handleCollectLocation(
    threadId: string,
    userSsid: string,
    userMessage: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    if (!data.location) {
      await ConversationManager.updateFlowStep(threadId, "COLLECT_LOCATION", data);

      const message = language === "en"
        ? "📍 Great! Please provide your delivery address and phone number.\n\nExample:\n123 Main St, Makati City\n09171234567"
        : language === "tl"
        ? "📍 Salamat! Ibigay po ninyo ang inyong delivery address at phone number.\n\nHalimbawa:\n123 Main St, Makati City\n09171234567"
        : "📍 Great! Please provide po your delivery address and phone number.\n\nExample:\n123 Main St, Makati City\n09171234567";

      await SobotService.sendTextMessage(userSsid, message);
      await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });
      return;
    }

    // User provided location
    data.location = userMessage;
    await this.handleGeneratePayment(threadId, userSsid, data, language);
  }

  /**
   * GENERATE_PAYMENT: Create payment link and push to webhook
   */
  private static async handleGeneratePayment(
    threadId: string,
    userSsid: string,
    data: OrderFlowData,
    language: "en" | "tl" | "taglish"
  ): Promise<void> {
    await ConversationManager.updateFlowStep(threadId, "GENERATE_PAYMENT", data);

    const total = PaymentService.calculateTotal(data.cart);
    const paymentLink = PaymentService.generatePaymentLink({ cart: data.cart, total, address: data.location });

    // Push to webhook
    await WebhookService.pushOrderData({
      threadId,
      userSsid,
      cart: data.cart,
      total,
      address: data.location,
      phone: data.phone,
      timestamp: new Date().toISOString()
    });

    const cartDisplay = PaymentService.formatCart(data.cart);
    const message = language === "en"
      ? `🎉 Perfect! Your order is ready!\n\n${cartDisplay}\n\n📍 Delivery to: ${data.location || 'Your address'}\n\nClick below to complete payment:`
      : language === "tl"
      ? `🎉 Perfect! Handa na ang inyong order!\n\n${cartDisplay}\n\n📍 I-deliver sa: ${data.location || 'Inyong address'}\n\nClick sa baba para kumpletuhin ang bayad:`
      : `🎉 Perfect! Ready na po your order!\n\n${cartDisplay}\n\n📍 Deliver to: ${data.location || 'Your address'}\n\nClick below para complete payment:`;

    await SobotService.sendTextMessage(userSsid, message);
    await createMessage({ senderSsid: userSsid, content: message, messageType: "text", isFromBot: true });

    await SobotService.sendWebviewButton(userSsid, "Complete Your Order", "Pay Now", paymentLink);
    await createMessage({ senderSsid: userSsid, content: `[Payment Link: ${paymentLink}]`, messageType: "template", isFromBot: true });

    // End flow
    await ConversationManager.endFlow(threadId);
  }
}
