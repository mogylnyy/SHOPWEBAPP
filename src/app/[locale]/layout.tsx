
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css'; // Adjusted path if globals.css is in src/app
import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/layout/AppShell';
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuickBuy TG',
  description: 'Quickly buy digital goods and services.',
};

// This function generates static paths for all supported locales.
// Since we only have 'ru', it will only generate for 'ru'.
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  return (
    <html lang={params.locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
