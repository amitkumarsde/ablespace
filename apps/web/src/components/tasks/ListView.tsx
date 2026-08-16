'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Status, Task } from '@/lib/types';
import { STATUSES, TaskField } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { MemberAvatars } from '@/components/ui/Avatar';
import { LabelChip } from '@/components/ui/LabelChip';
import { RowActions } from './RowActions';

// Optional columns controlled by the Fields toggles (Task and Actions always show).
const COLUMN_DEFS: { field: TaskField; header: string; render: (t: Task) => React.ReactNode }[] = [
  { field: 'Priority', header: 'Priority', render: (t) => <PriorityBadge priority={t.priority} /> },
  { field: 'Members', header: 'Members', render: (t) => <MemberAvatars members={t.members} /> },
  {
    field: 'Due Date',
    header: 'Due Date',
    render: (t) => <span className="text-sm">{formatDate(t.dueDate, true)}</span>,
  },
  {
    field: 'Labels',
    header: 'Labels',
    render: (t) => (
      <div className="flex flex-wrap gap-1">
        {t.labels.map((l) => (
          <LabelChip key={l} label={l} />
        ))}
      </div>
    ),
  },
  { field: 'Status', header: 'Status', render: (t) => <span className="text-sm">{t.status}</span> },
  {
    field: 'Reporter',
    header: 'Reporter',
    render: (t) => <span className="text-sm">{t.reporter}</span>,
  },
];

interface ListViewProps {
  tasks: Task[];
  fields: Record<TaskField, boolean>;
  searching: boolean;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (status: Status) => void;
}

export function ListView({ tasks, fields, searching, onOpen, onEdit, onDelete, onAdd }: ListViewProps) {
  const cols = COLUMN_DEFS.filter((c) => fields[c.field]);
  const groups = STATUSES.map((status) => ({
    status,
    items: tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order),
  })).filter((g) => !searching || g.items.length > 0);

  if (searching && groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks match your search.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <ListGroup
          key={g.status}
          status={g.status}
          items={g.items}
          cols={cols}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}

function ListGroup({
  status,
  items,
  cols,
  onOpen,
  onEdit,
  onDelete,
  onAdd,
}: {
  status: Status;
  items: Task[];
  cols: typeof COLUMN_DEFS;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (status: Status) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-2 flex items-center gap-1.5 text-sm font-medium"
      >
        <ChevronDown size={15} className={cn('transition-transform', !open && '-rotate-90')} />
        {status}
      </button>

      {open && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Task</th>
                {cols.map((c) => (
                  <th key={c.field} className="px-4 py-2.5 font-medium">
                    {c.header}
                  </th>
                ))}
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => onOpen(t)}
                  className="cursor-pointer border-t border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 text-sm font-medium">{t.title}</td>
                  {cols.map((c) => (
                    <td key={c.field} className="px-4 py-2.5">
                      {c.render(t)}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end">
                      <RowActions onEdit={() => onEdit(t)} onDelete={() => onDelete(t._id)} />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td colSpan={cols.length + 2} className="px-4 py-2.5">
                  <button
                    onClick={() => onAdd(status)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Plus size={14} /> Add Task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
