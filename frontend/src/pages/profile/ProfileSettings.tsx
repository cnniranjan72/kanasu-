import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BigCard } from "@/components/BigCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-center">Settings</h2>

      <BigCard>
        <div className="space-y-6">

          <div className="flex items-center justify-between">
            <Label>Preferred Language</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={locale === "en" ? "default" : "outline"}
                onClick={() => {
                  setLocale("en");
                  toast({ title: "Language updated" });
                }}
              >
                English
              </Button>
              <Button
                size="sm"
                variant={locale === "kn" ? "default" : "outline"}
                onClick={() => {
                  setLocale("kn");
                  toast({ title: "ಭಾಷೆ ನವೀಕರಿಸಲಾಗಿದೆ" });
                }}
              >
                ಕನ್ನಡ
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Voice Guidance</Label>
            <Switch defaultChecked />
          </div>

        </div>
      </BigCard>
    </div>
  );
};

export default ProfileSettings;
