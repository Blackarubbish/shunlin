'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import Cookies from '@/lib/cookie';
import { ChevronUp, ChevronDown } from 'lucide-react';

import style from './theme-switcher.module.css';
import { usePathname } from 'next/navigation';

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
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0].name); // 默认主题为 pink
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // 主题切换函数
  const handleThemeChange = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme); // 设置到 HTML 标签
    window.localStorage.setItem('theme', theme); // 保存到 localStorage
    setActiveTheme(theme);
    const markdownBody = document.querySelector('.markdown-body'); // 设置到 markdown-body

    if (markdownBody) {
      const markdownClassName = themes.find((item) => item.name === theme)?.mdTheme; // 获取主题名称
      markdownBody.className = `markdown-body theme-${markdownClassName || 'bocchi'}`; // 设置到 markdown-body
    }
    Cookies.set('theme', theme, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 设置过期时间为一年,
    });

    // 选择新主题后自动折叠（在移动视图）
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
  };

  useEffect(() => {
    initTheme(); // 初始化主题

    // 在较大屏幕上默认展开
    if (window.innerWidth >= 768) {
      setIsExpanded(true);
    }

    // 监听页面路径变化，折叠主题切换器（仅限移动设备）
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        'fixed z-40 transition-all duration-300',
        'md:top-5 md:right-5 md:flex md:flex-col md:gap-2',
        'right-5 bottom-5',
        style.themeSwitcherContainer
      )}>
      {/* 移动端的折叠/展开切换按钮 */}
      <div
        className="mb-2 flex items-center justify-center md:hidden"
        onClick={toggleExpand}>
        {isExpanded ? (
          <ChevronDown className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <ChevronUp className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </div>

      {/* 主题按钮 */}
      <div
        className={cn(
          'flex transition-all duration-300',
          'md:flex-col',
          isExpanded ? 'flex-row gap-2' : 'flex-row-reverse'
        )}>
        {themes.map((theme) => (
          <button
            key={theme.name}
            className={cn(
              'relative cursor-pointer border-2 shadow-md transition-all duration-300 ease-in-out',
              'h-10 w-10 rounded-full border-white md:h-8 md:w-8', // 移动端更大的触摸区域
              'hover:scale-105 active:scale-95', // 触摸反馈
              isExpanded || theme.name === activeTheme
                ? 'visible opacity-100'
                : 'invisible h-0 w-0 border-0 opacity-0',
              activeTheme === theme.name && style[`theme-switcher-active--${theme.name}`]
            )}
            style={{
              backgroundColor: theme.color
            }}
            data-theme={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            aria-label={`Switch to ${theme.name} theme`}
          />
        ))}
      </div>
    </div>
  );
};
