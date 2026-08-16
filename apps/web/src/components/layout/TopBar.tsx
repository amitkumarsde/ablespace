'use client';

import Link from 'next/link';
import { ChevronRight, PanelLeft } from 'lucide-react';
import { useAppShell } from '@/lib/app-shell-context';

export function TopBar() {
  const { toggle, breadcrumb } = useAppShell();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
      <button
        onClick={toggle}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={18} />
      </button>
      <div className="h-4 w-px bg-border" />

      {breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-muted-foreground" />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
    </header>
  );
}
