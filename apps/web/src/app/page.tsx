'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Send visitors to the app; the app layout redirects to /login if signed out.
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    router.replace(token ? '/tasks' : '/login');
  }, [router]);
  return null;
}
