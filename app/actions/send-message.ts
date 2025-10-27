"use server";

import { SobotService } from "@/lib/services/sobot-service";
import { createBotMessage } from "@/lib/db-operations";
import { revalidatePath } from "next/cache";

export async function sendMessage(recipientId: string, message: string, threadId: string) {
  try {
    const result = await SobotService.sendTextMessage(recipientId, message);

    if (result.success) {
      // Store the sent message in the database as a bot message
      await createBotMessage(recipientId, message, "text");

      console.log(`[SendMessage] Bot message stored in database for thread ${threadId}`);

      // Revalidate the home page to show the sent message
      revalidatePath("/");
      return { success: true, messageId: result.messageId };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
