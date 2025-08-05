
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/hooks/use-language';
import { AuthProvider } from '@/hooks/use-auth';
import { Poppins, Open_Sans } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'SnapThePlant',
  description: 'Identify plants, insects, and more with your camera.',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-poppins',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn("font-body antialiased flex flex-col min-h-screen", poppins.variable, openSans.variable)}>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <SiteFooter />
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
