'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { GoogleIcon } from '@/components/ui/GoogleIcon';
import { useAuth } from '@/lib/auth-context';

interface TokenResponse {
  access_token?: string;
  error?: string;
}

interface TokenClient {
  requestAccessToken: () => void;
}

interface GoogleOAuth {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }): TokenClient;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleOAuth;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginGuest, loginGoogle } = useAuth();
  const [loading, setLoading] = useState<'guest' | 'google' | null>(null);
  const [error, setError] = useState('');
  const tokenClient = useRef<TokenClient | null>(null);

  // If already signed in, go straight to the app.
  useEffect(() => {
    if (user) router.replace('/tasks');
  }, [user, router]);

  const initGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    tokenClient.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (response) => {
        if (!response.access_token) {
          setError('Google sign-in was cancelled.');
          setLoading(null);
          return;
        }
        try {
          await loginGoogle(response.access_token);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Google sign-in failed.');
          setLoading(null);
        }
      },
    });
  };

  const handleGuest = async () => {
    setError('');
    setLoading('guest');
    try {
      await loginGuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not continue as guest.');
      setLoading(null);
    }
  };

  const handleGoogle = () => {
    setError('');
    if (!GOOGLE_CLIENT_ID) {
      setError('Google login is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to use it.');
      return;
    }
    if (!tokenClient.current) initGoogle();
    if (!tokenClient.current) {
      setError('Google sign-in is still loading. Please try again.');
      return;
    }
    setLoading('google');
    tokenClient.current.requestAccessToken();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Script src="https://accounts.google.com/gsi/client" onLoad={initGoogle} />

      <div className="mb-6 flex justify-center">
        <Logo size={26} withText />
      </div>

      <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-lg font-semibold">Let&apos;s get back on track</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Enter your email below to login to your account.
        </p>

        <div className="mt-5 space-y-2.5">
          <Button
            onClick={handleGuest}
            disabled={loading !== null}
            className="w-full rounded-full"
          >
            {loading === 'guest' ? 'Signing in…' : 'Continue as Guest'}
          </Button>

          <Button
            variant="outline"
            onClick={handleGoogle}
            disabled={loading !== null}
            className="w-full rounded-full"
          >
            <GoogleIcon />
            {loading === 'google' ? 'Connecting…' : 'Login with Google'}
          </Button>
        </div>

        {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
      </div>

      <p className="mt-6 max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <span className="underline">Terms of Service</span> and{' '}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
}
