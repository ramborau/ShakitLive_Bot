"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { TemplateMessageCard } from "./template-message-card";

// CSS animation keyframes
const messageAnimationStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .message-bubble-left {
    animation: slideInLeft 0.3s ease-out;
  }

  .message-bubble-right {
    animation: slideInRight 0.3s ease-out;
  }
`;

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderSsid: string;
  messageType: string;
  isFromBot: boolean;
  sender: {
    ssid: string;
    firstName: string | null;
    lastName: string | null;
    profilePic: string | null;
  };
}

interface MessageListProps {
  messages: Message[];
}

// Group consecutive messages from the same sender
function groupMessages(messages: Message[]) {
  const groups: Message[][] = [];
  let currentGroup: Message[] = [];

  messages.forEach((message, index) => {
    if (index === 0) {
      currentGroup = [message];
    } else {
      const prevMessage = messages[index - 1];
      // Group if same sender (both bot or both user with same SSID)
      if (message.isFromBot === prevMessage.isFromBot &&
          message.senderSsid === prevMessage.senderSsid) {
        currentGroup.push(message);
      } else {
        groups.push(currentGroup);
        currentGroup = [message];
      }
    }

    // Push last group
    if (index === messages.length - 1) {
      groups.push(currentGroup);
    }
  });

  return groups;
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: messageAnimationStyles }} />
      <div className="p-4 space-y-4">
      {messageGroups.map((group, groupIndex) => {
        const firstMessage = group[0];
        const lastMessage = group[group.length - 1];
        const isBot = firstMessage.isFromBot;

        const initials =
          `${firstMessage.sender.firstName?.[0] || ""}${firstMessage.sender.lastName?.[0] || ""}`.toUpperCase() ||
          "U";

        // Bot messages on the left, user messages on the right
        if (isBot) {
          return (
            <div key={`group-${groupIndex}`} className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0 self-end">
                <AvatarImage src="/shakeit.jpg" alt="ShakeIT" />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  SI
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                {group.map((message, msgIndex) => (
                  <div key={message.id}>
                    {/* Template Message */}
                    {message.messageType === "template" && message.metadata ? (
                      <div className="message-bubble-left">
                        <TemplateMessageCard metadata={message.metadata} />
                      </div>
                    ) : (
                      /* Regular Text Message */
                      <div className="message-bubble-left bg-primary/10 border border-primary/20 rounded-lg p-3 inline-block max-w-[85%]">
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    )}

                    {/* Show timestamp and name only on last message of group */}
                    {msgIndex === group.length - 1 && (
                      <div className="flex items-baseline gap-2 mt-1 ml-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          ShakeIT
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.timestamp), "MMM d, yyyy, h:mm a")}
                        </span>
                      </div>
                    )}

                    {message.messageType !== "text" && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {message.messageType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div key={`group-${groupIndex}`} className="flex gap-3 justify-end">
              <div className="flex-1 min-w-0 flex flex-col items-end space-y-1">
                {group.map((message, msgIndex) => (
                  <div key={message.id} className="flex flex-col items-end">
                    <div className="message-bubble-right bg-blue-500 text-white rounded-lg p-3 inline-block max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>

                    {/* Show timestamp and name only on last message of group */}
                    {msgIndex === group.length - 1 && (
                      <div className="flex items-baseline gap-2 mt-1 mr-1">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.timestamp), "MMM d, yyyy, h:mm a")}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {message.sender.firstName} {message.sender.lastName}
                        </span>
                      </div>
                    )}

                    {message.messageType !== "text" && (
                      <span className="text-xs text-muted-foreground mr-2">
                        {message.messageType}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Avatar className="h-8 w-8 flex-shrink-0 self-end">
                {firstMessage.sender.profilePic && (
                  <AvatarImage
                    src={firstMessage.sender.profilePic}
                    alt={firstMessage.sender.firstName || "User"}
                  />
                )}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>
          );
        }
      })}
      </div>
    </>
  );
}
