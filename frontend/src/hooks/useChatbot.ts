import { useEffect, useState } from "react";
import { ChatMessage } from "@/components/ChatbotWidget";

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("kanasu_chat");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("kanasu_chat", JSON.stringify(messages));
  }, [messages]);

  return { messages, setMessages };
};
