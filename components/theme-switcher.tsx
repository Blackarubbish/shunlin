'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import style from './theme-switcher.module.css';

const btnClass =
  'w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-105 border-white shadow-md relative transition-transform duration-300 ease-in-out';

const themes = [
  {
    name: 'pink',
    color: '#ff9eb5'
  },
  {
    name: 'yellow',
    color: '#ffd878'
  },
  {
    name: 'blue',
    color: '#78c5ff'
  },
  {
    name: 'red',
    color: '#ff7878'
  },
  {
    name: 'dark',
    color: '#9d4edd'
  }
] as const;
type Theme = (typeof themes)[number]['name'];

export const ThemeSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0].name);
  // 主题切换函数
  const handleThemeChange = (theme: Theme) => {
    setActiveTheme(theme);
    document.documentElement.setAttribute('data-theme', theme); // 设置到 HTML 标签
    window.localStorage.setItem('theme', theme); // 保存到 localStorage
  };

  useEffect(() => {
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
  }, []);

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
