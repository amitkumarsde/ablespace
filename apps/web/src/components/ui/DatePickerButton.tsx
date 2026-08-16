'use client';

import { useState } from 'react';
import { Popover } from './Popover';
import { Calendar } from './Calendar';
import { formatDate } from '@/lib/utils';

export function DatePickerButton({
  value,
  onChange,
  placeholder,
  align = 'left',
}: {
  value?: string | null;
  onChange: (date: string) => void;
  placeholder: string;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      onClick={() => setOpen((o) => !o)}
      className="rounded-md px-2 py-1 text-sm hover:bg-muted"
    >
      {value ? formatDate(value) : <span className="text-muted-foreground">{placeholder}</span>}
    </button>
  );

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      trigger={trigger}
      align={align}
      className="min-w-0"
    >
      <Calendar
        value={value}
        onSelect={(date) => {
          onChange(date);
          setOpen(false);
        }}
      />
    </Popover>
  );
}
