"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/send-message";

interface MessageComposerProps {
  recipientId: string;
  threadId: string;
}

export function MessageComposer({ recipientId, threadId }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setSending(true);
    setError(null);

    try {
      const result = await sendMessage(recipientId, message.trim(), threadId);

      if (result.success) {
        setMessage("");
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !message.trim()}>
          {sending ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
