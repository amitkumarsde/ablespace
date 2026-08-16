'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';
import { useAppShell } from '@/lib/app-shell-context';
import { TasksWorkspace } from '@/components/tasks/TasksWorkspace';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setBreadcrumb } = useAppShell();

  // Show "Projects › <name>" in the top bar while on a project.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const project = await api.get<Project>(`/projects/${id}`);
        if (active) setBreadcrumb([{ label: 'Projects', href: '/projects' }, { label: project.name }]);
      } catch {
        if (active) setBreadcrumb([{ label: 'Projects', href: '/projects' }]);
      }
    })();
    return () => {
      active = false;
      setBreadcrumb([]);
    };
  }, [id, setBreadcrumb]);

  return <TasksWorkspace projectId={id} title="Tasks" />;
}
