import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { formatDistanceToNow } from "date-fns";

interface Thread {
  id: string;
  lastActivity: Date;
  lastMessage: string | null;
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
    content: string;
    timestamp: Date;
    sender: {
      firstName: string | null;
      lastName: string | null;
    };
  }>;
}

interface ThreadListProps {
  threads: Thread[];
}

export function ThreadList({ threads }: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-lg text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Messages will appear here when users contact you
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {threads.map((thread) => {
        const user = thread.participants[0]?.user;
        const initials = user
          ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
            "U"
          : "U";

        return (
          <Link key={thread.id} href={`/chat/${thread.id}`}>
            <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Avatar>
                  {user?.profilePic && (
                    <AvatarImage src={user.profilePic} alt={user.firstName || "User"} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(thread.lastActivity), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {thread.lastMessage || "No messages"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
