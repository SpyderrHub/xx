import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'QuantisAI Labs',
  description:
    'Generate realistic AI voices with advanced text-to-speech technology.',
  icons: {
    icon: '/fevicon.ico',
    shortcut: '/fevicon.ico',
    apple: '/fevicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="google-site-verification" content="m00rKo1DV2-YssOfdEk3d8NKaOgh7mFd9W3HxZDIXiQ" />
        <link rel="canonical" href="https://www.quantisai.org/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn('font-body antialiased selection:bg-primary/30', 'min-h-screen bg-background')}
      >
        <FirebaseClientProvider>
          <div className="relative flex min-h-dvh flex-col">{children}</div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
