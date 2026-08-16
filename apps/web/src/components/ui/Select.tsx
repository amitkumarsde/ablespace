import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Native select styled to match the design.
export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
