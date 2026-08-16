'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="w-48 shrink-0 text-right">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: '', title: '', username: '', avatarUrl: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load the full profile (guests may not have title/username in context).
  useEffect(() => {
    api
      .get<User>('/users/me')
      .then((u) =>
        setForm({
          name: u.name || '',
          title: u.title || '',
          username: u.username || '',
          avatarUrl: u.avatarUrl || '',
        }),
      )
      .catch(() => {});
  }, []);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.patch<User>('/users/me', form);
      setUser(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-xl font-semibold">Profile</h1>

      <div className="divide-y divide-border rounded-xl border border-border px-5">
        <Row label="Profile picture">
          <div className="flex items-center justify-end gap-2">
            <Input
              value={form.avatarUrl}
              onChange={(e) => set('avatarUrl', e.target.value)}
              placeholder="Image URL"
              className="h-8"
            />
            <Avatar name={form.name || 'Guest'} src={form.avatarUrl} size={36} />
          </div>
        </Row>

        <Row label="Email">
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
            {user?.email || 'No email (guest)'}
            <Pencil size={14} />
          </div>
        </Row>

        <Row label="Full name">
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
        </Row>

        <Row label="Title" hint="Your job title or role">
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Designer" />
        </Row>

        <Row label="Username" hint="One word, like a nickname or first name">
          <Input
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            placeholder="username"
          />
        </Row>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Workspace access</h2>
      <div className="flex items-center justify-between rounded-xl border border-border p-5">
        <span className="text-sm text-muted-foreground">Remove yourself from the workspace</span>
        <Button variant="danger" onClick={logout}>
          Leave Workspace
        </Button>
      </div>
    </div>
  );
}
