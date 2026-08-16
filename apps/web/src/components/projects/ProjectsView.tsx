'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Priority, Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SearchBox } from '@/components/ui/SearchBox';
import { Spinner } from '@/components/ui/Spinner';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Avatar } from '@/components/ui/Avatar';
import { FilterPopover } from '@/components/tasks/FilterPopover';
import { RowActions } from '@/components/tasks/RowActions';
import { ProjectFormModal, ProjectFormValues } from './ProjectFormModal';

export function ProjectsView() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await api.get<Project[]>('/projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
          (priorityFilter.length === 0 || priorityFilter.includes(p.priority)),
      ),
    [projects, search, priorityFilter],
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const save = async (values: ProjectFormValues, id?: string) => {
    if (id) {
      const updated = await api.patch<Project>(`/projects/${id}`, values);
      setProjects((ps) => ps.map((p) => (p._id === id ? updated : p)));
    } else {
      const created = await api.post<Project>('/projects', values);
      setProjects((ps) => [...ps, created]);
    }
    setModalOpen(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    setProjects((ps) => ps.filter((p) => p._id !== id));
    try {
      await api.del(`/projects/${id}`);
    } catch {
      load();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Projects</h1>
        <div className="flex items-center gap-2">
          <SearchBox value={search} onChange={setSearch} />
          <FilterPopover selected={priorityFilter} onChange={setPriorityFilter} />
          <Button size="sm" onClick={openCreate}>
            <Plus size={15} /> <span className="hidden sm:inline">Add Project</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Projects</th>
                <th className="px-4 py-2.5 font-medium">Priority</th>
                <th className="px-4 py-2.5 font-medium">Lead</th>
                <th className="px-4 py-2.5 font-medium">Due Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  onClick={() => router.push(`/projects/${p._id}`)}
                  className="cursor-pointer border-t border-border hover:bg-muted/40"
                >
                  <td className="px-4 py-2.5 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-2.5">
                    <PriorityBadge priority={p.priority} />
                  </td>
                  <td className="px-4 py-2.5">
                    {p.lead ? (
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <Avatar name={p.lead} size={20} />
                        {p.lead}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-sm">{formatDate(p.dueDate, true) || '—'}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end">
                      <RowActions
                        onEdit={() => {
                          setEditing(p);
                          setModalOpen(true);
                        }}
                        onDelete={() => remove(p._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td colSpan={5} className="px-4 py-2.5">
                  <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Plus size={14} /> Add Projects
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editing}
        onSave={save}
      />
    </div>
  );
}
