import { Priority } from '@/lib/types';
import { PRIORITY_META } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Bar icon; the filled count and color show the priority.
function PriorityIcon({ priority, size = 14 }: { priority: Priority; size?: number }) {
  const { bars, color } = PRIORITY_META[priority];
  const heights = [5, 8, 11]; // three bars, out of 12
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className="shrink-0" aria-hidden>
      {heights.map((h, i) => {
        const filled = i < bars;
        return (
          <rect
            key={i}
            x={i * 4 + 0.5}
            y={12 - h}
            width={3}
            height={h}
            rx={1}
            fill={filled ? color : 'currentColor'}
            opacity={filled ? 1 : 0.25}
          />
        );
      })}
    </svg>
  );
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const { color } = PRIORITY_META[priority];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}
      style={{ color }}
    >
      <PriorityIcon priority={priority} />
      {priority}
    </span>
  );
}
