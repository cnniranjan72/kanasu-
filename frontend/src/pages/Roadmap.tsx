import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BigCard } from '@/components/BigCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/hooks/useVoice';
import { useToast } from '@/hooks/use-toast';
import { generateRoadmap, RoadmapResponse, CareerRecommendation } from '@/lib/api';
import { Loader2, MapPin, Volume2, ArrowLeft } from 'lucide-react';

interface LocationState {
  careers: CareerRecommendation[];
  formData: any;
}

const Roadmap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { speak, stopSpeaking } = useVoice();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null);

  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.careers || state.careers.length === 0) {
      navigate('/home');
      return;
    }

    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    if (!state?.careers) return;

    setLoading(true);
    try {
      const response = await generateRoadmap({
        titles: state.careers.map((c) => c.title_code),
        user_profile: state.formData,
        locale,
      });

      setRoadmapData(response);
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to generate roadmap',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReadStep = (text: string) => {
    speak(text);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return null;
  }

  const terms = [
    { key: 'shortTerm', label: t('shortTerm'), data: roadmapData.steps[0] },
    { key: 'mediumTerm', label: t('mediumTerm'), data: roadmapData.steps[1] },
    { key: 'longTerm', label: t('longTerm'), data: roadmapData.steps[2] },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
          className="touch-target"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{t('roadmap')}</h2>
          <p className="text-sm text-muted-foreground">
            {state.careers.map((c) => c.title_label).join(', ')}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => speak(roadmapData.roadmap_text)}
          className="touch-target"
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      <BigCard>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {roadmapData.roadmap_text}
          </p>
        </div>
      </BigCard>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <BigCard key={term.key}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold">{term.label}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReadStep(term.data?.tasks?.join('. ') || '')}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {term.data && (
                <div className="space-y-3 ml-13">
                  {term.data.tasks && term.data.tasks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Tasks:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {term.data.tasks.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {term.data.courses && term.data.courses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Courses:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {term.data.courses.map((course, i) => (
                          <li key={i}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {term.data.colleges && term.data.colleges.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Colleges:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {term.data.colleges.map((college, i) => (
                          <li key={i}>{college}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </BigCard>
        ))}
      </div>

      {roadmapData.nearby_institutions && roadmapData.nearby_institutions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{t('nearbyInstitutions')}</h3>
          <div className="grid gap-4">
            {roadmapData.nearby_institutions.map((inst, index) => (
              <BigCard key={index}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{inst.name}</h4>
                    <p className="text-sm text-muted-foreground">{inst.address}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${inst.lat},${inst.lng}`,
                        '_blank'
                      );
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('openInMaps')}
                  </Button>
                </div>
              </BigCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;