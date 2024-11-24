import { create } from "zustand";
import OpenAI from "openai";

type Message = OpenAI.Chat.ChatCompletionMessageParam;

interface ChatStore {
  messages: Message[];
  editorContent: string;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setEditorContent: (content: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, you should proxy through your backend
});

// Add new tool types
const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "insertCodeSnippet",
      description: "Insert code hint or example into the editor",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "The code to insert",
          },
        },
        required: ["code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "checkCode",
      description: "Check the code in the editor and provide feedback",
      parameters: {
        type: "object",
        properties: {
          feedback: {
            type: "string",
            description: "Feedback about the code",
          },
          score: {
            type: "number",
            description: "Score from 0-100",
          },
        },
        required: ["feedback", "score"],
      },
    },
  },
];

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  editorContent: "",
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setEditorContent: (content) => set({ editorContent: content }),

  sendMessage: async (content) => {
    set({ isLoading: true });
    const state = get();

    try {
      state.addMessage({ role: "user", content });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a coding tutor that helps students learn programming. 
            When students ask for hints, use insertCodeSnippet to provide example code.
            When students ask to check their code, use checkCode to provide feedback and a score.
            Otherwise, provide helpful explanations and guidance.`,
          },
          ...state.messages,
        ],
        tools: TOOLS,
        tool_choice: "auto",
      });

      const assistantResponse = response.choices[0].message;

      if (assistantResponse.tool_calls?.length) {
        const toolCall = assistantResponse.tool_calls[0];
        const functionArgs = JSON.parse(toolCall.function.arguments);

        // First, add the assistant message with tool calls
        state.addMessage({
          role: "assistant",
          content: assistantResponse.content,
          tool_calls: assistantResponse.tool_calls,
        });

        // Then handle the tool call and add the function response
        if (toolCall.function.name === "insertCodeSnippet") {
          state.setEditorContent(functionArgs.code);
        } else if (toolCall.function.name === "checkCode") {
          state.addMessage({
            role: "assistant",
            content: `Score: ${functionArgs.score}/100\n\n${functionArgs.feedback}`,
          });
        }

        // Add function response message
        state.addMessage({
          role: "function",
          content: JSON.stringify(functionArgs),
          name: toolCall.function.name,
          tool_call_id: toolCall.id,
        });
      } else {
        state.addMessage({
          role: "assistant",
          content: assistantResponse.content ?? "I've processed your request.",
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      state.addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
