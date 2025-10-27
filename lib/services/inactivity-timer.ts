/**
 * Inactivity Timer Service
 *
 * Tracks user activity and sends follow-up messages after 5 minutes of inactivity.
 * Uses Quick Replies to prompt users with common actions.
 */

import { FacebookService } from "./facebook-service";
import { createBotMessage } from "../db-operations";
import { ConversationManager } from "./conversation-manager";

interface TimerEntry {
  threadId: string;
  userSsid: string;
  timer: NodeJS.Timeout;
  lastActivity: Date;
}

export class InactivityTimerService {
  private static timers: Map<string, TimerEntry> = new Map();
  private static readonly INACTIVITY_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Start or restart the inactivity timer for a user
   */
  static startTimer(threadId: string, userSsid: string): void {
    // Clear existing timer if any
    this.clearTimer(threadId);

    console.log(`[InactivityTimer] Starting 5-minute timer for thread ${threadId}`);

    const timer = setTimeout(() => {
      this.handleInactivity(threadId, userSsid);
    }, this.INACTIVITY_DURATION_MS);

    this.timers.set(threadId, {
      threadId,
      userSsid,
      timer,
      lastActivity: new Date(),
    });
  }

  /**
   * Clear the timer for a specific thread
   */
  static clearTimer(threadId: string): void {
    const entry = this.timers.get(threadId);
    if (entry) {
      clearTimeout(entry.timer);
      this.timers.delete(threadId);
      console.log(`[InactivityTimer] Cleared timer for thread ${threadId}`);
    }
  }

  /**
   * Reset the timer (when user sends a message)
   */
  static resetTimer(threadId: string, userSsid: string): void {
    console.log(`[InactivityTimer] Resetting timer for thread ${threadId}`);
    this.startTimer(threadId, userSsid);
  }

  /**
   * Handle inactivity - send follow-up message with Quick Replies
   */
  private static async handleInactivity(threadId: string, userSsid: string): Promise<void> {
    try {
      console.log(`[InactivityTimer] Handling inactivity for thread ${threadId}`);

      // Get user's language preference
      const context = await ConversationManager.getContext(threadId);
      const language = context.language || "en";

      // Multi-language follow-up messages
      const followUpMessages: Record<string, string> = {
        en: "Still there? 😊 Need help with something? I can send offers, locations, or help you order. 🍕",
        tl: "Nandito ka pa ba? 😊 Kailangan mo ba ng tulong? Pwede kitang padalhan ng offers, locations, o tumulong sa pag-order. 🍕",
        taglish: "Still there? 😊 May kailangan ka ba? I can send offers, locations, or help you mag-order. 🍕",
      };

      const followUpText = followUpMessages[language] || followUpMessages.en;

      // Quick reply options based on language
      const quickReplies = language === "tl"
        ? [
            {
              content_type: "text" as const,
              title: "Mag-order Ngayon",
              payload: "start_order",
            },
            {
              content_type: "text" as const,
              title: "Tingnan Offers",
              payload: "view_offers",
            },
            {
              content_type: "text" as const,
              title: "Hanapin Location",
              payload: "find_location",
            },
          ]
        : language === "taglish"
        ? [
            {
              content_type: "text" as const,
              title: "Order Now",
              payload: "start_order",
            },
            {
              content_type: "text" as const,
              title: "View Offers",
              payload: "view_offers",
            },
            {
              content_type: "text" as const,
              title: "Find Location",
              payload: "find_location",
            },
          ]
        : [
            {
              content_type: "text" as const,
              title: "Order Now",
              payload: "start_order",
            },
            {
              content_type: "text" as const,
              title: "View Offers",
              payload: "view_offers",
            },
            {
              content_type: "text" as const,
              title: "Find Location",
              payload: "find_location",
            },
          ];

      // Send typing indicator first
      await FacebookService.sendTypingIndicator(userSsid, 1500);

      // Send follow-up message with Quick Replies
      const result = await FacebookService.sendQuickReply(
        userSsid,
        followUpText,
        quickReplies
      );

      if (result.success) {
        console.log(`[InactivityTimer] Follow-up message sent successfully`);

        // Save to database
        await createBotMessage(userSsid, followUpText);
      } else {
        console.error(`[InactivityTimer] Failed to send follow-up:`, result.error);
      }

      // Remove timer after sending (don't restart automatically)
      this.timers.delete(threadId);
    } catch (error) {
      console.error(`[InactivityTimer] Error handling inactivity:`, error);
    }
  }

  /**
   * Get active timer count (for debugging)
   */
  static getActiveTimerCount(): number {
    return this.timers.size;
  }

  /**
   * Clear all timers (useful for cleanup/testing)
   */
  static clearAllTimers(): void {
    console.log(`[InactivityTimer] Clearing all ${this.timers.size} timers`);
    this.timers.forEach((entry) => {
      clearTimeout(entry.timer);
    });
    this.timers.clear();
  }
}
