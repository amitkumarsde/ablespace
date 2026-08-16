'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronDown, Eye, Lock, MoreHorizontal, Share2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAppShell } from '@/lib/app-shell-context';
import { Spinner } from '@/components/ui/Spinner';
import { Popover } from '@/components/ui/Popover';
import { InlineText } from '@/components/ui/InlineText';
import { Avatar } from '@/components/ui/Avatar';
import { DueDateBadge } from '@/components/ui/DueDateBadge';
import { TagInput } from '@/components/ui/TagInput';
import { DetailsPanel } from '@/components/task-detail/DetailsPanel';
import { SubtasksTable } from '@/components/task-detail/SubtasksTable';
import { ResourcesRow } from '@/components/task-detail/ResourcesRow';
import { Comments } from '@/components/task-detail/Comments';
import { ActivityFeed } from '@/components/task-detail/ActivityFeed';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { setBreadcrumb } = useAppShell();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setBreadcrumb([]);
  }, [setBreadcrumb]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTask(await api.get<Task>(`/tasks/${id}`));
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Optimistic update, then reconcile with the server response.
  const update = async (partial: Partial<Task>) => {
    setTask((t) => (t ? { ...t, ...partial } : t));
    try {
      setTask(await api.patch<Task>(`/tasks/${id}`, partial));
    } catch {
      load();
    }
  };

  const addComment = async (text: string) => setTask(await api.post<Task>(`/tasks/${id}/comments`, { text }));
  const addReply = async (commentId: string, text: string) =>
    setTask(await api.post<Task>(`/tasks/${id}/comments/${commentId}/replies`, { text }));
  const deleteComment = async (commentId: string) =>
    setTask(await api.del<Task>(`/tasks/${id}/comments/${commentId}`));

  const deleteTask = async () => {
    if (!window.confirm('Delete this task?')) return;
    await api.del(`/tasks/${id}`);
    router.push('/tasks');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (missing || !task) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Task not found.{' '}
        <button onClick={() => router.push('/tasks')} className="underline">
          Back to tasks
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main column */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <InlineText
              value={task.title}
              onCommit={(title) => update({ title })}
              className="px-1 text-2xl font-semibold"
            />
            <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
              <button className="rounded-md p-1.5 hover:bg-muted">
                <Lock size={16} />
              </button>
              <button className="flex items-center gap-1 rounded-md p-1.5 hover:bg-muted">
                <Eye size={16} />
                <span className="text-xs">1</span>
              </button>
              <button className="rounded-md p-1.5 hover:bg-muted">
                <Share2 size={16} />
              </button>
              <Popover
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                trigger={
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="rounded-md p-1.5 hover:bg-muted"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                }
                className="min-w-32 p-1"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    deleteTask();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-red-600 hover:bg-muted dark:text-red-400"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </Popover>
            </div>
          </div>

          <InlineText
            value={task.description}
            onCommit={(description) => update({ description })}
            placeholder="Add a description…"
            multiline
            className="mt-2 px-1 text-sm text-muted-foreground"
          />

          {/* Properties */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="w-20 text-sm font-medium">Properties</span>
            {task.members.map((m) => (
              <span key={m} className="inline-flex items-center gap-1.5 text-sm">
                <Avatar name={m} size={20} />
                {m}
              </span>
            ))}
            <DueDateBadge date={task.dueDate} />
          </div>

          {/* Labels */}
          <div className="mt-4 flex flex-wrap items-start gap-3">
            <span className="mt-1.5 w-20 shrink-0 text-sm font-medium">Labels</span>
            <div className="min-w-0 flex-1">
              <TagInput
                value={task.labels}
                onChange={(labels) => update({ labels })}
                placeholder="Add labels"
              />
            </div>
          </div>

          {/* Resources */}
          <div className="mt-4 flex flex-wrap items-start gap-3">
            <span className="mt-1 w-20 shrink-0 text-sm font-medium">Resources</span>
            <div className="min-w-0 flex-1">
              <ResourcesRow
                resources={task.resources}
                onChange={(resources) => update({ resources })}
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="mt-6">
            <button
              onClick={() => setSubtasksOpen((o) => !o)}
              className="mb-2 flex items-center gap-1.5 text-sm font-medium"
            >
              <ChevronDown
                size={15}
                className={cn('transition-transform', !subtasksOpen && '-rotate-90')}
              />
              Subtasks
            </button>
            {subtasksOpen && (
              <SubtasksTable
                subtasks={task.subtasks}
                onChange={(subtasks) => update({ subtasks })}
              />
            )}
          </div>

          {/* Comments */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium">Comments</h2>
            <Comments
              comments={task.comments}
              onAddComment={addComment}
              onAddReply={addReply}
              onDeleteComment={deleteComment}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <DetailsPanel task={task} onUpdate={update} />
          <div className="rounded-xl border border-border p-3">
            <h2 className="mb-3 px-1 text-sm font-medium">Updates</h2>
            <ActivityFeed updates={task.updates} />
          </div>
        </div>
      </div>
    </div>
  );
}
