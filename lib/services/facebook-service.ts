/**
 * Facebook Send API Service
 *
 * Sends messages via official Facebook Messenger Send API.
 * Replaces SobotService with direct Facebook API integration.
 *
 * Tested Message Types (from FB-TEST-RESULTS.md):
 * ✅ TEXT - Basic text messages
 * ✅ BUTTON Template - Buttons with postback/web_url actions
 * ✅ COUPON Template - Promotional coupon codes
 * ✅ GENERIC Template - Carousels with images and buttons
 * ✅ QUICK REPLIES - Quick reply buttons
 *
 * API Documentation: https://developers.facebook.com/docs/messenger-platform/reference/send-api
 */

import { updateMessageDeliveryStatus } from "@/lib/db-operations";

interface FacebookResponse {
  recipient_id?: string;
  message_id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

interface Button {
  type: "postback" | "web_url";
  title: string;
  payload?: string;
  url?: string;
}

interface QuickReply {
  content_type: "text";
  title: string;
  payload: string;
  image_url?: string;
}

interface GenericElement {
  title: string;
  subtitle?: string;
  image_url?: string;
  attachment_id?: string; // Facebook attachment ID for reusable image
  default_action?: {
    type: "web_url";
    url: string;
    webview_height_ratio?: "compact" | "tall" | "full";
  };
  buttons?: Button[];
}

export class FacebookService {
  private static readonly GRAPH_API_URL = "https://graph.facebook.com/v24.0";
  private static readonly PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
  private static readonly ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  /**
   * Send a text message
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param text - Message text
   * @param trackingMessageId - Optional message ID for delivery tracking
   * @returns Success status and message ID
   */
  static async sendTextMessage(
    recipientPsid: string,
    text: string,
    trackingMessageId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        messaging_type: "RESPONSE",
        message: { text },
      };

      console.log(`[Facebook] Sending text message to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Text message sent successfully: ${response.message_id}`);

        // Update delivery tracking if message ID provided
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "sent", {
            facebookMessageId: response.message_id,
          });
        }

        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send text message:`, response.error);

        // Update delivery tracking with failure
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "failed", {
            failureReason: response.error.message,
            failureDetails: response.error,
          });
        }

        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending text message:`, error);

      // Update delivery tracking with exception
      if (trackingMessageId) {
        await updateMessageDeliveryStatus(trackingMessageId, "failed", {
          failureReason: error instanceof Error ? error.message : "Unknown error",
          failureDetails: error,
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a button template message
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param text - Template text
   * @param buttons - Array of buttons (max 3)
   * @param trackingMessageId - Optional message ID for delivery tracking
   * @returns Success status and message ID
   */
  static async sendButtonTemplate(
    recipientPsid: string,
    text: string,
    buttons: Button[],
    trackingMessageId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text,
              buttons: buttons.slice(0, 3), // Facebook limit: max 3 buttons
            },
          },
        },
      };

      console.log(`[Facebook] Sending button template to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Button template sent successfully: ${response.message_id}`);

        // Update delivery tracking if message ID provided
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "sent", {
            facebookMessageId: response.message_id,
          });
        }

        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send button template:`, response.error);

        // Update delivery tracking with failure
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "failed", {
            failureReason: response.error.message,
            failureDetails: response.error,
          });
        }

        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending button template:`, error);

      // Update delivery tracking with exception
      if (trackingMessageId) {
        await updateMessageDeliveryStatus(trackingMessageId, "failed", {
          failureReason: error instanceof Error ? error.message : "Unknown error",
          failureDetails: error,
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a coupon template message (COMPLEX COUPON)
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param title - Coupon title
   * @param couponCode - Coupon code
   * @param options - Optional fields for complex coupon
   * @returns Success status and message ID
   */
  static async sendCouponTemplate(
    recipientPsid: string,
    title: string,
    couponCode: string,
    options?: {
      subtitle?: string;
      coupon_url?: string;
      coupon_url_button_title?: string;
      coupon_pre_message?: string;
      image_url?: string;
      attachment_id?: string;
      payload?: string;
    }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Build coupon payload with all fields
      const couponPayload: any = {
        template_type: "coupon",
        title,
        coupon_code: couponCode,
      };

      // Add optional fields
      if (options?.subtitle) couponPayload.subtitle = options.subtitle;
      if (options?.coupon_url) couponPayload.coupon_url = options.coupon_url;
      if (options?.coupon_url_button_title) couponPayload.coupon_url_button_title = options.coupon_url_button_title;
      if (options?.coupon_pre_message) couponPayload.coupon_pre_message = options.coupon_pre_message;
      if (options?.payload) couponPayload.payload = options.payload;

      // Add image (prefer attachment_id over image_url)
      if (options?.attachment_id) {
        couponPayload.attachment_id = options.attachment_id;
      } else if (options?.image_url) {
        couponPayload.image_url = options.image_url;
      }

      const payload = {
        recipient: { id: recipientPsid },
        message: {
          attachment: {
            type: "template",
            payload: couponPayload,
          },
        },
      };

      console.log(`[Facebook] Sending complex coupon template to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Coupon template sent successfully: ${response.message_id}`);
        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send coupon template:`, response.error);
        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending coupon template:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a generic template (carousel) message
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param elements - Array of carousel elements (max 10)
   * @param trackingMessageId - Optional message ID for delivery tracking
   * @returns Success status and message ID
   */
  static async sendGenericTemplate(
    recipientPsid: string,
    elements: GenericElement[],
    trackingMessageId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: elements.slice(0, 10), // Facebook limit: max 10 elements
            },
          },
        },
      };

      console.log(
        `[Facebook] Sending generic template with ${elements.length} elements to ${recipientPsid}...`
      );

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Generic template sent successfully: ${response.message_id}`);

        // Update delivery tracking if message ID provided
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "sent", {
            facebookMessageId: response.message_id,
          });
        }

        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send generic template:`, response.error);

        // Update delivery tracking with failure
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "failed", {
            failureReason: response.error.message,
            failureDetails: response.error,
          });
        }

        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending generic template:`, error);

      // Update delivery tracking with exception
      if (trackingMessageId) {
        await updateMessageDeliveryStatus(trackingMessageId, "failed", {
          failureReason: error instanceof Error ? error.message : "Unknown error",
          failureDetails: error,
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a message with quick replies
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param text - Message text
   * @param quickReplies - Array of quick replies (max 13)
   * @param trackingMessageId - Optional message ID for delivery tracking
   * @returns Success status and message ID
   */
  static async sendQuickReplies(
    recipientPsid: string,
    text: string,
    quickReplies: QuickReply[],
    trackingMessageId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        messaging_type: "RESPONSE",
        message: {
          text,
          quick_replies: quickReplies.slice(0, 13), // Facebook limit: max 13 quick replies
        },
      };

      console.log(`[Facebook] Sending quick replies to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Quick replies sent successfully: ${response.message_id}`);

        // Update delivery tracking if message ID provided
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "sent", {
            facebookMessageId: response.message_id,
          });
        }

        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send quick replies:`, response.error);

        // Update delivery tracking with failure
        if (trackingMessageId) {
          await updateMessageDeliveryStatus(trackingMessageId, "failed", {
            failureReason: response.error.message,
            failureDetails: response.error,
          });
        }

        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending quick replies:`, error);

      // Update delivery tracking with exception
      if (trackingMessageId) {
        await updateMessageDeliveryStatus(trackingMessageId, "failed", {
          failureReason: error instanceof Error ? error.message : "Unknown error",
          failureDetails: error,
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Helper: Send button template with mixed button types (postback + web_url)
   * This matches the old SobotService.sendMixedButtonMessage API
   */
  static async sendMixedButtonMessage(
    recipientPsid: string,
    title: string,
    subtitle: string,
    buttons: Button[],
    trackingMessageId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // If subtitle is empty, use button template
    if (!subtitle) {
      return this.sendButtonTemplate(recipientPsid, title, buttons, trackingMessageId);
    }

    // Otherwise use generic template with one element
    return this.sendGenericTemplate(recipientPsid, [
      {
        title,
        subtitle,
        buttons,
      },
    ], trackingMessageId);
  }

  /**
   * Helper: Send carousel message (matches old SobotService.sendCarouselMessage API)
   */
  static async sendCarouselMessage(
    recipientPsid: string,
    items: Array<{
      title: string;
      subtitle?: string;
      image_url?: string;
      attachment_id?: string; // Facebook attachment ID for reusable image
      buttons: Button[];
    }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendGenericTemplate(recipientPsid, items);
  }

  /**
   * Helper: Send webview button (matches old SobotService.sendWebviewButton API)
   */
  static async sendWebviewButton(
    recipientPsid: string,
    text: string,
    buttonTitle: string,
    url: string,
    webviewHeight: "compact" | "tall" | "full" = "tall"
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendButtonTemplate(recipientPsid, text, [
      {
        type: "web_url",
        title: buttonTitle,
        url,
      },
    ]);
  }

  /**
   * Send typing indicator (typing_on or typing_off)
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param action - "typing_on" or "typing_off" or "mark_seen"
   */
  static async sendSenderAction(
    recipientPsid: string,
    action: "typing_on" | "typing_off" | "mark_seen"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        sender_action: action,
      };

      console.log(`[Facebook] Sending sender action "${action}" to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.recipient_id) {
        console.log(`[Facebook] Sender action "${action}" sent successfully`);
        return { success: true };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send sender action:`, response.error);
        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending sender action:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send message with Quick Replies
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param text - Message text
   * @param quickReplies - Array of quick reply options
   * @returns Success status and message ID
   */
  static async sendQuickReply(
    recipientPsid: string,
    text: string,
    quickReplies: QuickReply[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        recipient: { id: recipientPsid },
        messaging_type: "RESPONSE",
        message: {
          text,
          quick_replies: quickReplies,
        },
      };

      console.log(`[Facebook] Sending quick reply to ${recipientPsid}...`);

      const response = await this.sendRequest(payload);

      if (response.message_id) {
        console.log(`[Facebook] Quick reply sent successfully: ${response.message_id}`);
        return {
          success: true,
          messageId: response.message_id,
        };
      } else if (response.error) {
        console.error(`[Facebook] Failed to send quick reply:`, response.error);
        return {
          success: false,
          error: response.error.message,
        };
      }

      return { success: false, error: "Unknown error" };
    } catch (error) {
      console.error(`[Facebook] Error sending quick reply:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Helper: Send typing indicator and wait
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param durationMs - How long to show typing (default 2000ms)
   */
  static async sendTypingIndicator(
    recipientPsid: string,
    durationMs: number = 2000
  ): Promise<void> {
    await this.sendSenderAction(recipientPsid, "typing_on");
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    await this.sendSenderAction(recipientPsid, "typing_off");
  }

  /**
   * Send text message with automatic typing indicator
   *
   * @param recipientPsid - Page-scoped ID of the recipient
   * @param text - Message text
   * @param showTyping - Whether to show typing indicator before message (default true)
   * @param typingDuration - How long to show typing in ms (default 1500ms)
   * @returns Success status and message ID
   */
  static async sendTextMessageWithTyping(
    recipientPsid: string,
    text: string,
    showTyping: boolean = true,
    typingDuration: number = 1500
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (showTyping) {
      await this.sendTypingIndicator(recipientPsid, typingDuration);
    }
    return this.sendTextMessage(recipientPsid, text);
  }

  /**
   * Private: Send request to Facebook Send API
   */
  private static async sendRequest(payload: any): Promise<FacebookResponse> {
    const url = `${this.GRAPH_API_URL}/${this.PAGE_ID}/messages?access_token=${this.ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  }
}
