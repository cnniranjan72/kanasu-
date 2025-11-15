import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Home,
  Landmark,
  User,
  Settings,
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

// ⭐ NEW IMPORTS FOR CHATBOT
import ChatbotWidget from "@/components/ChatbotWidget";
import { useChatbot } from "@/hooks/useChatbot";

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);

  // ⭐ CHATBOT STATE
  const { messages, setMessages } = useChatbot();

  const menuItems = [
    { path: "/home", label: t("home"), icon: Home },
    { path: "/career-recommender", label: "Career Recommender", icon: Compass },
    { path: "/scholarships", label: t("scholarships"), icon: Landmark },
    { path: "/profile/user", label: "Profile", icon: User },
    { path: "/profile/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">

          {/* Hamburger Menu */}
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
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        // Do NOT close sidebar (as you requested)
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg w-full text-left text-sm",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* CENTER TITLE — KANNADA TITLE */}
          <h1
            onClick={() => navigate("/home")}
            className="
              font-kannada
              absolute left-1/2 -translate-x-1/2
              cursor-pointer select-none
              text-3xl font-extrabold
              bg-gradient-to-r from-yellow-400 to-red-600
              bg-clip-text text-transparent
              transition-all duration-200
              hover:scale-110 hover:opacity-90
              active:scale-90
            "
          >
            ಕನಸು
          </h1>

          {/* Language Toggle */}
          <LanguageToggle />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* ⭐ CHATBOT FLOATING WIDGET */}
      <ChatbotWidget
        initialMessages={messages}
        onMessagesChange={setMessages}
      />
    </div>
  );
};
