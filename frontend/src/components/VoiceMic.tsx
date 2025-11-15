import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/useVoice';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface VoiceMicProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceMic: React.FC<VoiceMicProps> = ({ onTranscript, className }) => {
  const { isListening, startListening, stopListening, isSupported } = useVoice();
  const { t } = useLanguage();

  const handleClick = () => {
    if (isListening) stopListening();
    else startListening(onTranscript);
  };

  if (!isSupported) return null;

  return (
    <Button
      onClick={handleClick}
      size="icon"
      variant={isListening ? "destructive" : "secondary"}
      className={cn(
        "rounded-full shadow-xl h-14 w-14 flex items-center justify-center",
        isListening && "animate-pulse scale-110",
        className
      )}
      aria-label={isListening ? t('listening') : t('tapToSpeak')}
    >
      {isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
};
