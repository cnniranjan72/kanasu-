import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BigCard } from "@/components/BigCard";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save } from "lucide-react";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { toast } = useToast();
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    location: user?.location.city || "",
  });

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        age: parseInt(formData.age),
        location: { ...user!.location, city: formData.location },
      });

      toast({
        title: t("success"),
        description: t("profile") + " updated",
      });
      setEditing(false);
    } catch {
      toast({
        title: t("error"),
        description: "Failed to update",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = async (newLocale: "en" | "kn") => {
    setLocale(newLocale);
    await updateUser({ preferred_language: newLocale });
    toast({ title: t("languageUpdated") });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("profile")}</h2>
        <p className="text-muted-foreground">{t("manageYourAccount")}</p>
      </div>

      <Tabs defaultValue="user">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="user">{t("userInfo")}</TabsTrigger>
          <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
          <TabsTrigger value="app">{t("appInfo")}</TabsTrigger>
        </TabsList>

        {/* User Info */}
        <TabsContent value="user" className="mt-6 space-y-4">
          <BigCard>
            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{t("personalInformation")}</h3>
                {!editing && (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    {t("edit")}
                  </Button>
                )}
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <Label>{t("name")}</Label>
                  <Input
                    value={formData.name}
                    disabled={!editing}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>{t("age")}</Label>
                  <Input
                    type="number"
                    disabled={!editing}
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>{t("location")}</Label>
                  <Input
                    disabled={!editing}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>{t("email")}</Label>
                  <Input disabled value={user?.email} className="bg-muted" />
                </div>
              </div>

              {editing && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("save")}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditing(false)}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </div>
          </BigCard>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-6 space-y-4">
          <BigCard>
            <div className="space-y-4">
              {/* Language */}
              <div className="flex justify-between">
                <Label>{t("preferredLanguage")}</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={locale === "en" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("en")}
                  >
                    English
                  </Button>
                  <Button
                    size="sm"
                    variant={locale === "kn" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("kn")}
                  >
                    ಕನ್ನಡ
                  </Button>
                </div>
              </div>

              {/* Voice */}
              <div className="flex justify-between">
                <Label>{t("voiceGuidance")}</Label>
                <Switch
                  checked={voiceGuidance}
                  onCheckedChange={setVoiceGuidance}
                />
              </div>
            </div>
          </BigCard>

          <BigCard>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </BigCard>
        </TabsContent>

        {/* App Info */}
        <TabsContent value="app" className="mt-6">
          <BigCard>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">KANASU</h3>
              <p className="text-muted-foreground">Career Recommendation App</p>

              <p>{t("version")}: 1.0.0</p>
            </div>
          </BigCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
