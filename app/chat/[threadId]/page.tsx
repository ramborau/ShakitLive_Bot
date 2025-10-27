import { getThreadById } from "@/lib/db-operations";
import { notFound } from "next/navigation";
import { MessageList } from "@/components/message-list";
import { MessageComposer } from "@/components/message-composer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ChatPage(props: PageProps) {
  const params = await props.params;
  const thread = await getThreadById(params.threadId);

  if (!thread) {
    notFound();
  }

  const user = thread.participants[0]?.user;
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="hover:bg-accent p-2 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Avatar>
            {user?.profilePic && (
              <AvatarImage src={user.profilePic} alt={user.firstName || "User"} />
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
      </header>

      <div className="flex-1 overflow-y-auto">
        <MessageList messages={thread.messages} />
      </div>

      <div className="border-t p-4">
        <div className="container mx-auto max-w-4xl">
          <MessageComposer recipientId={user!.ssid} threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
