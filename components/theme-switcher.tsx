'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import Cookies from '@/lib/cookie';

import style from './theme-switcher.module.css';
import { usePathname } from 'next/navigation';

const btnClass =
  'w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-105 border-white shadow-md relative transition-transform duration-300 ease-in-out';

const themes = [
  {
    name: 'pink',
    color: '#ff9eb5',
    mdTheme: 'bocchi'
  },
  {
    name: 'yellow',
    color: '#ffd878',
    mdTheme: 'nijika'
  },
  {
    name: 'blue',
    color: '#78c5ff',
    mdTheme: 'ryo'
  },
  {
    name: 'red',
    color: '#ff7878',
    mdTheme: 'ikuyo'
  },
  {
    name: 'dark',
    color: '#9d4edd',
    mdTheme: 'dark-night'
  }
] as const;
type Theme = (typeof themes)[number]['name'];

export const ThemeSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0].name);

  const pathname = usePathname();

  // 主题切换函数
  const handleThemeChange = (theme: Theme) => {
    setActiveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme); // 设置到 HTML 标签
    window.localStorage.setItem('theme', theme); // 保存到 localStorage
    const markdownBody = document.querySelector('.markdown-body'); // 设置到 markdown-body

    if (markdownBody) {
      const markdownClassName = themes.find((item) => item.name === theme)?.mdTheme; // 获取主题名称
      markdownBody.className = `markdown-body theme-${markdownClassName || 'bocchi'}`; // 设置到 markdown-body
    }
    Cookies.set('theme', theme, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 设置过期时间为一年,
    });
  };

  const initTheme = () => {
    // 从 localStorage 中获取主题
    const storedTheme = window.localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      const res = themes.find((item) => item.name === storedTheme); // 检查主题是否存在
      if (!res) {
        handleThemeChange(themes[0].name); // 如果不存在，则使用默认主题
        return;
      }
      handleThemeChange(res.name); // 如果存在，则使用存储的主题
    } else {
      handleThemeChange(themes[0].name); // 默认主题
    }
    // 监听系统主题变化
  };

  useEffect(() => {
    initTheme(); // 初始化主题
  }, [pathname]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {themes.map((theme) => (
        <button
          key={theme.name}
          className={cn(
            btnClass,
            activeTheme === theme.name && style[`theme-switcher-active--${theme.name}`]
          )}
          style={{
            backgroundColor: theme.color
          }}
          data-theme={theme.name}
          onClick={() => handleThemeChange(theme.name)}></button>
      ))}
    </div>
  );
};
