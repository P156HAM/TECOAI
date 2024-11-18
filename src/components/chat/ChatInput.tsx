import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  return (
    <div className="flex gap-2">
      <Input placeholder="Type your message here..." className="flex-1" />
      <Button>Send</Button>
    </div>
  );
}
