/* eslint-disable @next/next/no-img-element */
import { avatarColor, initials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

// Shows a photo when available, otherwise a colored initials circle.
export function Avatar({ name, src, size = 24, className }: AvatarProps) {
  const style = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      style={{ ...style, backgroundColor: avatarColor(name) }}
      className={cn(
        'inline-flex items-center justify-center rounded-full text-[10px] font-semibold text-white',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

// Overlapping row of member avatars with a "+N" overflow chip.
export function MemberAvatars({
  members,
  max = 3,
  size = 22,
}: {
  members: string[];
  max?: number;
  size?: number;
}) {
  if (members.length === 0) return null;
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((m, i) => (
        <span key={i} className="rounded-full ring-2 ring-card">
          <Avatar name={m} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{ width: size, height: size }}
          className="inline-flex items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card"
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
