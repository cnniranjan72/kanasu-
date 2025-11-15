import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { mockGeminiReply } from "@/lib/geminiMock";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWidgetProps {
  initialMessages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  initialMessages,
  onMessagesChange,
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
  const [input, setInput] = useState("");

  // Keep parent state synced
  useEffect(() => {
    onMessagesChange(messages);
  }, [messages, onMessagesChange]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const replyText = await mockGeminiReply(input);

    const botMessage: ChatMessage = {
      role: "assistant",
      content: replyText,
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-card border shadow-xl rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <span className="font-bold">KANASU AI</span>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-96">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary/10 text-primary self-end"
                    : "bg-accent text-foreground"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-primary text-white px-3 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
