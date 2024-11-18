import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

const initialMessages = [
  {
    role: "ai" as const,
    content:
      "Hello! I'm here to help you learn coding. Try writing some code in the editor above.",
  },
  {
    role: "user" as const,
    content: "How do I create a function?",
  },
  {
    role: "ai" as const,
    content: "Let me show you! Try writing this in the editor:",
    code: `function sayHello() {
    console.log("Hello, World!");
}`,
  },
];

function Home() {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col gap-4">
      {/* Top section with editor */}
      <div className="h-[60%]">
        <CodeEditor />
      </div>

      {/* Bottom section with chat */}
      <div className="h-[40%]">
        <Card className="h-full flex flex-col p-4">
          <ChatMessages messages={initialMessages} />
          <ChatInput onSend={(message) => console.log(message)} />
        </Card>
      </div>
    </div>
  );
}

export default Home;
