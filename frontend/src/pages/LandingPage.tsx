import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Map,
  Bot,
  Building2,
  Languages,
  Mic,
  Target,
  Compass,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Career Recommendation Engine",
    desc: "AI-powered predictions based on your interests, skills, and education.",
  },
  {
    icon: Map,
    title: "Career Roadmap Generator",
    desc: "A complete step-by-step career roadmap tailored just for you.",
  },
  {
    icon: Bot,
    title: "AI Chatbot",
    desc: "Instant answers to your career-related questions anytime.",
  },
  {
    icon: Building2,
    title: "Nearby Institutions Suggestions",
    desc: "Find relevant colleges and training centers near your area.",
  },
  {
    icon: Languages,
    title: "Kannada & English UI",
    desc: "Choose your preferred language for a seamless experience.",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    desc: "Speak your inputs and let the AI guide you hands-free.",
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background">

      {/* HERO SECTION */}
      <div className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/images/bg.jpg')` }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Center Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center space-y-6">

          {/* Kannada Gradient Title */}
          <h1
  className="
    text-4xl sm:text-5xl font-extrabold leading-snug
    text-white

    drop-shadow-[0_3px_6px_rgba(0,0,0,1)]
    [text-shadow:0_0_8px_rgba(0,0,0,0.9),0_0_12px_rgba(220,38,38,0.9),0_0_20px_rgba(234,179,8,0.9)]
  "
>
  ನಿನ್ನ ಕನಸು ಇಲ್ಲಿ ಆರಂಭವಾಗುತ್ತದೆ
</h1>



          {/* PRIMARY CTA BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
            <Button
              size="lg"
              className="px-6 py-4 text-base font-semibold shadow-xl bg-primary hover:bg-primary"
              onClick={() => navigate("/career-recommender")}
            >
              <Target className="h-5 w-5 mr-2" />
              🎯 Get Career Recommendation
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-4 text-base font-semibold shadow-xl border-2 hover:bg-accent"
              onClick={() => navigate("/roadmap")}
            >
              <Compass className="h-5 w-5 mr-2" />
              🧭 View Career Roadmap
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-4 text-base font-semibold shadow-xl border-2 hover:bg-accent"
              onClick={() => navigate("/institutions")}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              🏫 Find Nearby Institutes
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-6 py-4 text-base font-semibold shadow-xl border-2 hover:bg-accent"
              onClick={() => navigate("/chat")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              💬 Ask Career Chatbot
            </Button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="relative bg-background py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Key Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="
                  p-6 rounded-2xl border bg-card shadow-md 
                  hover:shadow-lg hover:border-primary cursor-pointer
                "
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                </div>

                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative mt-16 bg-card py-14 px-6 border-t border-primary/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">

          {/* APP TITLE */}
          <div>
            <h3 className="text-3xl font-bold">KANASU</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Empowering students with AI-driven career guidance.
            </p>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            KANASU helps students discover the right career using Artificial Intelligence,
            education analysis, interest matching, and bilingual support in Kannada & English.
            Designed with love by Team Vyoma❤️
          </p>

          <div className="inline-flex items-center gap-2 mt-4 py-2 px-4 rounded-full border border-primary/40 bg-primary/5 text-sm font-medium">
            🇮🇳 Made in Karnataka
          </div>

          <p className="text-xs text-muted-foreground mt-6 border-t pt-4">
            © {new Date().getFullYear()} KANASU. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
