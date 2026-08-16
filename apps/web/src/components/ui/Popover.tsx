'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

// Popover rendered in a portal so scroll areas don't clip it.
export function Popover({ open, onClose, trigger, children, align = 'right', className }: PopoverProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => setMounted(true), []);

  // Position the panel just under the trigger, in viewport coordinates.
  useLayoutEffect(() => {
    if (!open) return;
    const el = wrapRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next: React.CSSProperties = { position: 'fixed', top: r.bottom + 6, zIndex: 50 };
    if (align === 'right') next.right = window.innerWidth - r.right;
    else next.left = r.left;
    setStyle(next);
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || contentRef.current?.contains(t)) return;
      onClose();
    };
    const onScroll = (e: Event) => {
      if (!contentRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, onClose]);

  return (
    <div ref={wrapRef} style={{ display: 'contents' }}>
      {trigger}
      {open &&
        mounted &&
        createPortal(
          <div
            ref={contentRef}
            style={style}
            className={cn(
              'max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card shadow-lg',
              className,
            )}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  );
}
