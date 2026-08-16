'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Subtask } from '@/lib/types';
import { InlineText } from '@/components/ui/InlineText';
import { DatePickerButton } from '@/components/ui/DatePickerButton';
import { MemberAvatars } from '@/components/ui/Avatar';
import { PriorityDropdown } from './PriorityDropdown';

export function SubtasksTable({
  subtasks,
  onChange,
}: {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}) {
  const [title, setTitle] = useState('');

  const patch = (i: number, part: Partial<Subtask>) =>
    onChange(subtasks.map((s, idx) => (idx === i ? { ...s, ...part } : s)));
  const remove = (i: number) => onChange(subtasks.filter((_, idx) => idx !== i));
  const add = () => {
    const t = title.trim();
    if (!t) return;
    onChange([...subtasks, { title: t, priority: 'Medium', members: [], dueDate: null }]);
    setTitle('');
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] text-left">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Task</th>
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Members</th>
            <th className="px-4 py-2.5 font-medium">Due Date</th>
            <th className="px-4 py-2.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subtasks.map((s, i) => (
            <tr key={s._id ?? i} className="border-t border-border">
              <td className="px-4 py-2 text-sm">
                <InlineText
                  value={s.title}
                  onCommit={(title) => patch(i, { title })}
                  className="px-1 py-0.5"
                />
              </td>
              <td className="px-4 py-2">
                <PriorityDropdown value={s.priority} onChange={(priority) => patch(i, { priority })} />
              </td>
              <td className="px-4 py-2">
                <MemberAvatars members={s.members} />
              </td>
              <td className="px-4 py-2">
                <DatePickerButton
                  value={s.dueDate}
                  onChange={(dueDate) => patch(i, { dueDate })}
                  placeholder="Set date"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => remove(i)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-red-600"
                  aria-label="Delete subtask"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-t border-border">
            <td colSpan={5} className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Plus size={14} className="text-muted-foreground" />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && add()}
                  onBlur={add}
                  placeholder="Add Subtasks"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
