import "dotenv/config";
import { SobotService } from "../lib/services/sobot-service";

async function sendTestMessages() {
  const recipientId = "24614877841461856"; // Test SSID - working recipient

  console.log("Sending test messages to:", recipientId);
  console.log("---");

  // Send first message
  console.log("1. Sending first message...");
  const result1 = await SobotService.sendTextMessage(
    recipientId,
    "Hi Rahul! Thanks for reaching out. I can help you with your order."
  );

  if (result1.success) {
    console.log("✅ First message sent successfully!");
    console.log("   Message ID:", result1.messageId);
  } else {
    console.error("❌ First message failed:", result1.error);
  }

  // Wait a moment before sending second message
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Send second message
  console.log("\n2. Sending second message...");
  const result2 = await SobotService.sendTextMessage(
    recipientId,
    "Could you please provide your order number so I can look it up for you?"
  );

  if (result2.success) {
    console.log("✅ Second message sent successfully!");
    console.log("   Message ID:", result2.messageId);
  } else {
    console.error("❌ Second message failed:", result2.error);
  }

  console.log("\n---");
  console.log("📊 Summary:");
  console.log("   Messages sent: 2");
  console.log("   Success:", [result1.success, result2.success].filter(Boolean).length);
  console.log("   Failed:", [result1.success, result2.success].filter(s => !s).length);
  console.log("\n💬 Check your Facebook Messenger to see the messages!");
}

sendTestMessages().catch(console.error);
