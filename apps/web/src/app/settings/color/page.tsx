'use client';

import { Check } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { ACCENTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function ColorPage() {
  const { accent, setAccent } = useTheme();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Color</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Pick an accent color for the app.</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACCENTS.map((a) => {
          const active = accent === a.key;
          return (
            <button
              key={a.key}
              onClick={() => setAccent(a.key)}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 transition-colors',
                active ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:bg-muted',
              )}
            >
              <span
                className={cn('h-6 w-6 rounded-md', a.key === 'black' && 'border border-border')}
                style={{ backgroundColor: a.color }}
              />
              <span className="text-sm font-medium">{a.label}</span>
              {active && <Check size={15} className="ml-auto text-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
