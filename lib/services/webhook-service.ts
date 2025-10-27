/**
 * Webhook Service
 * Pushes order data to external webhook endpoint
 */

export interface OrderWebhookData {
  threadId: string;
  userSsid: string;
  cart: any[];
  total: number;
  address?: string;
  phone?: string;
  timestamp: string;
}

export class WebhookService {
  /**
   * Push order data to external webhook
   * The webhook URL should be provided by the user
   */
  static async pushOrderData(data: OrderWebhookData): Promise<boolean> {
    const webhookUrl = process.env.ORDER_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("[WebhookService] No ORDER_WEBHOOK_URL configured");
      return false;
    }

    try {
      console.log(`[WebhookService] Pushing order data to webhook...`);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("[WebhookService] Order data pushed successfully");
        return true;
      } else {
        console.error(`[WebhookService] Webhook failed with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error("[WebhookService] Error pushing to webhook:", error);
      return false;
    }
  }
}
