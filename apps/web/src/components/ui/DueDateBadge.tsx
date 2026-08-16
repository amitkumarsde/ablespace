import { CalendarDays } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Pink calendar pill used on board cards.
export function DueDateBadge({ date, withYear = false }: { date?: string | null; withYear?: boolean }) {
  if (!date) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
      <CalendarDays size={12} />
      {formatDate(date, withYear)}
    </span>
  );
}
