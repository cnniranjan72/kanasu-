import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BigCard } from "@/components/BigCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-center">{t("settingsTitle")}</h2>

      <BigCard>
        <div className="space-y-6">
          {/* Language */}
          <div className="flex justify-between">
            <Label>{t("preferredLanguage")}</Label>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={locale === "en" ? "default" : "outline"}
                onClick={() => {
                  setLocale("en");
                  toast({ title: t("languageUpdated") });
                }}
              >
                English
              </Button>

              <Button
                size="sm"
                variant={locale === "kn" ? "default" : "outline"}
                onClick={() => {
                  setLocale("kn");
                  toast({ title: t("languageUpdated") });
                }}
              >
                ಕನ್ನಡ
              </Button>
            </div>
          </div>

          {/* Voice */}
          <div className="flex justify-between">
            <Label>{t("voiceGuidance")}</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </BigCard>
    </div>
  );
};

export default Settings;
