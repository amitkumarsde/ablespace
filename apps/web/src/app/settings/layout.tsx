'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Palette, Search, Sun, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/settings', label: 'Profile', icon: User },
  { href: '/settings/theme', label: 'Theme', icon: Sun },
  { href: '/settings/color', label: 'Color', icon: Palette },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const nav = NAV.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop settings sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 md:flex">
        <Link
          href="/tasks"
          className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
        >
          <ArrowLeft size={16} /> Back to app
        </Link>
        <div className="relative mb-3">
          <Search
            size={15}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="pl-8"
          />
        </div>
        <nav className="space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
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

      <main className="flex-1 overflow-y-auto">
        {/* Mobile settings nav */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-2 md:hidden">
          <Link href="/tasks" className="flex items-center gap-1.5 text-sm">
            <ArrowLeft size={16} /> Back
          </Link>
          <nav className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-sm font-medium',
                  pathname === item.href ? 'bg-muted' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </main>
    </div>
  );
}
