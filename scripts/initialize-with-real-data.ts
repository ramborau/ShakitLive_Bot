import "dotenv/config";
import { prisma } from "../lib/prisma";
import { MessengerPeopleService } from "../lib/services/messengerpeople-service";
import { SobotService } from "../lib/services/sobot-service";

const RECIPIENT_SSID = "24614877841461856";

async function initializeWithRealData() {
  console.log("🚀 Starting database initialization with real user data...\n");

  // Step 1: Fetch real user profile from MessengerPeople API
  console.log("1️⃣  Fetching user profile from MessengerPeople API...");
  const userProfile = await MessengerPeopleService.getUserProfile(RECIPIENT_SSID);

  let userData: {
    firstName: string;
    lastName: string;
    profilePic: string | null;
  };

  if (userProfile) {
    console.log(`✅ User profile fetched successfully:`);
    console.log(`   - Name: ${userProfile.first_name} ${userProfile.last_name}`);
    console.log(`   - Profile Pic: ${userProfile.profile_pic ? "✓" : "✗"}`);
    userData = {
      firstName: userProfile.first_name,
      lastName: userProfile.last_name,
      profilePic: userProfile.profile_pic,
    };
  } else {
    console.log("⚠️  Failed to fetch user profile from API. Using fallback data...");
    userData = {
      firstName: "Rahul",
      lastName: "Mane",
      profilePic: null,
    };
    console.log(`✅ Using fallback data: ${userData.firstName} ${userData.lastName}`);
  }
  console.log();

  // Step 2: Create user in database with real data
  console.log("2️⃣  Creating user in database...");
  const user = await prisma.user.create({
    data: {
      ssid: RECIPIENT_SSID,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profilePic: userData.profilePic,
    },
  });

  console.log(`✅ User created with ID: ${user.id}`);
  console.log();

  // Step 3: Create thread for this user
  console.log("3️⃣  Creating thread...");
  const thread = await prisma.thread.create({
    data: {
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  console.log(`✅ Thread created with ID: ${thread.id}`);
  console.log();

  // Step 4: Send bot messages via Sobot API
  const botMessages = [
    "Hi! Welcome to ShakeIT. How can I help you today?",
    "Feel free to ask me anything about your orders or our services.",
    "I'm here to assist you 24/7! 😊",
  ];

  console.log("4️⃣  Sending bot messages via Sobot API...");

  for (let i = 0; i < botMessages.length; i++) {
    const messageContent = botMessages[i];
    console.log(`   Sending message ${i + 1}/${botMessages.length}: "${messageContent}"`);

    // Send via Sobot API
    const result = await SobotService.sendTextMessage(RECIPIENT_SSID, messageContent);

    if (result.success) {
      console.log(`   ✅ Sent successfully (Message ID: ${result.messageId})`);

      // Store in database
      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderSsid: RECIPIENT_SSID,
          content: messageContent,
          messageType: "text",
          isFromBot: true,
          enrichmentStatus: "success",
        },
      });

      console.log(`   ✅ Stored in database as bot message`);
    } else {
      console.error(`   ❌ Failed to send: ${result.error}`);
    }

    // Wait a moment between messages
    if (i < botMessages.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    console.log();
  }

  // Update thread's last activity
  await prisma.thread.update({
    where: { id: thread.id },
    data: {
      lastActivity: new Date(),
      lastMessage: botMessages[botMessages.length - 1],
    },
  });

  console.log("✅ Thread updated with last message");
  console.log();

  console.log("🎉 Database initialization complete!");
  console.log();
  console.log("📊 Summary:");
  console.log(`   - User: ${userData.firstName} ${userData.lastName} (${RECIPIENT_SSID})`);
  console.log(`   - Thread ID: ${thread.id}`);
  console.log(`   - Bot Messages Sent: ${botMessages.length}`);
  console.log();
  console.log("🌐 Open http://localhost:3000 to view the chat interface");
}

initializeWithRealData()
  .catch((error) => {
    console.error("❌ Error during initialization:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
