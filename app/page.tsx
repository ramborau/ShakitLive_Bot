import { getAllThreads, getThreadById } from "@/lib/db-operations";
import { ThreadListSidebar } from "@/components/thread-list-sidebar";
import { ChatView } from "@/components/chat-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HomeProps {
  searchParams: Promise<{ threadId?: string }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;

  let threads: any[] = [];
  let selectedThread: any = null;

  try {
    threads = await getAllThreads();

    // Get the first thread by default, or the selected one
    const selectedThreadId = searchParams.threadId || threads[0]?.id;
    selectedThread = selectedThreadId
      ? await getThreadById(selectedThreadId)
      : null;
  } catch (error) {
    console.error("Database error:", error);
    // Continue with empty threads array
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4 bg-background">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">ShakitLive Bot</h1>
          <p className="text-sm text-muted-foreground">
            Facebook Messenger Conversations
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Thread List */}
        <div className="w-80 border-r bg-background overflow-y-auto">
          <ThreadListSidebar
            threads={threads}
            selectedThreadId={selectedThreadId}
          />
        </div>

        {/* Right Pane - Chat View */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <ChatView thread={selectedThread} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Messages will appear here when users contact you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
