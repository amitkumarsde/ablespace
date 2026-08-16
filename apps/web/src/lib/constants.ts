import { Priority, Status } from './types';

export const STATUSES: Status[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

// Dot color per status.
export const STATUS_META: Record<Status, { color: string }> = {
  'To Do': { color: '#a1a1aa' },
  Doing: { color: '#3b82f6' },
  Completed: { color: '#10b981' },
  'On Hold': { color: '#f59e0b' },
};

export const PRIORITIES: Priority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];

// bars = how many bars fill the icon; color tints it.
export const PRIORITY_META: Record<Priority, { bars: number; color: string }> = {
  'No Priority': { bars: 0, color: '#a1a1aa' },
  Urgent: { bars: 3, color: '#dc2626' },
  High: { bars: 3, color: '#ef4444' },
  Medium: { bars: 2, color: '#f59e0b' },
  Low: { bars: 1, color: '#a1a1aa' },
};

// Accent options shown under "Color Mode".
export const ACCENTS = [
  { key: 'amber', label: 'Amber', color: '#f59e0b' },
  { key: 'blue', label: 'Blue', color: '#2563eb' },
  { key: 'pink', label: 'Pink', color: '#ec4899' },
  { key: 'rose', label: 'Rose', color: '#f43f5e' },
  { key: 'emerald', label: 'Emerald', color: '#10b981' },
  { key: 'black', label: 'Black', color: '#18181b' },
] as const;

export type AccentKey = (typeof ACCENTS)[number]['key'];

// Fields shown in the "Fields" popover.
export const TASK_FIELDS = ['Priority', 'Members', 'Due Date', 'Labels', 'Status', 'Reporter'] as const;
export type TaskField = (typeof TASK_FIELDS)[number];

export const DEFAULT_FIELDS: Record<TaskField, boolean> = {
  Priority: true,
  Members: true,
  'Due Date': true,
  Labels: true,
  Status: false,
  Reporter: false,
};
