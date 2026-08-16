'use client';

import { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Comment } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/lib/utils';

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => Promise<void>;
  onAddReply: (commentId: string, text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

// A single-line composer reused for comments and replies.
function Composer({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    try {
      await onSubmit(t);
      setText('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        onClick={submit}
        disabled={busy}
        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <Send size={16} />
      </button>
    </div>
  );
}

function CommentItem({
  comment,
  onAddReply,
  onDeleteComment,
}: {
  comment: Comment;
  onAddReply: (commentId: string, text: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-2">
        <Avatar name={comment.authorName} src={comment.authorAvatar} size={22} />
        <span className="text-sm font-medium">{comment.authorName}</span>
        <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
        <button
          onClick={() => onDeleteComment(comment._id)}
          className="ml-auto text-muted-foreground hover:text-red-600"
          aria-label="Delete comment"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="mt-1.5 text-sm">{comment.text}</p>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-2 border-l border-border pl-3">
          {comment.replies.map((r) => (
            <div key={r._id}>
              <div className="flex items-center gap-2">
                <Avatar name={r.authorName} src={r.authorAvatar} size={18} />
                <span className="text-xs font-medium">{r.authorName}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="mt-0.5 pl-6 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <Composer placeholder="Leave a reply…" onSubmit={(text) => onAddReply(comment._id, text)} />
      </div>
    </div>
  );
}

export function Comments({ comments, onAddComment, onAddReply, onDeleteComment }: CommentsProps) {
  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentItem
          key={c._id}
          comment={c}
          onAddReply={onAddReply}
          onDeleteComment={onDeleteComment}
        />
      ))}
      <Composer placeholder="Add a comment…" onSubmit={onAddComment} />
    </div>
  );
}
