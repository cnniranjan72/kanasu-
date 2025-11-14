import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BigCard } from '@/components/BigCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { toast } = useToast();
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age.toString() || '',
    location: user?.location.city || '',
  });

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        age: parseInt(formData.age),
        location: { ...user!.location, city: formData.location },
      });

      toast({
        title: t('success'),
        description: 'Profile updated successfully',
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleLanguageChange = async (newLocale: 'en' | 'kn') => {
    setLocale(newLocale);
    await updateUser({ preferred_language: newLocale });
    toast({
      title: t('success'),
      description: 'Language preference updated',
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('profile')}</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">{t('userInfo')}</TabsTrigger>
          <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          <TabsTrigger value="app">{t('appInfo')}</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4 mt-6">
          <BigCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!editing && (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!editing}
                    className="touch-target"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">{t('age')}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    disabled={!editing}
                    className="touch-target"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={!editing}
                    className="touch-target"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="touch-target bg-muted"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="flex-1 touch-target"
                    size="lg"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {t('save')}
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="flex-1 touch-target"
                    size="lg"
                  >
                    {t('cancel')}
                  </Button>
                </div>
              )}
            </div>
          </BigCard>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <BigCard>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('preferredLanguage')}</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred language
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={locale === 'en' ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange('en')}
                        size="sm"
                      >
                        English
                      </Button>
                      <Button
                        variant={locale === 'kn' ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange('kn')}
                        size="sm"
                        className="font-kannada"
                      >
                        ಕನ್ನಡ
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-guidance">{t('voiceGuidance')}</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable voice instructions and feedback
                      </p>
                    </div>
                    <Switch
                      id="voice-guidance"
                      checked={voiceGuidance}
                      onCheckedChange={setVoiceGuidance}
                    />
                  </div>
                </div>
              </div>
            </div>
          </BigCard>

          <BigCard>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full touch-target"
              size="lg"
            >
              <LogOut className="mr-2 h-5 w-5" />
              {t('logout')}
            </Button>
          </BigCard>
        </TabsContent>

        <TabsContent value="app" className="space-y-4 mt-6">
          <BigCard>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-primary">K</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">KANASU</h3>
                  <p className="text-muted-foreground">Career Recommendation App</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-center">
                <p className="text-muted-foreground">
                  {t('version')}: 1.0.0
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  KANASU helps students discover suitable career paths using AI-powered
                  recommendations based on their interests, skills, and educational
                  background.
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  © 2024 KANASU. All rights reserved.
                </p>
              </div>
            </div>
          </BigCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;