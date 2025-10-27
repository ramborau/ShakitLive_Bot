import { TokenService } from "./token-service";

interface TemplateElement {
  title: string;
  image_url?: string;
  subtitle?: string;
  default_action?: {
    type: string;
    url: string;
    webview_height_ratio?: string;
  };
  buttons?: Array<{
    type: string;
    url?: string;
    title: string;
    payload?: string;
  }>;
}

interface TemplatePayload {
  template_type: string;
  elements: TemplateElement[];
}

interface SobotResponse {
  ret_code: string;
  ret_msg: string;
  item?: {
    message_id: string;
    recipient_id: string;
  };
}

export class SobotService {
  private static readonly API_URL = process.env.SOBOT_API_URL!;
  private static readonly PAGE_ID = process.env.FACEBOOK_PAGE_ID!;

  /**
   * Send a text message
   */
  static async sendTextMessage(
    recipientId: string,
    text: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const token = await TokenService.getToken();

      const payload = {
        messaging_type: "RESPONSE",
        recipientid: recipientId,
        pageid: this.PAGE_ID,
        type: "text",
        payload: text,
      };

      console.log(`[Sobot] Sending text message to ${recipientId}...`);

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(payload),
      });

      const data: SobotResponse = await response.json();

      if (data.ret_code === "000000" && data.item) {
        console.log(
          `[Sobot] Message sent successfully: ${data.item.message_id}`
        );
        return {
          success: true,
          messageId: data.item.message_id,
        };
      } else {
        console.error(`[Sobot] Failed to send message: ${data.ret_msg}`);
        return {
          success: false,
          error: data.ret_msg,
        };
      }
    } catch (error) {
      console.error(`[Sobot] Error sending text message:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a template message with buttons
   */
  static async sendTemplateMessage(
    recipientId: string,
    templatePayload: TemplatePayload
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const token = await TokenService.getToken();

      const payload = {
        messaging_type: "RESPONSE",
        recipientid: recipientId,
        pageid: this.PAGE_ID,
        type: "template",
        payload: templatePayload,
      };

      console.log(`[Sobot] Sending template message to ${recipientId}...`);

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(payload),
      });

      const data: SobotResponse = await response.json();

      if (data.ret_code === "000000" && data.item) {
        console.log(
          `[Sobot] Template sent successfully: ${data.item.message_id}`
        );
        return {
          success: true,
          messageId: data.item.message_id,
        };
      } else {
        console.error(`[Sobot] Failed to send template: ${data.ret_msg}`);
        return {
          success: false,
          error: data.ret_msg,
        };
      }
    } catch (error) {
      console.error(`[Sobot] Error sending template message:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send a quick reply message with buttons
   */
  static async sendButtonMessage(
    recipientId: string,
    title: string,
    buttons: Array<{ title: string; payload: string }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template: TemplatePayload = {
      template_type: "generic",
      elements: [
        {
          title,
          buttons: buttons.map((btn) => ({
            type: "postback",
            title: btn.title,
            payload: btn.payload,
          })),
        },
      ],
    };

    return this.sendTemplateMessage(recipientId, template);
  }

  /**
   * Send a message with mixed button types (postback and URL)
   */
  static async sendMixedButtonMessage(
    recipientId: string,
    title: string,
    subtitle: string,
    buttons: Array<{ title: string; type: "postback" | "web_url"; payload?: string; url?: string }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template: TemplatePayload = {
      template_type: "generic",
      elements: [
        {
          title,
          subtitle,
          buttons: buttons.map((btn) => ({
            type: btn.type,
            title: btn.title,
            payload: btn.payload,
            url: btn.url,
          })),
        },
      ],
    };

    return this.sendTemplateMessage(recipientId, template);
  }

  /**
   * Send a carousel message with multiple items (products, locations, etc.)
   */
  static async sendCarouselMessage(
    recipientId: string,
    items: Array<{
      title: string;
      subtitle?: string;
      image_url?: string;
      buttons: Array<{ title: string; type: "postback" | "web_url"; payload?: string; url?: string }>;
    }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const elements: TemplateElement[] = items.map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      image_url: item.image_url,
      buttons: item.buttons.map((btn) => ({
        type: btn.type,
        title: btn.title,
        payload: btn.payload,
        url: btn.url,
      })),
    }));

    const template: TemplatePayload = {
      template_type: "generic",
      elements: elements.slice(0, 10), // Facebook limit is 10 elements
    };

    console.log(`[Sobot] Sending carousel with ${elements.length} items to ${recipientId}...`);
    return this.sendTemplateMessage(recipientId, template);
  }

  /**
   * Send a webview button message
   */
  static async sendWebviewButton(
    recipientId: string,
    text: string,
    buttonTitle: string,
    url: string,
    webviewHeight: "compact" | "tall" | "full" = "tall"
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template: TemplatePayload = {
      template_type: "generic",
      elements: [
        {
          title: text,
          buttons: [
            {
              type: "web_url",
              title: buttonTitle,
              url: url,
            },
          ],
        },
      ],
    };

    console.log(`[Sobot] Sending webview button to ${recipientId}...`);
    return this.sendTemplateMessage(recipientId, template);
  }
}
