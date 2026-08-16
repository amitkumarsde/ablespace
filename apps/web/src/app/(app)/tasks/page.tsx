'use client';

import { useEffect } from 'react';
import { useAppShell } from '@/lib/app-shell-context';
import { TasksWorkspace } from '@/components/tasks/TasksWorkspace';

export default function TasksPage() {
  const { setBreadcrumb } = useAppShell();
  useEffect(() => {
    setBreadcrumb([]);
  }, [setBreadcrumb]);

  return <TasksWorkspace title="Tasks" />;
}
