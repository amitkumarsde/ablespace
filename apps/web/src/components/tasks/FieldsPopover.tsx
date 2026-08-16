'use client';

import { useState } from 'react';
import { Columns3, LayoutGrid, List } from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import { Checkbox } from '@/components/ui/Checkbox';
import { TASK_FIELDS, TaskField } from '@/lib/constants';

type View = 'list' | 'board';

interface FieldsPopoverProps {
  view: View;
  onView: (view: View) => void;
  fields: Record<TaskField, boolean>;
  onFields: (fields: Record<TaskField, boolean>) => void;
}

export function FieldsPopover({ view, onView, fields, onFields }: FieldsPopoverProps) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
      <Columns3 size={15} /> Fields
    </Button>
  );

  return (
    <Popover open={open} onClose={() => setOpen(false)} trigger={trigger} className="w-64 p-2">
      <Segmented
        value={view}
        onChange={onView}
        options={[
          { value: 'list', label: 'List', icon: <List size={14} /> },
          { value: 'board', label: 'Board', icon: <LayoutGrid size={14} /> },
        ]}
      />
      <div className="my-2 h-px bg-border" />
      {TASK_FIELDS.map((f) => (
        <div key={f} className="flex items-center justify-between px-1.5 py-1.5 text-sm">
          <span>{f}</span>
          <Checkbox checked={fields[f]} onChange={() => onFields({ ...fields, [f]: !fields[f] })} />
        </div>
      ))}
    </Popover>
  );
}
