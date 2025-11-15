import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Home,
  Landmark,
  User,
  Settings as SettingsIcon,
  Compass,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

import ChatbotWidget from "@/components/ChatbotWidget";
import { useChatbot } from "@/hooks/useChatbot";

import { VoiceMic } from "@/components/VoiceMic";
import { useVoice } from "@/hooks/useVoice";
import { useToast } from "@/hooks/use-toast";

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const { messages, setMessages } = useChatbot();

  // Detect if Kannada was spoken
  const detectLanguage = (text: string): "en" | "kn" => {
    const hasKannada = /[\u0C80-\u0CFF]/.test(text);
    return hasKannada ? "kn" : "en";
  };

  // Speak in user's spoken language
  const go = (path: string, lang: "en" | "kn", msgEN: string, msgKN: string) => {
    navigate(path);
    speak(lang === "kn" ? msgKN : msgEN);
  };

  // VOICE COMMAND HANDLER
  const handleVoiceCommand = (text: string) => {
    const cmd = text.toLowerCase().trim();
    const lang = detectLanguage(text);

    console.log("VOICE:", cmd, "LANG:", lang);

    // English Commands
    if (cmd.includes("home"))
      return go("/home", lang, "Opening Home", "ಮುಖಪುಟಕ್ಕೆ ತೆರಳುತ್ತೇನೆ");

    if (cmd.includes("career"))
      return go(
        "/career-recommender",
        lang,
        "Opening Career Recommender",
        "ವೃತ್ತಿ ಶಿಫಾರಸು ತೆರೆಯಲಾಗುತ್ತಿದೆ"
      );

    if (cmd.includes("roadmap"))
      return go("/roadmap", lang, "Opening Roadmap", "ರೋಡ್‌ಮ್ಯಾಪ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    if (cmd.includes("scholar"))
      return go(
        "/scholarships",
        lang,
        "Opening Scholarships",
        "ವಿದ್ಯಾರ್ಥಿವೇತನ ತೆರೆಯಲಾಗುತ್ತಿದೆ"
      );

    if (cmd.includes("profile"))
      return go("/profile", lang, "Opening Profile", "ಪ್ರೊಫೈಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    if (cmd.includes("settings"))
      return go("/settings", lang, "Opening Settings", "ಸೆಟ್ಟಿಂಗ್ಸ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    // Kannada Commands
    if (cmd.includes("ಮುಖಪುಟ") || cmd.includes("ಹೋಮ್"))
      return go("/home", lang, "Opening Home", "ಮುಖಪುಟಕ್ಕೆ ತೆರಳುತ್ತೇನೆ");

    if (cmd.includes("ಶಿಫಾರಸು") || cmd.includes("ಕರಿಯರ್"))
      return go(
        "/career-recommender",
        lang,
        "Opening Career Recommender",
        "ವೃತ್ತಿ ಶಿಫಾರಸು ತೆರೆಯಲಾಗುತ್ತಿದೆ"
      );

    if (cmd.includes("ರೋಡ್") || cmd.includes("ರೋಡ್ಮ್ಯಾಪ್"))
      return go("/roadmap", lang, "Opening Roadmap", "ರೋಡ್‌ಮ್ಯಾಪ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    if (cmd.includes("ವಿದ್ಯಾರ್ಥಿವೇತನ") || cmd.includes("ಸ್ಕಾಲರ್"))
      return go(
        "/scholarships",
        lang,
        "Opening Scholarships",
        "ವಿದ್ಯಾರ್ಥಿವೇತನ ತೆರೆಯಲಾಗುತ್ತಿದೆ"
      );

    if (cmd.includes("ಪ್ರೊಫೈಲ್"))
      return go("/profile", lang, "Opening Profile", "ಪ್ರೊಫೈಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    if (cmd.includes("ಸೆಟ್ಟಿಂಗ್ಸ್") || cmd.includes("ಸಂಯೋಜನೆ"))
      return go("/settings", lang, "Opening Settings", "ಸೆಟ್ಟಿಂಗ್ಸ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ");

    // Unknown
    const e = lang === "kn" ? "ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ." : "Sorry, I didn’t understand.";
    speak(e);

    toast({
      title: lang === "kn" ? "ಕ್ಷಮಿಸಿ" : "Not recognized",
      description: e,
      variant: "destructive",
    });
  };

  // ⭐ LOCALIZED SIDEBAR ITEMS
  const menuItems = [
    { path: "/home", label: t("home"), icon: Home },
    { path: "/career-recommender", label: t("careerRecommender"), icon: Compass },
    { path: "/scholarships", label: t("scholarships"), icon: Landmark },
    { path: "/profile", label: t("profile"), icon: User },
    { path: "/settings", label: t("settings"), icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">

          {/* SIDEBAR */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Menu className="h-7 w-7 text-primary" />
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">KANASU</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg w-full",
                        active ? "bg-primary/10 text-primary" : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* TITLE */}
          <h1
            onClick={() => navigate("/home")}
            className="font-kannada absolute left-1/2 -translate-x-1/2 text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent cursor-pointer"
          >
            ಕನಸು
          </h1>

          <LanguageToggle />
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* MIC */}
      <div className="fixed bottom-20 right-6 z-50">
        <VoiceMic onTranscript={handleVoiceCommand} />
      </div>

      {/* CHATBOT */}
      <ChatbotWidget
        initialMessages={messages}
        onMessagesChange={setMessages}
      />
    </div>
  );
};
