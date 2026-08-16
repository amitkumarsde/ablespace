'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Moon,
  Palette,
  Settings,
  Sun,
} from 'lucide-react';
import { Popover } from '@/components/ui/Popover';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { ACCENTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type View = 'root' | 'theme' | 'color';

// Row used across the account menu for consistent styling.
function Row({
  icon,
  label,
  onClick,
  right,
}: {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {right}
    </button>
  );
}

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('root');
  const { user, logout } = useAuth();
  const { mode, accent, setMode, setAccent } = useTheme();
  const router = useRouter();

  const close = () => setOpen(false);
  const currentAccent = ACCENTS.find((a) => a.key === accent);

  const trigger = (
    <button
      onClick={() => {
        setView('root');
        setOpen((o) => !o);
      }}
      className="flex w-full items-center gap-2 rounded-lg p-1.5 hover:bg-muted"
    >
      <Avatar name={user?.name || 'Guest'} src={user?.avatarUrl} size={28} />
      <span className="flex-1 truncate text-left text-sm font-semibold">{user?.name}</span>
      <ChevronsUpDown size={15} className="text-muted-foreground" />
    </button>
  );

  return (
    <Popover open={open} onClose={close} align="left" trigger={trigger} className="w-64 p-1">
      {view === 'root' && (
        <>
          <div className="flex flex-col items-center gap-1 px-3 py-3 text-center">
            <Avatar name={user?.name || 'Guest'} src={user?.avatarUrl} size={44} />
            <span className="text-sm font-semibold">{user?.name}</span>
            {user?.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
          </div>
          <div className="my-1 h-px bg-border" />
          <Row
            icon={<Sun size={16} />}
            label="Change Theme"
            onClick={() => setView('theme')}
            right={<ChevronRight size={15} className="text-muted-foreground" />}
          />
          <Row
            icon={<Palette size={16} />}
            label="Color Mode"
            onClick={() => setView('color')}
            right={
              <span
                className="h-3.5 w-3.5 rounded-sm"
                style={{ backgroundColor: currentAccent?.color }}
              />
            }
          />
          <Row
            icon={<Settings size={16} />}
            label="Settings"
            onClick={() => {
              close();
              router.push('/settings');
            }}
          />
          <div className="my-1 h-px bg-border" />
          <Row icon={<LogOut size={16} />} label="Log out" onClick={logout} />
        </>
      )}

      {view === 'theme' && (
        <>
          <button
            onClick={() => setView('root')}
            className="flex w-full items-center gap-2 px-2.5 py-2 text-sm font-medium"
          >
            <ChevronLeft size={16} /> Theme
          </button>
          <div className="my-1 h-px bg-border" />
          <Row
            icon={<Sun size={16} />}
            label="Light"
            onClick={() => setMode('light')}
            right={mode === 'light' ? <Check size={15} /> : undefined}
          />
          <Row
            icon={<Moon size={16} />}
            label="Dark"
            onClick={() => setMode('dark')}
            right={mode === 'dark' ? <Check size={15} /> : undefined}
          />
        </>
      )}

      {view === 'color' && (
        <>
          <button
            onClick={() => setView('root')}
            className="flex w-full items-center gap-2 px-2.5 py-2 text-sm font-medium"
          >
            <ChevronLeft size={16} /> Color
          </button>
          <div className="my-1 h-px bg-border" />
          {ACCENTS.map((a) => (
            <Row
              key={a.key}
              icon={
                <span
                  className={cn('h-3.5 w-3.5 rounded-sm', a.key === 'black' && 'border border-border')}
                  style={{ backgroundColor: a.color }}
                />
              }
              label={a.label}
              onClick={() => setAccent(a.key)}
              right={accent === a.key ? <Check size={15} /> : undefined}
            />
          ))}
        </>
      )}
    </Popover>
  );
}
