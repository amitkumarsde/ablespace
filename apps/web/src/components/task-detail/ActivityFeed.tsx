'use client';

import { Update } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/lib/utils';

export function ActivityFeed({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {[...updates].reverse().map((u) => (
        <div key={u._id} className="flex gap-2">
          <Avatar name={u.actorName} src={u.actorAvatar} size={20} />
          <p className="text-sm leading-snug">
            <span className="font-medium">{u.actorName}</span>{' '}
            <span className="text-muted-foreground">{u.text}</span>{' '}
            <span className="text-xs text-muted-foreground">· {timeAgo(u.createdAt)}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
