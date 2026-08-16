'use client';

import { ArrowRight } from 'lucide-react';
import { Task } from '@/lib/types';
import { TagInput } from '@/components/ui/TagInput';
import { DatePickerButton } from '@/components/ui/DatePickerButton';
import { InlineText } from '@/components/ui/InlineText';
import { StatusDropdown } from './StatusDropdown';
import { PriorityDropdown } from './PriorityDropdown';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-1 py-2">
      <span className="w-16 shrink-0 pt-1 text-xs text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function DetailsPanel({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (partial: Partial<Task>) => void;
}) {
  return (
    <aside className="w-full shrink-0 rounded-xl border border-border p-3 lg:w-72">
      <div className="px-1 pb-1 text-sm font-medium">Details</div>

      <Row label="Status">
        <StatusDropdown value={task.status} onChange={(status) => onUpdate({ status })} />
      </Row>
      <Row label="Priority">
        <PriorityDropdown value={task.priority} onChange={(priority) => onUpdate({ priority })} />
      </Row>
      <Row label="Members">
        <TagInput
          value={task.members}
          onChange={(members) => onUpdate({ members })}
          placeholder="Add members"
        />
      </Row>
      <Row label="Dates">
        <div className="flex items-center gap-1">
          <DatePickerButton
            value={task.startDate}
            onChange={(startDate) => onUpdate({ startDate })}
            placeholder="Start"
          />
          <ArrowRight size={13} className="text-muted-foreground" />
          <DatePickerButton
            value={task.dueDate}
            onChange={(dueDate) => onUpdate({ dueDate })}
            placeholder="End"
          />
        </div>
      </Row>
      <Row label="Teams">
        <TagInput
          value={task.teams}
          onChange={(teams) => onUpdate({ teams })}
          placeholder="Add teams"
        />
      </Row>
      <Row label="Reporter">
        <InlineText
          value={task.reporter}
          onCommit={(reporter) => onUpdate({ reporter })}
          placeholder="Add reporter"
          className="px-1 py-0.5 text-sm"
        />
      </Row>
    </aside>
  );
}
