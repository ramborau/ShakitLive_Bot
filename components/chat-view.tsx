import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";
import { ChatAnalyticsDrawer } from "./chat-analytics-drawer";
import { OrderCartSummary } from "./order-cart-summary";

interface ChatViewProps {
  thread: {
    id: string;
    currentFlow: string | null;
    flowStep: string | null;
    flowData: string | null;
    intent: string | null;
    language: string;
    needsHuman: boolean;
    lastActivity: Date;
    participants: Array<{
      user: {
        id: string;
        ssid: string;
        firstName: string | null;
        lastName: string | null;
        profilePic: string | null;
      };
    }>;
    messages: Array<{
      id: string;
      content: string;
      timestamp: Date;
      senderSsid: string;
      messageType: string;
      isFromBot: boolean;
      metadata: string | null;
      sender: {
        ssid: string;
        firstName: string | null;
        lastName: string | null;
        profilePic: string | null;
      };
    }>;
  };
}

export function ChatView({ thread }: ChatViewProps) {
  const user = thread.participants[0]?.user;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user?.profilePic && (
                <AvatarImage
                  src={user.profilePic}
                  alt={user.firstName || "User"}
                />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-xs text-muted-foreground">{user?.ssid}</p>
            </div>
          </div>

          {/* Analytics Drawer */}
          <ChatAnalyticsDrawer threadId={thread.id} thread={thread} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-muted/20">
        <MessageList messages={thread.messages} />
      </div>

      {/* Order Cart Summary - Shows if active order flow */}
      {thread.currentFlow === 'order' && thread.flowData && (
        <div className="border-t px-4 pt-3 bg-background">
          <OrderCartSummary flowData={thread.flowData} />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t p-4 bg-background">
        <MessageComposer recipientId={user!.ssid} threadId={thread.id} />
      </div>
    </div>
  );
}
