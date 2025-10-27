import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { FacebookService } from "@/lib/services/facebook-service";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { threadId, flowType } = await req.json();

    if (!threadId || !flowType) {
      return NextResponse.json(
        { error: "Missing threadId or flowType" },
        { status: 400 }
      );
    }

    // Get the thread to find the user SSID
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        participants: {
          include: { user: true }
        }
      }
    });

    if (!thread || !thread.participants[0]) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    const recipientSsid = thread.participants[0].user.ssid;

    // Update thread with new flow
    await prisma.thread.update({
      where: { id: threadId },
      data: {
        currentFlow: flowType.toLowerCase(),
        flowStep: 'initiated',
        flowData: null, // Reset flow data
        lastActivity: new Date()
      }
    });

    // Send initial message based on flow type
    let messageText = "";

    switch (flowType.toLowerCase()) {
      case 'order':
        messageText = "🍕 Let's get your order started! What would you like to have today? You can tell me what you're craving (pizza, chicken, pasta, etc.) and I'll show you our best options!";
        break;
      case 'supercard':
        messageText = "💳 Great! Let me help you with SuperCard information. What would you like to know about our SuperCard program?";
        break;
      case 'location':
        messageText = "📍 I can help you find the nearest Shakey's branch! Would you like me to show you branches near you?";
        break;
      case 'tracking':
        messageText = "📦 Let's track your order! Please provide your order tracking number or phone number you used for the order.";
        break;
      default:
        messageText = `Starting ${flowType} flow...`;
    }

    // Send the message via Messenger API
    await FacebookService.sendTextMessage(recipientSsid, messageText);

    // Save the message to database
    await prisma.message.create({
      data: {
        threadId,
        content: messageText,
        senderSsid: 'bot',
        messageType: 'text',
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `${flowType} flow initiated successfully`
    });

  } catch (error) {
    console.error("Error initiating flow:", error);
    return NextResponse.json(
      { error: "Failed to initiate flow" },
      { status: 500 }
    );
  }
}
