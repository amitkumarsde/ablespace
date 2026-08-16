'use client';

import { useEffect } from 'react';
import { useAppShell } from '@/lib/app-shell-context';
import { ProjectsView } from '@/components/projects/ProjectsView';

export default function ProjectsPage() {
  const { setBreadcrumb } = useAppShell();
  useEffect(() => {
    setBreadcrumb([]);
  }, [setBreadcrumb]);

  return <ProjectsView />;
}
