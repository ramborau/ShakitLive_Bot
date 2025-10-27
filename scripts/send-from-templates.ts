import "dotenv/config";
import fs from "fs";
import path from "path";
import { TokenService } from "../lib/services/token-service";
import { prisma } from "../lib/prisma";

const RECIPIENT_SSID = "24614877841461856";
const SOBOT_API_URL = process.env.SOBOT_API_URL!;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;

interface Template {
  id: string;
  name: string;
  type: string;
  payload: any;
}

interface TemplatesFile {
  templates: Template[];
}

async function sendFromTemplate(templateId?: string) {
  // Load templates from JSON file
  const templatesPath = path.join(process.cwd(), "message-templates.json");
  const templatesData = fs.readFileSync(templatesPath, "utf-8");
  const { templates }: TemplatesFile = JSON.parse(templatesData);

  // If no template ID provided, list available templates
  if (!templateId) {
    console.log("📋 Available Templates:\n");
    templates.forEach((template) => {
      console.log(`  ${template.id}`);
      console.log(`  └─ ${template.name}`);
      console.log();
    });
    console.log("Usage: npx tsx scripts/send-from-templates.ts <template_id>");
    console.log("Example: npx tsx scripts/send-from-templates.ts welcome_template");
    return;
  }

  // Find template by ID
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    console.error(`❌ Template '${templateId}' not found!`);
    console.log("\nAvailable templates:");
    templates.forEach((t) => console.log(`  - ${t.id}`));
    process.exit(1);
  }

  console.log(`🚀 Sending template: ${template.name}\n`);

  const token = await TokenService.getToken();

  // Build Sobot API payload
  const payload = {
    messaging_type: "RESPONSE",
    recipientid: RECIPIENT_SSID,
    pageid: PAGE_ID,
    type: template.type,
    payload: template.payload,
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

  if (data.ret_code === "000000") {
    console.log("✅ Template message sent successfully!");
    console.log(`   Message ID: ${data.item?.message_id}`);

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
      // Extract content for display
      const element = template.payload.elements?.[0];
      const content =
        element?.title ||
        element?.subtitle ||
        `Template: ${template.name}`;

      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderSsid: RECIPIENT_SSID,
          content: content,
          messageType: template.type,
          isFromBot: true,
          enrichmentStatus: "success",
          metadata: JSON.stringify(payload),
        },
      });

      await prisma.thread.update({
        where: { id: thread.id },
        data: {
          lastActivity: new Date(),
          lastMessage: content,
        },
      });

      console.log("✅ Stored in database");
    }

    console.log("\n🎉 Check Facebook Messenger and http://localhost:3000");
  } else {
    console.error("❌ Failed:", data.ret_msg);
    console.error("Response:", JSON.stringify(data, null, 2));
  }
}

const templateId = process.argv[2];
sendFromTemplate(templateId)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
