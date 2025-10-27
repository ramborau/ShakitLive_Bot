import "dotenv/config";
import { FacebookService } from "../lib/services/facebook-service";
import { prisma } from "../lib/prisma";

const RECIPIENT_SSID = "24614877841461856";

async function sendTemplateMessage() {
  console.log("🚀 Sending template message...\n");

  // Template message payload
  const templatePayload = {
    template_type: "generic",
    elements: [
      {
        title: "Welcome!",
        image_url: "https://petersfancybrownhats.com/company_image.png",
        subtitle: "We have the right hat for everyone.",
        default_action: {
          type: "web_url",
          url: "https://petersfancybrownhats.com/view?item=103",
          messenger_extensions: false,
          webview_height_ratio: "tall",
          fallback_url: "https://petersfancybrownhats.com/",
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
  };

  console.log("📤 Sending template message to:", RECIPIENT_SSID);

  const result = await FacebookService.sendGenericTemplate(
    RECIPIENT_SSID,
    templatePayload.elements
  );

  if (result.success) {
    console.log(`✅ Template message sent successfully!`);
    console.log(`   Message ID: ${result.messageId}`);

    // Store in database
    const thread = await prisma.thread.findFirst({
      where: {
        participants: {
          some: {
            user: {
              ssid: RECIPIENT_SSID,
            },
          },
        },
      },
    });

    if (thread) {
      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderSsid: RECIPIENT_SSID,
          content: "Welcome! We have the right hat for everyone.",
          messageType: "template",
          isFromBot: true,
          enrichmentStatus: "success",
          metadata: JSON.stringify(templatePayload),
        },
      });

      await prisma.thread.update({
        where: { id: thread.id },
        data: {
          lastActivity: new Date(),
          lastMessage: "Welcome! We have the right hat for everyone.",
        },
      });

      console.log(`✅ Template message stored in database`);
    }

    console.log("\n🎉 Complete! Check your Facebook Messenger and http://localhost:3000");
  } else {
    console.error(`❌ Failed to send template message: ${result.error}`);
  }
}

sendTemplateMessage()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
