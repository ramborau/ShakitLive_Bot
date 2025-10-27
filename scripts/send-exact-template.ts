import "dotenv/config";
import { TokenService } from "../lib/services/token-service";
import { prisma } from "../lib/prisma";

async function sendExactTemplate() {
  console.log("🚀 Sending exact template message...\n");

  const token = await TokenService.getToken();
  const SOBOT_API_URL = process.env.SOBOT_API_URL!;

  // Exact payload as provided
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: "24614877841461856",
    pageid: "759563007234526",
    type: "template",
    payload: {
      template_type: "generic",
      elements: [
        {
          title: "Welcome!",
          image_url: "https://petersfancybrownhats.com/company_image.png",
          subtitle: "We have the right hat for everyone.",
          default_action: {
            type: "web_url",
            url: "https://petersfancybrownhats.com/view?item=103",
            webview_height_ratio: "tall",
          },
          buttons: [
            {
              type: "web_url",
              url: "https://petersfancybrownhats.com",
              title: "View Website",
            },
            {
              type: "postback",
              title: "Start Chatting",
              payload: "DEVELOPER_DEFINED_PAYLOAD",
            },
          ],
        },
      ],
    },
    quick_replies: [
      {
        content_type: "text",
        title: "Search",
        payload: "<POSTBACK_PAYLOAD>",
        image_url: "http://example.com/img/red.png",
      },
      {
        content_type: "location",
      },
    ],
  };

  console.log("📤 Sending to Sobot API...");

  const response = await fetch(SOBOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log("Response:", JSON.stringify(data, null, 2));

  if (data.ret_code === "000000") {
    console.log("✅ Template message sent successfully!");

    // Store in database
    const thread = await prisma.thread.findFirst({
      where: {
        participants: {
          some: {
            user: {
              ssid: "24614877841461856",
            },
          },
        },
      },
    });

    if (thread) {
      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderSsid: "24614877841461856",
          content: "Welcome! We have the right hat for everyone.",
          messageType: "template",
          isFromBot: true,
          enrichmentStatus: "success",
          metadata: JSON.stringify(payload),
        },
      });

      await prisma.thread.update({
        where: { id: thread.id },
        data: {
          lastActivity: new Date(),
          lastMessage: "Welcome! We have the right hat for everyone.",
        },
      });

      console.log("✅ Stored in database");
    }

    console.log("\n🎉 Check Facebook Messenger and http://localhost:3000");
  } else {
    console.error("❌ Failed:", data.ret_msg);
  }
}

sendExactTemplate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
