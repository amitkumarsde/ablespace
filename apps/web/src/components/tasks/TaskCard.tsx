'use client';

import { Task } from '@/lib/types';
import { TaskField } from '@/lib/constants';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { DueDateBadge } from '@/components/ui/DueDateBadge';
import { LabelChip } from '@/components/ui/LabelChip';
import { RowActions } from './RowActions';

interface TaskCardProps {
  task: Task;
  fields: Record<TaskField, boolean>;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, fields, onOpen, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
      onClick={() => onOpen(task)}
      className="cursor-pointer rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
        <RowActions onEdit={() => onEdit(task)} onDelete={() => onDelete(task._id)} />
      </div>

      {fields.Priority && (
        <div className="mt-2">
          <PriorityBadge priority={task.priority} />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        {fields.Members && task.members.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.members[0]} size={18} />
            <span className="text-xs text-muted-foreground">
              {task.members[0]}
              {task.members.length > 1 ? ` +${task.members.length - 1}` : ''}
            </span>
          </div>
        ) : (
          <span />
        )}
        {fields['Due Date'] && <DueDateBadge date={task.dueDate} />}
      </div>

      {fields.Labels && task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <LabelChip key={l} label={l} />
          ))}
        </div>
      )}
    </div>
  );
}
