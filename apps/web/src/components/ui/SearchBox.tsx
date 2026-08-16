'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

// Search icon that expands into an input, then collapses when empty.
export function SearchBox({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Search">
        <Search size={15} />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        placeholder={placeholder}
        className="w-44 pl-8 sm:w-56"
      />
    </div>
  );
}
