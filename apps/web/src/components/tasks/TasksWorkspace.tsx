'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Priority, Status, Task } from '@/lib/types';
import { DEFAULT_FIELDS, TaskField } from '@/lib/constants';
import { useLocalState } from '@/lib/hooks';
import { Spinner } from '@/components/ui/Spinner';
import { Toolbar } from './Toolbar';
import { BoardView } from './BoardView';
import { ListView } from './ListView';
import { TaskFormModal, TaskFormValues } from './TaskFormModal';

// Shared Tasks experience used by both the Tasks page and a project's page.
export function TasksWorkspace({ projectId, title }: { projectId?: string; title: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useLocalState<'board' | 'list'>('pyramid.view', 'board');
  const [fields, setFields] = useLocalState<Record<TaskField, boolean>>('pyramid.fields', DEFAULT_FIELDS);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [presetStatus, setPresetStatus] = useState<Status>('To Do');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Task[]>(projectId ? `/tasks?projectId=${projectId}` : '/tasks');
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (!search || t.title.toLowerCase().includes(search.toLowerCase())) &&
          (priorityFilter.length === 0 || priorityFilter.includes(t.priority)),
      ),
    [tasks, search, priorityFilter],
  );

  const openCreate = (status: Status = 'To Do') => {
    setEditing(null);
    setPresetStatus(status);
    setModalOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setModalOpen(true);
  };
  const openTask = (task: Task) => router.push(`/tasks/${task._id}`);

  const save = async (values: TaskFormValues, id?: string) => {
    if (id) {
      const updated = await api.patch<Task>(`/tasks/${id}`, values);
      setTasks((ts) => ts.map((t) => (t._id === id ? updated : t)));
    } else {
      const created = await api.post<Task>('/tasks', { ...values, projectId });
      setTasks((ts) => [...ts, created]);
    }
    setModalOpen(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks((ts) => ts.filter((t) => t._id !== id));
    try {
      await api.del(`/tasks/${id}`);
    } catch {
      load();
    }
  };

  // Drag-and-drop: move a card to a column and place it at the end.
  const move = async (taskId: string, toStatus: Status) => {
    const orders = tasks.filter((t) => t.status === toStatus).map((t) => t.order);
    const order = (orders.length ? Math.max(...orders) : 0) + 1000;
    setTasks((ts) => ts.map((t) => (t._id === taskId ? { ...t, status: toStatus, order } : t)));
    try {
      await api.patch(`/tasks/${taskId}`, { status: toStatus, order });
    } catch {
      load();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Toolbar
          search={search}
          onSearch={setSearch}
          view={view}
          onView={setView}
          fields={fields}
          onFields={setFields}
          priorityFilter={priorityFilter}
          onPriorityFilter={setPriorityFilter}
          onAdd={() => openCreate()}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-6 w-6" />
        </div>
      ) : view === 'board' ? (
        <BoardView
          tasks={filtered}
          fields={fields}
          onMove={move}
          onOpen={openTask}
          onEdit={openEdit}
          onDelete={remove}
          onAdd={openCreate}
        />
      ) : (
        <ListView
          tasks={filtered}
          fields={fields}
          searching={!!search}
          onOpen={openTask}
          onEdit={openEdit}
          onDelete={remove}
          onAdd={openCreate}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editing}
        presetStatus={presetStatus}
        onSave={save}
      />
    </div>
  );
}
