'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TagInput } from '@/components/ui/TagInput';
import { Field } from '@/components/ui/Field';
import { Priority, Project } from '@/lib/types';
import { PRIORITIES } from '@/lib/constants';
import { toDateInput } from '@/lib/utils';

export interface ProjectFormValues {
  name: string;
  priority: Priority;
  lead: string;
  members: string[];
  dueDate?: string;
}

const blank = (): ProjectFormValues => ({
  name: '',
  priority: 'Medium',
  lead: '',
  members: [],
  dueDate: '',
});

const fromProject = (p: Project): ProjectFormValues => ({
  name: p.name,
  priority: p.priority,
  lead: p.lead,
  members: p.members,
  dueDate: toDateInput(p.dueDate),
});

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (values: ProjectFormValues, id?: string) => Promise<void>;
}

export function ProjectFormModal({ open, onClose, project, onSave }: Props) {
  const [values, setValues] = useState<ProjectFormValues>(blank());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(project ? fromProject(project) : blank());
      setError('');
    }
  }, [open, project]);

  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async () => {
    if (!values.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload: ProjectFormValues = { ...values, name: values.name.trim() };
      if (!payload.dueDate) delete payload.dueDate;
      await onSave(payload, project?._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add Project'}
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
        <Field label="Name">
          <Input
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Project name"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
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
          <Field label="Lead">
            <Input value={values.lead} onChange={(e) => set('lead', e.target.value)} placeholder="Lead" />
          </Field>
        </div>
        <Field label="Due date">
          <Input type="date" value={values.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
        </Field>
        <Field label="Members">
          <TagInput
            value={values.members}
            onChange={(v) => set('members', v)}
            placeholder="Add a member and press Enter"
          />
        </Field>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
