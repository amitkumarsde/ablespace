'use client';

import { Check, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { key: 'light' as const, label: 'Light', icon: Sun },
  { key: 'dark' as const, label: 'Dark', icon: Moon },
];

export default function ThemePage() {
  const { mode, setMode } = useTheme();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Theme</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Choose how the app looks.</p>

      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const active = mode === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setMode(o.key)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-6 transition-colors',
                active ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:bg-muted',
              )}
            >
              <Icon size={22} />
              <span className="text-sm font-medium">{o.label}</span>
              {active && <Check size={15} className="text-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
