'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { Status } from '@/lib/types';
import { STATUSES, STATUS_META } from '@/lib/constants';

function Dot({ status }: { status: Status }) {
  return (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: STATUS_META[status].color }}
    />
  );
}

export function StatusDropdown({
  value,
  onChange,
}: {
  value: Status;
  onChange: (status: Status) => void;
}) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      onClick={() => setOpen((o) => !o)}
      className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-sm hover:bg-muted"
    >
      <Dot status={value} />
      {value}
      <ChevronDown size={13} className="text-muted-foreground" />
    </button>
  );

  return (
    <Popover open={open} onClose={() => setOpen(false)} trigger={trigger} className="w-44 p-1">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => {
            onChange(s);
            setOpen(false);
          }}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
        >
          <Dot status={s} />
          <span className="flex-1 text-left">{s}</span>
          {value === s && <Check size={14} />}
        </button>
      ))}
    </Popover>
  );
}
