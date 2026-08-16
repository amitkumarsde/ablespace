import { Tag } from 'lucide-react';

export function LabelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
      <Tag size={11} />
      {label}
    </span>
  );
}
