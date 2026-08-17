import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo size={24} withText />
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Organize your work with Pyramid
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          A simple task manager. Plan on a board or list, set priorities and due dates, and keep
          everything in one place.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
