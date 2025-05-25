import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { initializePostManager } from '@/lib/docs-manager';
import { appConfig } from '@/app-config';
import { ThemeSwitcher } from '@/components/theme-switcher';

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
  // const cookieStore = await cookies();
  // const theme = cookieStore.get('theme')?.value || 'pink';
  // console.log('Current theme from cookies:', theme);
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 修复主题闪烁的情况 */}
        <script id="theme-init">
          {`
            try {
                // 优先使用 localStorage，然后是 cookie
                const storedTheme = 
                  localStorage.getItem('theme') || 
                  document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] || 
                  'pink';                
                // 确保主题立即生效，避免闪烁
                document.documentElement.setAttribute('data-theme', storedTheme);
              } catch (e) {
                console.error('Theme initialization error:', e);
              }
          `}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
