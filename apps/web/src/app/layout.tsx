import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pyramid - Task Management',
  description: 'A simple, themeable task management app.',
};

// Apply the saved theme before paint to avoid a flash.
const themeScript = `(function(){try{var m=localStorage.getItem('theme');var a=localStorage.getItem('accent')||'blue';if(m==='dark')document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
