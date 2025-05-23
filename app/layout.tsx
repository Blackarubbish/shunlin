import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { initializePostManager } from '@/lib/docs-manager';
import { appConfig } from '@/app-config';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description
};

await initializePostManager(appConfig.srcDir);

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'pink';
  return (
    <html lang="zh-CN" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ThemeSwitcher currentTheme={theme} />
      </body>
    </html>
  );
}
