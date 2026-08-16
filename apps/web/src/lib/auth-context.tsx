'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import { AuthResponse, User } from './types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginGuest: () => Promise<void>;
  loginGoogle: (accessToken: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore the session from localStorage on first load.
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setUserState(JSON.parse(raw));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const persist = (res: AuthResponse) => {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUserState(res.user);
  };

  const loginGuest = async () => {
    persist(await api.post<AuthResponse>('/auth/guest'));
    router.push('/tasks');
  };

  const loginGoogle = async (accessToken: string) => {
    persist(await api.post<AuthResponse>('/auth/google', { accessToken }));
    router.push('/tasks');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserState(null);
    router.push('/login');
  };

  const setUser = (next: User) => {
    setUserState(next);
    localStorage.setItem('user', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginGuest, loginGoogle, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
