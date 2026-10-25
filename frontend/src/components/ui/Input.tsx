import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full space-y-1.5 text-left', containerClassName)}>
        {label && (
          <label className={cn('text-xs font-semibold text-muted-foreground uppercase tracking-wider block', labelClassName)}>
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 backdrop-blur-sm',
            error && 'border-destructive focus:ring-destructive/40',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
