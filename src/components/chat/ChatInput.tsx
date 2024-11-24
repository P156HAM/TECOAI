import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  return (
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1"
      />
      <Button
        onClick={() => {
          onSend(input);
          setInput("");
        }}
      >
        Send
      </Button>
    </div>
  );
}
