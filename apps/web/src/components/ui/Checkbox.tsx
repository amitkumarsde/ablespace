import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      className={cn(
        'flex h-4 w-4 items-center justify-center rounded border transition-colors',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card',
      )}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  );
}
