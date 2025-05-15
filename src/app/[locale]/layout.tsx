import type { Metadata } from 'next';
// Removed font imports as they are now in the root src/app/layout.tsx
// import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css'; // Path to globals.css
// Toaster is moved to the root src/app/layout.tsx
// import { Toaster } from '@/components/ui/toaster';
import AppShell from '@/components/layout/AppShell';
import type { Locale } from '@/lib/i18n-config';
import { i18n } from '@/lib/i18n-config';

// Font variables are applied in src/app/layout.tsx
// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// Metadata can still be defined here to be specific to the locale segment if needed,
// or it can be primarily handled by src/app/layout.tsx.
// For simplicity, the main title/description are in src/app/layout.tsx.
// export const metadata: Metadata = {
//   title: 'QuickBuy TG Locale',
//   description: 'Quickly buy digital goods and services in a specific locale.',
// };

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ // Changed name for clarity, was RootLayout
  children,
  params, // params is available but lang is set in src/app/layout.tsx
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  // This layout no longer renders <html> or <body> tags.
  // It provides the AppShell which will be placed inside the <body>
  // rendered by src/app/layout.tsx.
  return (
    <AppShell>{children}</AppShell>
    // Toaster is moved to the root layout to ensure it's only rendered once.
  );
}
