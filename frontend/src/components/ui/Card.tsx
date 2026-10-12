import React from 'react';
import { cn } from '@/utils/cn';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-card/70 p-6 text-card-foreground shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
