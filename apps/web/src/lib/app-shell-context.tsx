'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

interface AppShellContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  closeMobile: () => void;
  breadcrumb: Crumb[];
  setBreadcrumb: (crumb: Crumb[]) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState<Crumb[]>([]);

  // Start collapsed on small screens.
  useEffect(() => {
    setOpen(window.innerWidth >= 768);
  }, []);

  const toggle = () => setOpen((o) => !o);
  const closeMobile = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  return (
    <AppShellContext.Provider
      value={{ open, setOpen, toggle, closeMobile, breadcrumb, setBreadcrumb }}
    >
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used within AppShellProvider');
  return ctx;
}
