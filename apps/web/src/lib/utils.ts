// Join truthy class names.
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Get initials from a name, e.g. "QA Team" -> "QT".
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Pick a stable color for a name.
export function avatarColor(name: string) {
  let sum = 0;
  for (const char of name) sum += char.charCodeAt(0);
  return `hsl(${sum % 360} 65% 55%)`;
}

// Format a date as "12 Sep" or "12 Sep 2026".
export function formatDate(date?: string | null, withYear = false) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

// Format an ISO date for a date input (YYYY-MM-DD).
export function toDateInput(iso?: string | null) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : '';
}

// Short "time ago" label, e.g. "3h ago".
export function timeAgo(date?: string | null) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
