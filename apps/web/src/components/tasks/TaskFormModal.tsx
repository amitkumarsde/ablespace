'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { TagInput } from '@/components/ui/TagInput';
import { Field } from '@/components/ui/Field';
import { Priority, Status, Task } from '@/lib/types';
import { PRIORITIES, STATUSES } from '@/lib/constants';
import { toDateInput } from '@/lib/utils';

export interface TaskFormValues {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  members: string[];
  labels: string[];
  teams: string[];
  dueDate?: string;
}

const blank = (status: Status): TaskFormValues => ({
  title: '',
  description: '',
  status,
  priority: 'Medium',
  members: [],
  labels: [],
  teams: [],
  dueDate: '',
});

const fromTask = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  members: task.members,
  labels: task.labels,
  teams: task.teams,
  dueDate: toDateInput(task.dueDate),
});

interface Props {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  presetStatus: Status;
  onSave: (values: TaskFormValues, id?: string) => Promise<void>;
}

export function TaskFormModal({ open, onClose, task, presetStatus, onSave }: Props) {
  const [values, setValues] = useState<TaskFormValues>(blank(presetStatus));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(task ? fromTask(task) : blank(presetStatus));
      setError('');
    }
  }, [open, task, presetStatus]);

  const set = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async () => {
    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload: TaskFormValues = { ...values, title: values.title.trim() };
      if (!payload.dueDate) delete payload.dueDate;
      await onSave(payload, task?._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add Task'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Title">
          <Input
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Task title"
          />
        </Field>

        <Field label="Description">
          <Textarea
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Add a description…"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={values.status} onChange={(e) => set('status', e.target.value as Status)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              value={values.priority}
              onChange={(e) => set('priority', e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Due date">
          <Input
            type="date"
            value={values.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
          />
        </Field>

        <Field label="Members">
          <TagInput
            value={values.members}
            onChange={(v) => set('members', v)}
            placeholder="Add a member and press Enter"
          />
        </Field>

        <Field label="Labels">
          <TagInput
            value={values.labels}
            onChange={(v) => set('labels', v)}
            placeholder="Add a label and press Enter"
          />
        </Field>

        <Field label="Teams">
          <TagInput
            value={values.teams}
            onChange={(v) => set('teams', v)}
            placeholder="Add a team and press Enter"
          />
        </Field>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
