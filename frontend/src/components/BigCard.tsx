import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BigCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BigCard: React.FC<BigCardProps> = ({ children, className, onClick }) => {
  return (
    <Card
      className={cn(
        "shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};