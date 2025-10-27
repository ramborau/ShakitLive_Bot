import { prisma } from "../prisma";

export type FlowType = "faq" | "order" | "location" | "promo" | "complaint" | "party" | "tracking" | "supercard" | null;
export type Language = "en" | "tl" | "taglish";

export interface ConversationContext {
  currentFlow: FlowType;
  flowStep?: string;
  flowData?: any;
  intent?: string;
  language: Language;
  needsHuman: boolean;
}

export interface FlowData {
  // Order flow data
  cart?: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress?: string;
  orderType?: "delivery" | "carryout";

  // Location flow data
  searchLocation?: string;
  selectedBranch?: string;

  // Promo flow data
  selectedPromo?: string;

  // Complaint flow data
  complaintType?: string;
  orderReference?: string;
}

export class ConversationManager {
  /**
   * Get conversation context for a thread
   */
  static async getContext(threadId: string): Promise<ConversationContext> {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: {
        currentFlow: true,
        flowStep: true,
        flowData: true,
        intent: true,
        language: true,
        needsHuman: true,
      },
    });

    if (!thread) {
      throw new Error(`Thread ${threadId} not found`);
    }

    return {
      currentFlow: thread.currentFlow as FlowType,
      flowStep: thread.flowStep || undefined,
      flowData: thread.flowData ? JSON.parse(thread.flowData) : undefined,
      intent: thread.intent || undefined,
      language: (thread.language as Language) || "en",
      needsHuman: thread.needsHuman,
    };
  }

  /**
   * Update conversation context
   */
  static async updateContext(
    threadId: string,
    context: Partial<ConversationContext>
  ): Promise<void> {
    const updateData: any = {};

    if (context.currentFlow !== undefined) {
      updateData.currentFlow = context.currentFlow;
    }

    if (context.flowStep !== undefined) {
      updateData.flowStep = context.flowStep;
    }

    if (context.flowData !== undefined) {
      updateData.flowData = JSON.stringify(context.flowData);
    }

    if (context.intent !== undefined) {
      updateData.intent = context.intent;
    }

    if (context.language !== undefined) {
      updateData.language = context.language;
    }

    if (context.needsHuman !== undefined) {
      updateData.needsHuman = context.needsHuman;
    }

    updateData.lastActivity = new Date();

    await prisma.thread.update({
      where: { id: threadId },
      data: updateData,
    });

    console.log(`[ConversationManager] Updated context for thread ${threadId}`);
  }

  /**
   * Start a new flow
   */
  static async startFlow(
    threadId: string,
    flowType: FlowType,
    initialStep?: string,
    initialData?: any
  ): Promise<void> {
    await this.updateContext(threadId, {
      currentFlow: flowType,
      flowStep: initialStep || "start",
      flowData: initialData || {},
    });

    console.log(`[ConversationManager] Started ${flowType} flow for thread ${threadId}`);
  }

  /**
   * Update flow step
   */
  static async updateFlowStep(
    threadId: string,
    step: string,
    data?: any
  ): Promise<void> {
    const context = await this.getContext(threadId);
    const updatedData = { ...context.flowData, ...data };

    await this.updateContext(threadId, {
      flowStep: step,
      flowData: updatedData,
    });

    console.log(
      `[ConversationManager] Updated flow step to '${step}' for thread ${threadId}`
    );
  }

  /**
   * End current flow
   */
  static async endFlow(threadId: string): Promise<void> {
    await this.updateContext(threadId, {
      currentFlow: null,
      flowStep: undefined,
      flowData: {},
    });

    console.log(`[ConversationManager] Ended flow for thread ${threadId}`);
  }

  /**
   * Check if thread needs human assistance
   */
  static async checkNeedsHuman(threadId: string): Promise<boolean> {
    const context = await this.getContext(threadId);
    return context.needsHuman;
  }

  /**
   * Set escalation to human
   */
  static async escalateToHuman(
    threadId: string,
    reason?: string
  ): Promise<void> {
    await this.updateContext(threadId, {
      needsHuman: true,
      currentFlow: "complaint",
      flowData: { escalationReason: reason },
    });

    console.log(`[ConversationManager] Escalated thread ${threadId} to human: ${reason}`);
  }

  /**
   * Get conversation history (last N messages)
   */
  static async getHistory(
    threadId: string,
    limit: number = 10
  ): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { timestamp: "desc" },
      take: limit,
      select: {
        content: true,
        isFromBot: true,
      },
    });

    return messages
      .reverse()
      .map((msg) => ({
        role: msg.isFromBot ? ("assistant" as const) : ("user" as const),
        content: msg.content,
      }));
  }

  /**
   * Detect language from user message
   */
  static detectLanguage(text: string): Language {
    // Simple language detection based on common words
    const tagalogWords = ["po", "ako", "opo", "salamat", "kumusta", "gusto", "saan", "may", "ba", "na", "ng"];
    const words = text.toLowerCase().split(/\s+/);

    const tagalogCount = words.filter(word =>
      tagalogWords.some(tw => word.includes(tw))
    ).length;

    const hasEnglish = /[a-z]/i.test(text);
    const hasTagalog = tagalogCount > 0;

    if (hasEnglish && hasTagalog && tagalogCount >= 2) {
      return "taglish";
    } else if (hasTagalog && tagalogCount >= 1) {
      return "tl";
    } else {
      return "en";
    }
  }

  /**
   * Update detected language for thread
   */
  static async updateLanguage(threadId: string, text: string): Promise<Language> {
    const detectedLang = this.detectLanguage(text);
    await this.updateContext(threadId, { language: detectedLang });
    return detectedLang;
  }

  /**
   * Clear conversation history and reset thread state
   */
  static async clearHistory(threadId: string): Promise<void> {
    // Delete all messages for this thread
    await prisma.message.deleteMany({
      where: { threadId }
    });

    // Reset thread state
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        currentFlow: null,
        flowStep: null,
        flowData: null,
        intent: null,
        needsHuman: false,
        lastActivity: new Date(),
        lastMessage: "[Conversation cleared]"
      }
    });

    console.log(`[ConversationManager] Cleared history for thread ${threadId}`);
  }
}
