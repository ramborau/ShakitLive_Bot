import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestMessage() {
  try {
    // Test recipient ID from .env
    const testSsid = "24741717418845100";

    console.log("Creating test user and message...");

    // Create or update user with enriched data
    const user = await prisma.user.upsert({
      where: { ssid: testSsid },
      update: {},
      create: {
        ssid: testSsid,
        firstName: "Rahul",
        lastName: "Mane",
        profilePic: "https://platform-lookaside.fbsbx.com/platform/profilepic/?eai=AavzKLaOaqtriauMGNfTJEbo5JFiQMouNUn3ttt9FBFLPKNiTasFXk2eQc8BGzyhVVM3sDvlspiCPQ&psid=24741717418845100&width=1024&ext=1764072871&hash=AT_gNYm8Sqkolm9KnrnLmDm4",
      },
    });

    console.log("User created:", user);

    // Create thread
    const thread = await prisma.thread.create({
      data: {
        lastMessage: "Hello! This is a test message from the webhook.",
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    console.log("Thread created:", thread);

    // Create message
    const message = await prisma.message.create({
      data: {
        threadId: thread.id,
        senderSsid: testSsid,
        content: "Hello! This is a test message from the webhook.",
        messageType: "text",
        enrichmentStatus: "success",
      },
    });

    console.log("Message created:", message);

    // Create another message
    const message2 = await prisma.message.create({
      data: {
        threadId: thread.id,
        senderSsid: testSsid,
        content: "Can you help me with my order?",
        messageType: "text",
        enrichmentStatus: "success",
      },
    });

    console.log("Second message created:", message2);

    // Update thread
    await prisma.thread.update({
      where: { id: thread.id },
      data: {
        lastActivity: new Date(),
        lastMessage: "Can you help me with my order?",
      },
    });

    console.log("✅ Test data created successfully!");
    console.log(`Thread ID: ${thread.id}`);
    console.log(`User: ${user.firstName} ${user.lastName}`);
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMessage();
