'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AccentKey } from './constants';

type Mode = 'light' | 'dark';

interface ThemeContextValue {
  mode: Mode;
  accent: AccentKey;
  setMode: (mode: Mode) => void;
  setAccent: (accent: AccentKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('light');
  const [accent, setAccentState] = useState<AccentKey>('blue');

  // Sync React state with what the no-flash script already applied.
  useEffect(() => {
    const storedMode = (localStorage.getItem('theme') as Mode) || 'light';
    const storedAccent = (localStorage.getItem('accent') as AccentKey) || 'blue';
    setModeState(storedMode);
    setAccentState(storedAccent);
  }, []);

  const setMode = (next: Mode) => {
    setModeState(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const setAccent = (next: AccentKey) => {
    setAccentState(next);
    localStorage.setItem('accent', next);
    document.documentElement.setAttribute('data-accent', next);
  };

  return (
    <ThemeContext.Provider value={{ mode, accent, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
