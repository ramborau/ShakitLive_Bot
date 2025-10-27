export default function Home() {
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

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-muted-foreground"
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
          <h2 className="text-2xl font-semibold mb-2">Bot is Running</h2>
          <p className="text-muted-foreground mb-4">
            ShakitLive Facebook Messenger Bot is active and processing messages.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <p className="text-sm font-medium mb-2">Status:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Webhook endpoint active</li>
              <li>✓ Facebook integration connected</li>
              <li>✓ AI responses enabled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
