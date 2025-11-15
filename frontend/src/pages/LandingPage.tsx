import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain,
  Map,
  Bot,
  Building2,
  Languages,
  Mic,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    { icon: Brain, title: t("careerRecFeature"), desc: t("careerRecFeatureDesc") },
    { icon: Map, title: t("roadmapFeature"), desc: t("roadmapFeatureDesc") },
    { icon: Bot, title: t("chatbotFeature"), desc: t("chatbotFeatureDesc") },
    { icon: Building2, title: t("institutionsFeature"), desc: t("institutionsFeatureDesc") },
    { icon: Languages, title: t("uiFeature"), desc: t("uiFeatureDesc") },
    { icon: Mic, title: t("voiceFeature"), desc: t("voiceFeatureDesc") },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background">

      {/* HERO */}
      <div className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/images/bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            {t("dreamStartsHere")}
          </h1>

          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold shadow-xl bg-primary"
            onClick={() => navigate("/career-recommender")}
          >
            {t("careerRecommender")}
          </Button>
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          {t("keyFeatures")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border bg-card shadow-md hover:shadow-lg hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-10 w-10 text-primary" />
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                </div>

                <p className="text-muted-foreground text-sm mt-3">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card py-14 px-6 border-t border-primary/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">KANASU</h3>
          <p className="text-muted-foreground">{t("appFooterDesc")}</p>

          <div className="inline-flex items-center gap-2 mt-4 py-2 px-4 rounded-full border border-primary/40 bg-primary/5">
            🇮🇳 {t("madeInKarnataka")}
          </div>

          <p className="text-xs text-muted-foreground mt-6 border-t pt-4">
            © {new Date().getFullYear()} KANASU. {t("allRightsReserved")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
