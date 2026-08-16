'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBox } from '@/components/ui/SearchBox';
import { Priority } from '@/lib/types';
import { TaskField } from '@/lib/constants';
import { FieldsPopover } from './FieldsPopover';
import { FilterPopover } from './FilterPopover';

type View = 'list' | 'board';

interface ToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: View;
  onView: (view: View) => void;
  fields: Record<TaskField, boolean>;
  onFields: (fields: Record<TaskField, boolean>) => void;
  priorityFilter: Priority[];
  onPriorityFilter: (value: Priority[]) => void;
  onAdd: () => void;
  addLabel?: string;
}

export function Toolbar({
  search,
  onSearch,
  view,
  onView,
  fields,
  onFields,
  priorityFilter,
  onPriorityFilter,
  onAdd,
  addLabel = 'Add Task',
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <SearchBox value={search} onChange={onSearch} />
      <FieldsPopover view={view} onView={onView} fields={fields} onFields={onFields} />
      <FilterPopover selected={priorityFilter} onChange={onPriorityFilter} />
      <Button size="sm" onClick={onAdd}>
        <Plus size={15} /> <span className="hidden sm:inline">{addLabel}</span>
      </Button>
    </div>
  );
}
