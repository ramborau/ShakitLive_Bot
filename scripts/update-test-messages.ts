import "dotenv/config";
import { prisma } from "../lib/prisma";

async function updateTestMessages() {
  console.log("Updating test thread with sent messages...");

  // Find the user with the correct SSID
  const user = await prisma.user.findUnique({
    where: { ssid: "24614877841461856" },
  });

  if (!user) {
    console.log("Creating user for SSID 24614877841461856...");
    // Create the user if doesn't exist
    await prisma.user.create({
      data: {
        ssid: "24614877841461856",
        firstName: "Rahul",
        lastName: "Mane",
        profilePic: null,
      },
    });
  }

  // Find or create thread
  let thread = await prisma.thread.findFirst({
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

  if (!thread) {
    console.log("Creating new thread...");
    const createdUser = await prisma.user.findUnique({
      where: { ssid: "24614877841461856" },
    });

    thread = await prisma.thread.create({
      data: {
        participants: {
          create: {
            userId: createdUser!.id,
          },
        },
      },
    });
  }

  console.log(`Using thread ID: ${thread.id}`);

  // Add the two bot messages we sent
  const message1 = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderSsid: "24614877841461856",
      content: "Hi Rahul! Thanks for reaching out. I can help you with your order.",
      messageType: "text",
      isFromBot: true,
      enrichmentStatus: "success",
      timestamp: new Date(),
    },
  });

  console.log(`✅ Created bot message 1: ${message1.id}`);

  // Wait a moment
  await new Promise((resolve) => setTimeout(resolve, 100));

  const message2 = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderSsid: "24614877841461856",
      content: "Could you please provide your order number so I can look it up for you?",
      messageType: "text",
      isFromBot: true,
      enrichmentStatus: "success",
      timestamp: new Date(),
    },
  });

  console.log(`✅ Created bot message 2: ${message2.id}`);

  // Update thread's last activity
  await prisma.thread.update({
    where: { id: thread.id },
    data: {
      lastActivity: new Date(),
      lastMessage: "Could you please provide your order number so I can look it up for you?",
    },
  });

  console.log("✅ Thread updated successfully!");
  console.log("\nYou can now view the messages at http://localhost:3000");
}

updateTestMessages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
