// frontend/src/pages/Chat.tsx
import React, { useState, useRef, useEffect } from "react";
import { sendChat } from "@/lib/api";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<{ from: string, text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const send = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage(""); // Clear input early for UX

    setHistory(prev => [...prev, { from: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendChat(userMsg);
      setHistory(prev => [...prev, { from: "bot", text: res.reply }]);
    } catch (err: any) {
      console.error(err);
      setHistory(prev => [...prev, { from: "bot", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      send();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <p>👋 Hi! I can answer your career questions.</p>
              <p className="text-sm mt-2">Try asking "What should I do after BCA?"</p>
            </div>
          )}

          {history.map((h, i) => (
            <div key={i} className={`flex ${h.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${h.from === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
              >
                {h.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-none border flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={send} disabled={loading || !message.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

    </div>
  );
};

export default Chat;
