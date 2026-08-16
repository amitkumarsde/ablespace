import { Triangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// The "Pyramid" brand mark: a dark rounded square with a triangle.
export function Logo({ size = 24, withText = false, className }: { size?: number; withText?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        style={{ width: size, height: size }}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <Triangle size={size * 0.5} fill="currentColor" />
      </span>
      {withText && <span className="text-sm font-semibold">Pyramid</span>}
    </span>
  );
}
