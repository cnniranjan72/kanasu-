import React from 'react';
import { Button } from '@/components/ui/button';
import { BigCard } from './BigCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { CareerRecommendation } from '@/lib/api';
import { ChevronRight, Info } from 'lucide-react';

interface CareerCardProps {
  career: CareerRecommendation;
  onViewRoadmap: () => void;
  onShowInfo: () => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onViewRoadmap,
  onShowInfo,
}) => {
  const { t } = useLanguage();

  return (
    <BigCard className="min-w-[280px] flex-shrink-0">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {career.title_label}
            </h3>
            <p className="text-sm text-muted-foreground">{career.cluster_label}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo();
            }}
            className="shrink-0"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('confidence')}</span>
            <span className="text-2xl font-bold text-primary">
              {Math.round(career.probability * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${career.probability * 100}%` }}
            />
          </div>
        </div>

        <Button
          onClick={onViewRoadmap}
          className="w-full touch-target"
          size="lg"
        >
          {t('viewRoadmap')}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </BigCard>
  );
};