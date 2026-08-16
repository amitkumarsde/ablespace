'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, ChevronDown, LayoutGrid } from 'lucide-react';
import { AccountMenu } from './AccountMenu';
import { useAppShell } from '@/lib/app-shell-context';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/tasks', label: 'Tasks', icon: LayoutGrid },
  { href: '/projects', label: 'Projects', icon: Briefcase },
];

export function Sidebar() {
  const { open, setOpen, closeMobile } = useAppShell();
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          'h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
          open ? 'flex fixed inset-y-0 left-0 z-50 md:static md:z-auto' : 'hidden',
        )}
      >
        <div className="p-2">
          <AccountMenu />
        </div>

        <nav className="px-2">
          <button
            onClick={() => setWorkspaceOpen((o) => !o)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-xs font-semibold text-muted-foreground"
          >
            Workspace
            <ChevronDown
              size={14}
              className={cn('transition-transform', !workspaceOpen && '-rotate-90')}
            />
          </button>

          {workspaceOpen &&
            NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium',
                    active
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </aside>
    </>
  );
}
