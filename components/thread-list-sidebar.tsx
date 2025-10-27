import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ShoppingCart, MapPin, CreditCard, Package, MessageCircle } from "lucide-react";

interface Thread {
  id: string;
  lastActivity: Date;
  lastMessage: string | null;
  currentFlow: string | null;
  flowStep: string | null;
  participants: Array<{
    user: {
      id: string;
      ssid: string;
      firstName: string | null;
      lastName: string | null;
      profilePic: string | null;
    };
  }>;
}

interface ThreadListSidebarProps {
  threads: Thread[];
  selectedThreadId?: string;
}

const getFlowIcon = (flow: string | null) => {
  if (!flow) return null;

  switch (flow.toLowerCase()) {
    case 'order':
      return ShoppingCart;
    case 'location':
      return MapPin;
    case 'supercard':
      return CreditCard;
    case 'tracking':
      return Package;
    case 'complaint':
      return MessageCircle;
    default:
      return null;
  }
};

const getFlowColor = (flowStep: string | null) => {
  // Green for completed, Red for active/in-progress
  if (flowStep === 'completed') return 'text-green-500';
  return 'text-red-500';
};

export function ThreadListSidebar({
  threads,
  selectedThreadId,
}: ThreadListSidebarProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-2">
          Waiting for messages...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground">
          CONVERSATIONS ({threads.length})
        </h2>
      </div>

      <div className="flex flex-col">
        {threads.map((thread) => {
          const user = thread.participants[0]?.user;
          const initials = user
            ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
              "U"
            : "U";

          const isSelected = thread.id === selectedThreadId;
          const FlowIcon = getFlowIcon(thread.currentFlow);
          const flowColor = getFlowColor(thread.flowStep);

          return (
            <Link
              key={thread.id}
              href={`/?threadId=${thread.id}`}
              className={cn(
                "flex items-center gap-3 p-4 border-b hover:bg-accent cursor-pointer transition-colors",
                isSelected && "bg-accent border-l-4 border-l-primary"
              )}
            >
              <Avatar className="h-12 w-12">
                {user?.profilePic && (
                  <AvatarImage
                    src={user.profilePic}
                    alt={user.firstName || "User"}
                  />
                )}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {FlowIcon && (
                      <FlowIcon className={cn("h-4 w-4", flowColor)} />
                    )}
                    <h3
                      className={cn(
                        "font-semibold truncate",
                        isSelected && "text-primary"
                      )}
                    >
                      {user?.firstName} {user?.lastName}
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(thread.lastActivity), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {thread.lastMessage || "No messages"}
                </p>
                {thread.currentFlow && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Flow: {thread.currentFlow}
                    {thread.flowStep && ` (${thread.flowStep})`}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
