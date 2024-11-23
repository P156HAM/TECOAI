import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useState, useEffect } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { ProgrammingLanguage } from "@/types/types";

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
  const programmingLanguage = languageParam as ProgrammingLanguage;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const nodeId = params.get("nodeId");
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
    const params = new URLSearchParams(window.location.search);
    const nodeId = params.get("nodeId");

    try {
      const llm = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0,
        openAIApiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
      });

      const response = await llm.invoke([
        {
          role: "system",
          content: `You are a coding tutor. You are currently helping with practice exercises${
            nodeId ? ` for node ${nodeId}` : ""
          }.
          IMPORTANT GUIDELINES:
          - Do NOT provide code examples in the chat
          - Use the code editor to provide practice problems and hints
          - Keep chat messages focused on instructions and feedback
          - Initial message should welcome the user and direct them to use the code editor
          - If the user asks for help or a hint, respond with a JSON function call in this format:
            {"name": "insertCodeSnippet", "arguments": {"code": "// Your code or hint here"}}
          - To read current code, respond with:
            {"name": "getCode", "arguments": {}}`,
        },
        ...messages.map((msg) => ({
          role: msg.role === "ai" ? "assistant" : msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ]);

      // Parse potential function calls from AI response
      const responseContent =
        typeof response.content === "string" ? response.content : "";
      console.log("AI response:", responseContent);

      try {
        const functionCall = JSON.parse(responseContent) as AIFunctionCall;
        if (
          functionCall.name === "insertCodeSnippet" &&
          functionCall.arguments.code
        ) {
          insertCodeSnippet(functionCall.arguments.code);
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: "I've added some code to the editor for you.",
            },
          ]);
        } else if (functionCall.name === "getCode") {
          const currentCode = getCode();
          // Handle getCode response
        }
      } catch (e) {
        // Not a function call, treat as normal message
        setMessages((prev) => [
          ...prev,
          { role: "user", content: message },
          {
            role: "ai",
            content: responseContent,
          },
        ]);
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
          language={programmingLanguage}
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
