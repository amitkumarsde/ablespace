'use client';

import { useState } from 'react';
import { Link2, Paperclip, Plus, X } from 'lucide-react';
import { Resource } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ResourcesRow({
  resources,
  onChange,
}: {
  resources: Resource[];
  onChange: (resources: Resource[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const add = () => {
    const l = label.trim();
    if (!l) return;
    onChange([...resources, { label: l, url: url.trim() }]);
    setLabel('');
    setUrl('');
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {resources.map((r, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs"
        >
          <Link2 size={12} />
          {r.url ? (
            <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">
              {r.label}
            </a>
          ) : (
            r.label
          )}
          <button onClick={() => onChange(resources.filter((_, idx) => idx !== i))}>
            <X size={11} />
          </button>
        </span>
      ))}

      {adding ? (
        <div className="flex items-center gap-1.5">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            className="h-8 w-28"
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="h-8 w-40"
          />
          <Button size="sm" onClick={add}>
            Add
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Paperclip size={13} />
          Add document or link…
          <Plus size={13} />
        </button>
      )}
    </div>
  );
}
