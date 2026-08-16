'use client';

import { useState } from 'react';
import { Check, Filter } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { PRIORITIES } from '@/lib/constants';
import { Priority } from '@/lib/types';
import { cn } from '@/lib/utils';

// Filter tasks by priority (empty selection = show all).
export function FilterPopover({
  selected,
  onChange,
}: {
  selected: Priority[];
  onChange: (value: Priority[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (p: Priority) =>
    selected.includes(p) ? onChange(selected.filter((x) => x !== p)) : onChange([...selected, p]);

  const trigger = (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setOpen((o) => !o)}
      className={cn(selected.length > 0 && 'border-accent text-accent')}
      aria-label="Filter"
    >
      <Filter size={15} />
    </Button>
  );

  return (
    <Popover open={open} onClose={() => setOpen(false)} trigger={trigger} className="w-52 p-2">
      <div className="px-1.5 pb-1 text-xs font-medium text-muted-foreground">Priority</div>
      {PRIORITIES.map((p) => (
        <button
          key={p}
          onClick={() => toggle(p)}
          className="flex w-full items-center justify-between rounded-lg px-1.5 py-1.5 hover:bg-muted"
        >
          <PriorityBadge priority={p} />
          {selected.includes(p) && <Check size={15} />}
        </button>
      ))}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="mt-1 w-full rounded-lg px-1.5 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted"
        >
          Clear filter
        </button>
      )}
    </Popover>
  );
}
