import { prisma } from "./prisma";
import { MessengerPeopleService } from "./services/messengerpeople-service";

export interface CreateMessageInput {
  senderSsid: string;
  content: string;
  messageType?: string;
  isFromBot?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Upsert a user with enrichment
 */
export async function upsertUser(ssid: string) {
  // Check if user exists
  let user = await prisma.user.findUnique({ where: { ssid } });

  if (!user) {
    // Enrich user data
    const enrichedData = await MessengerPeopleService.enrichUser(ssid);

    user = await prisma.user.create({
      data: {
        ssid,
        firstName: enrichedData.firstName,
        lastName: enrichedData.lastName,
        profilePic: enrichedData.profilePic,
      },
    });

    console.log(`[DB] Created new user: ${user.firstName} ${user.lastName}`);
  }

  return user;
}

/**
 * Find or create a thread for a user
 */
export async function findOrCreateThread(userSsid: string) {
  const user = await upsertUser(userSsid);

  // Find existing thread with this user
  const existingThread = await prisma.thread.findFirst({
    where: {
      participants: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      },
    },
  });

  if (existingThread) {
    return existingThread;
  }

  // Create new thread
  const newThread = await prisma.thread.create({
    data: {
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: true,
    },
  });

  console.log(`[DB] Created new thread for user ${userSsid}`);

  return newThread;
}

/**
 * Create a new message in a thread
 */
export async function createMessage(input: CreateMessageInput) {
  const thread = await findOrCreateThread(input.senderSsid);

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderSsid: input.senderSsid,
      content: input.content,
      messageType: input.messageType || "text",
      isFromBot: input.isFromBot || false,
      enrichmentStatus: "success",
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
    include: {
      sender: true,
      thread: true,
    },
  });

  // Update thread's last activity and last message
  await prisma.thread.update({
    where: { id: thread.id },
    data: {
      lastActivity: new Date(),
      lastMessage: input.content.substring(0, 100),
    },
  });

  console.log(`[DB] Created message in thread ${thread.id}`);

  return message;
}

/**
 * Create a bot message in a thread
 */
export async function createBotMessage(
  recipientSsid: string,
  content: string,
  messageType: string = "text"
) {
  return createMessage({
    senderSsid: recipientSsid,
    content,
    messageType,
    isFromBot: true,
  });
}

/**
 * Get all threads with latest messages
 */
export async function getAllThreads() {
  const threads = await prisma.thread.findMany({
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
        include: {
          sender: true,
        },
      },
    },
    orderBy: {
      lastActivity: "desc",
    },
  });

  return threads;
}

/**
 * Get all messages in a thread
 */
export async function getThreadMessages(threadId: string) {
  const messages = await prisma.message.findMany({
    where: { threadId },
    include: {
      sender: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return messages;
}

/**
 * Get thread by ID
 */
export async function getThreadById(threadId: string) {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });

  return thread;
}
