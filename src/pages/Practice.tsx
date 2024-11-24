import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useState, useEffect } from "react";
import { ChatOpenAI } from "@langchain/openai";

type ChatMessage = {
  role: "user" | "assistant" | "ai";
  content: string;
  code?: string;
};

interface AIFunctionCall {
  name: string;
  arguments: {
    code?: string;
  };
}

export default function Practice() {
  const params = new URLSearchParams(window.location.search);
  const languageParam = params.get("language") || "javascript";
  const programmingLanguage = languageParam;
  const nodeId = params.get("nodeId");

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const prompt = params.get("prompt");

    return [
      {
        role: "assistant",
        content:
          prompt ||
          "Hello! I'm here to help you practice coding. What would you like to work on?",
      },
    ];
  });
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) {
      handleSendMessage(prompt);
    }
  }, []);

  const insertCodeSnippet = (code: string) => {
    setEditorContent(code);
  };

  useEffect(() => {
    console.log("Editor content updated:", editorContent);
  }, [editorContent]);

  const getCode = () => {
    return editorContent;
  };

  const handleSendMessage = async (message: string) => {
    try {
      const llm = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0,
        openAIApiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      });

      const systemPrompt = `You are a coding tutor. You are currently helping with practice exercises${
        nodeId ? ` for node ${nodeId}` : ""
      }.
      IMPORTANT GUIDELINES:
      - ALWAYS use function calls for code examples
      - To provide code examples or hints, use:
        {"name": "insertCodeSnippet", "arguments": {"code": "// Your code here"}}
      - To read current code, use:
        {"name": "getCode", "arguments": {}}
      - Keep chat messages focused on explanations and feedback
      - Never include code blocks directly in chat messages
      - If you need to reference code, use the insertCodeSnippet function`;

      const response = await llm.invoke([
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ]);

      const responseContent =
        typeof response.content === "string" ? response.content : "";

      const codeBlockRegex = /```[\s\S]*?```/g;
      const hasCodeBlock = codeBlockRegex.test(responseContent);

      if (hasCodeBlock) {
        const extractedCode =
          responseContent.match(/```(?:\w+\n)?([^`]+)```/)?.[1]?.trim() || "";

        insertCodeSnippet(extractedCode);

        const cleanMessage =
          responseContent.replace(codeBlockRegex, "").trim() +
          "\n\nI've added this code to the editor for you.";

        setMessages((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "ai", content: cleanMessage },
        ]);
      } else {
        try {
          const functionCall = JSON.parse(
            responseContent.replace(/`/g, "")
          ) as AIFunctionCall;
          if (
            functionCall.name === "insertCodeSnippet" &&
            functionCall.arguments.code
          ) {
            insertCodeSnippet(functionCall.arguments.code);
            setMessages((prev) => [
              ...prev,
              { role: "user", content: message },
              {
                role: "ai",
                content: "I've added some code to the editor for you.",
              },
            ]);
          } else if (functionCall.name === "getCode") {
            const currentCode = getCode();
            const codeResponse = await llm.invoke([
              { role: "system", content: systemPrompt },
              ...messages.map((msg) => ({
                role: msg.role === "ai" ? "assistant" : msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: `Here's my current code:\n\n${currentCode}\n\n${message}`,
              },
            ]);

            setMessages((prev) => [
              ...prev,
              { role: "user", content: message },
              { role: "ai", content: codeResponse.content as string },
            ]);
          }
        } catch (e) {
          setMessages((prev) => [
            ...prev,
            { role: "user", content: message },
            { role: "ai", content: responseContent },
          ]);
        }
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col gap-4">
      <div className="h-[60%]">
        <CodeEditor
          content={editorContent}
          onChange={(value) => setEditorContent(value)}
          language={"java"}
        />
      </div>
      <div className="h-[40%]">
        <Card className="h-full flex flex-col p-4">
          <ChatMessages
            messages={messages.map((msg) => ({
              ...msg,
              role: msg.role === "assistant" ? "ai" : msg.role,
            }))}
          />
          <ChatInput onSend={handleSendMessage} />
        </Card>
      </div>
    </div>
  );
}
