'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';

// The "..." menu (Edit / Delete) reused by board cards and list rows.
export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      aria-label="Actions"
    >
      <MoreHorizontal size={16} />
    </button>
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover open={open} onClose={() => setOpen(false)} trigger={trigger} className="min-w-32 p-1">
        <button
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm hover:bg-muted"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-muted dark:text-red-400"
        >
          <Trash2 size={14} /> Delete
        </button>
      </Popover>
    </div>
  );
}
