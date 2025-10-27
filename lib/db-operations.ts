import { prisma } from "./prisma";
import { FacebookProfileService } from "./services/facebook-profile-service";

export interface CreateMessageInput {
  senderSsid: string;
  content: string;
  messageType?: string;
  isFromBot?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Upsert a user with enrichment
 * Now also refreshes profile data on every call (not just creation)
 */
export async function upsertUser(ssid: string) {
  // Enrich user data from Facebook Graph API
  const enrichedData = await FacebookProfileService.enrichUser(ssid);

  // Use Prisma's upsert to avoid race conditions
  const user = await prisma.user.upsert({
    where: { ssid },
    update: {
      firstName: enrichedData.firstName,
      lastName: enrichedData.lastName,
      profilePic: enrichedData.profilePic,
    },
    create: {
      ssid,
      firstName: enrichedData.firstName,
      lastName: enrichedData.lastName,
      profilePic: enrichedData.profilePic,
    },
  });

  console.log(`[DB] Upserted user: ${user.firstName} ${user.lastName} (${ssid})`);

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

/**
 * Get user by PSID (Page-Scoped ID)
 */
export async function getUserByPsid(psid: string) {
  const user = await prisma.user.findUnique({
    where: { ssid: psid },
  });

  return user;
}

/**
 * Update message delivery status when bot attempts to send
 */
export async function updateMessageDeliveryStatus(
  messageId: string,
  status: "pending" | "sent" | "delivered" | "failed",
  details?: {
    facebookMessageId?: string;
    failureReason?: string;
    failureDetails?: any;
  }
) {
  try {
    const updateData: any = {
      deliveryStatus: status,
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date(),
    };

    if (status === "sent" || status === "delivered") {
      updateData.deliveredAt = new Date();
      if (details?.facebookMessageId) {
        updateData.facebookMessageId = details.facebookMessageId;
      }
    }

    if (status === "failed") {
      if (details?.failureReason) {
        updateData.failureReason = details.failureReason;
      }
      if (details?.failureDetails) {
        updateData.failureDetails = JSON.stringify(details.failureDetails);
      }
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: updateData,
    });

    console.log(`[DB] Updated message ${messageId} status to ${status}`);
    return message;
  } catch (error) {
    console.error(`[DB] Failed to update message delivery status:`, error);
    throw error;
  }
}

/**
 * Create a bot message with delivery tracking
 * Returns the message ID for tracking
 */
export async function createBotMessageWithTracking(
  senderSsid: string,
  content: string,
  messageType: string = "text",
  metadata?: any
): Promise<string> {
  const thread = await findOrCreateThread(senderSsid);

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderSsid,
      content,
      messageType,
      isFromBot: true,
      deliveryStatus: "pending",
      attemptCount: 0,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });

  console.log(`[DB] Created bot message ${message.id} for tracking`);
  return message.id;
}

/**
 * Get failed messages for debugging
 */
export async function getFailedMessages(limit: number = 50) {
  const messages = await prisma.message.findMany({
    where: {
      isFromBot: true,
      deliveryStatus: "failed",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      sender: true,
      thread: true,
    },
  });

  return messages;
}
