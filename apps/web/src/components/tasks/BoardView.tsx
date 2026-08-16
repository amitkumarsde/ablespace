'use client';

import { useState } from 'react';
import { GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import { Status, Task } from '@/lib/types';
import { STATUSES, TaskField } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { TaskCard } from './TaskCard';

interface BoardViewProps {
  tasks: Task[];
  fields: Record<TaskField, boolean>;
  onMove: (taskId: string, toStatus: Status) => void;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: (status: Status) => void;
}

export function BoardView({ tasks, fields, onMove, onOpen, onEdit, onDelete, onAdd }: BoardViewProps) {
  const [overColumn, setOverColumn] = useState<Status | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);
        return (
          <div key={status} className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/60">
            <header className="flex items-center gap-2 px-3 py-2.5">
              <GripVertical size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium">{status}</span>
              <div className="ml-auto flex items-center gap-1 text-muted-foreground">
                <button onClick={() => onAdd(status)} className="rounded p-0.5 hover:bg-muted">
                  <Plus size={15} />
                </button>
                <button className="rounded p-0.5 hover:bg-muted">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </header>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(status);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => {
                setOverColumn(null);
                const id = e.dataTransfer.getData('text/plain');
                if (id) onMove(id, status);
              }}
              className={cn(
                'flex min-h-24 flex-1 flex-col gap-2 rounded-lg px-2 pb-2',
                overColumn === status && 'ring-2 ring-accent/40',
              )}
            >
              {columnTasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  fields={fields}
                  onOpen={onOpen}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}

              <button
                onClick={() => onAdd(status)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              >
                <Plus size={14} /> Add Task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
