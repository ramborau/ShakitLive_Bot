import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

// Force dynamic rendering - no caching
export const revalidate = 0;
export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [userCount, threadCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.thread.count(),
      prisma.message.count(),
    ]);

    return { userCount, threadCount, messageCount };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { userCount: 0, threadCount: 0, messageCount: 0 };
  }
}

async function getRecentThreads() {
  try {
    const threads = await prisma.thread.findMany({
      take: 20,
      orderBy: { lastActivity: "desc" },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { timestamp: "desc" },
          include: {
            sender: true,
          },
        },
      },
    });

    return threads;
  } catch (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
}

export default async function Home() {
  const stats = await getStats();
  const threads = await getRecentThreads();

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4 bg-background">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">ShakitLive Bot</h1>
          <p className="text-sm text-muted-foreground">
            Facebook Messenger Bot - Active
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Users</div>
              <div className="text-3xl font-bold">{stats.userCount}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Conversations</div>
              <div className="text-3xl font-bold">{stats.threadCount}</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Messages</div>
              <div className="text-3xl font-bold">{stats.messageCount}</div>
            </div>
          </div>

          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Recent Conversations</h2>
            </div>

            {threads.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground">
                  Conversations will appear here when users message your bot
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {threads.map((thread) => {
                  const user = thread.participants[0]?.user;
                  const lastMessage = thread.messages[0];

                  return (
                    <div key={thread.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {user?.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-lg font-medium">
                                {user?.firstName?.[0] || "?"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium truncate">
                              {user?.firstName} {user?.lastName}
                            </h3>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                {formatDistanceToNow(new Date(lastMessage.timestamp), {
                                  addSuffix: true,
                                })}
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground mb-1">
                            SSID: {user?.ssid}
                          </div>

                          {lastMessage && (
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm px-2 py-0.5 rounded text-xs ${
                                  lastMessage.isFromBot
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {lastMessage.isFromBot ? "Bot" : "User"}
                              </span>
                              <p className="text-sm truncate">{lastMessage.content}</p>
                            </div>
                          )}

                          {thread.currentFlow && (
                            <div className="mt-2 text-xs">
                              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                Flow: {thread.currentFlow}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
