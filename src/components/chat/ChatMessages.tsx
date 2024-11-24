import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "ai" | "user";
  content: string;
  code?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 mb-4 p-4 rounded-lg bg-muted">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === "ai" ? "bg-primary/10" : "bg-secondary/50 ml-4"
            } p-3 rounded-lg`}
          >
            <p className="font-semibold">
              {message.role === "ai" ? "AI Assistant" : "You"}
            </p>
            <p>{message.content}</p>
            {message.code && (
              <pre className="bg-background/50 p-2 rounded mt-2">
                {message.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
