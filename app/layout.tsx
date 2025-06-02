import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { initializePostManager } from '@/lib/docs-manager';
import { appConfig } from '@/app-config';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { BackToTop } from '@/components/back-to-top';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),
  title: appConfig.title,
  description: appConfig.description,
  keywords: [
    'Shunlin',
    '前端开发',
    'React',
    'TypeScript',
    'Node.js',
    'Golang',
    '个人博客',
    '技术文章',
    'Web开发',
    '软件工程'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website', // 内容类型：网站
    locale: 'zh_CN', // 语言区域：简体中文
    url: appConfig.siteUrl, // 网站URL
    title: appConfig.title, // 分享标题
    description: appConfig.description, // 分享描述
    siteName: appConfig.title || 'Shunlin', // 网站名称
    images: [
      {
        url: appConfig.me.avatar,
        width: 1200,
        height: 630,
        alt: `${appConfig.me.name}的头像`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
    images: [appConfig.me.avatar]
  },
  category: '个人博客'
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
        <BackToTop />
      </body>
    </html>
  );
}
