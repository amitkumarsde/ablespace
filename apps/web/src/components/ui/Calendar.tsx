'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Simple month calendar; returns a YYYY-MM-DD string.
export function Calendar({
  value,
  onSelect,
}: {
  value?: string | null;
  onSelect: (date: string) => void;
}) {
  const selected = value ? new Date(value) : null;
  const [cursor, setCursor] = useState(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

  const pick = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onSelect(`${year}-${mm}-${dd}`);
  };

  return (
    <div className="w-64 p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="rounded p-1 hover:bg-muted"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="rounded p-1 hover:bg-muted"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-muted-foreground">
            {w}
          </div>
        ))}
        {cells.map((day, i) =>
          day ? (
            <button
              key={i}
              onClick={() => pick(day)}
              className={cn(
                'rounded-md py-1 text-sm hover:bg-muted',
                isSelected(day)
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'text-foreground',
              )}
            >
              {day}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}
