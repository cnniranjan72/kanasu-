import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BigCard } from '@/components/BigCard';
import { CareerCard } from '@/components/CareerCard';
import { VoiceMic } from '@/components/VoiceMic';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';
import { predictCareers, CareerRecommendation } from '@/lib/api';
import { Loader2, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { speak } = useVoice();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [formData, setFormData] = useState({
    education: '',
    stream_code: '',
    interests: '',
    skills: '',
  });

  const educationLevels = [
    { value: 'sslc', label: t('sslc') },
    { value: 'puc', label: t('puc') },
    { value: 'iti', label: t('iti') },
    { value: 'ug', label: t('ug') },
    { value: 'pg', label: t('pg') },
    { value: 'phd', label: t('phd') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interests = formData.interests.split(',').map((i) => i.trim()).filter(Boolean);
      const skills = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);

      const response = await predictCareers({
        age: user?.age || 18,
        education: formData.education,
        stream_code: formData.stream_code,
        interests,
        skills,
        location: user?.location || { lat: 12.9716, lng: 77.5946 },
      });

      setRecommendations(response.recommendations);
      
      toast({
        title: t('success'),
        description: `Found ${response.recommendations.length} career matches!`,
      });

      // Speak first recommendation
      if (response.recommendations.length > 0) {
        speak(`Top match: ${response.recommendations[0].title_label}`);
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to get recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoadmap = (career: CareerRecommendation) => {
    navigate('/roadmap', {
      state: {
        careers: [career],
        formData: {
          ...formData,
          age: user?.age,
          location: user?.location,
        },
      },
    });
  };

  const handleGenerateFullRoadmap = () => {
    navigate('/roadmap', {
      state: {
        careers: recommendations,
        formData: {
          ...formData,
          age: user?.age,
          location: user?.location,
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {t('home')}
        </h2>
        <p className="text-muted-foreground">
          Tell us about yourself to get personalized career recommendations
        </p>
      </div>

      <BigCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education">{t('education')}</Label>
              <Select
                value={formData.education}
                onValueChange={(value) =>
                  setFormData({ ...formData, education: value })
                }
                required
              >
                <SelectTrigger id="education" className="touch-target">
                  <SelectValue placeholder={t('education')} />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stream">{t('stream')}</Label>
              <Input
                id="stream"
                value={formData.stream_code}
                onChange={(e) =>
                  setFormData({ ...formData, stream_code: e.target.value })
                }
                placeholder="e.g., PCMB, Commerce, Arts"
                required
                className="touch-target"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="interests">{t('interests')}</Label>
              <VoiceMic
                onTranscript={(text) =>
                  setFormData({ ...formData, interests: text })
                }
              />
            </div>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
              placeholder={t('enterInterests')}
              className="touch-target"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple interests with commas
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skills">{t('skills')}</Label>
              <VoiceMic
                onTranscript={(text) =>
                  setFormData({ ...formData, skills: text })
                }
              />
            </div>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              placeholder={t('enterSkills')}
              className="touch-target"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas
            </p>
          </div>

          <Button
            type="submit"
            className="w-full touch-target"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {t('getRecommendations')}
              </>
            )}
          </Button>
        </form>
      </BigCard>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center">{t('topCareerMatches')}</h3>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {recommendations.slice(0, 3).map((career, index) => (
              <CareerCard
                key={index}
                career={career}
                onViewRoadmap={() => handleViewRoadmap(career)}
                onShowInfo={() => {
                  speak(
                    `${career.title_label}. ${career.cluster_label}. ${Math.round(career.probability * 100)} percent match.`
                  );
                  toast({
                    title: career.title_label,
                    description: career.cluster_label,
                  });
                }}
              />
            ))}
          </div>

          <Button
            onClick={handleGenerateFullRoadmap}
            variant="secondary"
            className="w-full touch-target"
            size="lg"
          >
            {t('generateFullRoadmap')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;