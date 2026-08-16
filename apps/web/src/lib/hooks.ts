'use client';

import { useEffect, useState } from 'react';

// State saved in localStorage so it survives refresh.
export function useLocalState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setState(JSON.parse(raw) as T);
      } catch {
        /* ignore malformed value */
      }
    }
  }, [key]);

  const set = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, set];
}
