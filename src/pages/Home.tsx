import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

function Home() {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col gap-4">
      {/* Top section with editor */}
      <div className="h-[60%]">
        <Card className="h-full p-4">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Start coding here..."
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
            }}
          />
        </Card>
      </div>

      {/* Bottom section with chat */}
      <div className="h-[40%]">
        <Card className="h-full flex flex-col p-4">
          {/* Chat messages area */}
          <ScrollArea className="flex-1 mb-4 p-4 rounded-lg bg-muted">
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="font-semibold">AI Assistant</p>
                <p>
                  Hello! I'm here to help you learn coding. Try writing some
                  code in the editor above.
                </p>
              </div>

              <div className="bg-secondary/50 p-3 rounded-lg ml-4">
                <p className="font-semibold">You</p>
                <p>How do I create a function?</p>
              </div>

              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="font-semibold">AI Assistant</p>
                <p>Let me show you! Try writing this in the editor:</p>
                <pre className="bg-background/50 p-2 rounded mt-2">
                  {`function sayHello() {
    console.log("Hello, World!");
}`}
                </pre>
              </div>
            </div>
          </ScrollArea>

          {/* Chat input */}
          <div className="flex gap-2">
            <Input placeholder="Type your message here..." className="flex-1" />
            <Button>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Home;
