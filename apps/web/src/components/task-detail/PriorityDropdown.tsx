'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Priority } from '@/lib/types';
import { PRIORITIES } from '@/lib/constants';

export function PriorityDropdown({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (priority: Priority) => void;
}) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      onClick={() => setOpen((o) => !o)}
      className="flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-muted"
    >
      <PriorityBadge priority={value} />
      <ChevronDown size={13} className="text-muted-foreground" />
    </button>
  );

  return (
    <Popover open={open} onClose={() => setOpen(false)} trigger={trigger} className="w-44 p-1">
      <div className="px-2 py-1 text-xs text-muted-foreground">Priority</div>
      {PRIORITIES.map((p) => (
        <button
          key={p}
          onClick={() => {
            onChange(p);
            setOpen(false);
          }}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted"
        >
          <PriorityBadge priority={p} />
          {value === p && <Check size={14} />}
        </button>
      ))}
    </Popover>
  );
}
