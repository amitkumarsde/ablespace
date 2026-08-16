'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface InlineTextProps {
  value: string;
  onCommit: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

// Editable text that saves on blur (or Enter for single-line).
export function InlineText({
  value,
  onCommit,
  className,
  placeholder,
  multiline,
  rows = 3,
}: InlineTextProps) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  const commit = () => {
    const trimmed = text.trim();
    if (trimmed !== value) onCommit(trimmed);
  };

  if (multiline) {
    return (
      <textarea
        value={text}
        rows={rows}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        placeholder={placeholder}
        className={cn(
          'w-full resize-none rounded-lg bg-transparent outline-none focus:bg-muted/50',
          className,
        )}
      />
    );
  }

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      placeholder={placeholder}
      className={cn('w-full rounded-md bg-transparent outline-none focus:bg-muted/50', className)}
    />
  );
}
