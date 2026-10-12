import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className,
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-primary/20 animate-ping absolute inset-0',
            sizeMap[size]
          )}
        />
        <div
          className={cn(
            'rounded-full border-primary border-t-transparent animate-spin',
            sizeMap[size]
          )}
        />
      </div>
      {message && (
        <p className="text-xs font-medium text-muted-foreground animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};
