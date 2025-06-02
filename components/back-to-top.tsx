'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import { ChevronUp, Sparkles } from 'lucide-react';

import style from './back-to-top.module.css';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // 监听滚动位置
  useEffect(() => {
    const toggleVisibility = () => {
      // 当滚动超过 300px 时显示按钮
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    setIsClicked(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 重置点击动画状态
    setTimeout(() => {
      setIsClicked(false);
    }, 600);
  };

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-500 ease-out',
        'right-10 bottom-20 md:bottom-10',
        'transform-gpu', // 启用硬件加速
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-16 scale-75 opacity-0',
        style.backToTopContainer
      )}>
      <button
        onClick={scrollToTop}
        className={cn(
          'group relative cursor-pointer overflow-hidden',
          'h-14 w-14 md:h-12 md:w-12',
          'rounded-full shadow-lg',
          'border-2 border-white/50',
          'transition-all duration-300 ease-out',
          'hover:scale-110 active:scale-95',
          'focus:ring-primary/20 focus:ring-4 focus:outline-none',
          style.backToTopButton,
          isClicked && style.backToTopClicked
        )}
        style={{
          backgroundColor: 'var(--primary-color)',
          boxShadow: 'var(--card-shadow)'
        }}
        aria-label="回到顶部">
        {/* 背景动效 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-br from-white/20 to-transparent',
            'transition-opacity duration-300',
            'opacity-60 group-hover:opacity-100'
          )}
        />

        {/* 粒子效果背景 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            style.sparkleEffect,
            isClicked && style.sparkleActive
          )}>
          <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/60" />
          <Sparkles className="absolute bottom-1 left-1 h-2 w-2 text-white/40" />
        </div>

        {/* 主图标 */}
        <div
          className={cn(
            'relative z-10 flex h-full w-full items-center justify-center',
            'transition-transform duration-300',
            'group-hover:-translate-y-0.5',
            isClicked && 'animate-bounce'
          )}>
          <ChevronUp
            className={cn(
              'h-6 w-6 text-white md:h-5 md:w-5',
              'transition-all duration-300',
              'group-hover:scale-110',
              style.chevronIcon
            )}
          />
        </div>

        {/* 涟漪效果 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'transition-all duration-700',
            style.rippleEffect,
            isClicked && style.rippleActive
          )}
        />
      </button>

      {/* 提示文本 */}
      <div
        className={cn(
          'absolute top-1/2 right-full mr-3 -translate-y-1/2',
          'rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white',
          'pointer-events-none translate-x-2 opacity-0',
          'transition-all duration-300',
          'group-hover:translate-x-0 group-hover:opacity-100',
          'whitespace-nowrap',
          'hidden md:block'
        )}>
        回到顶部
        <div className="absolute top-1/2 left-full h-0 w-0 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-black/80" />
      </div>
    </div>
  );
};
