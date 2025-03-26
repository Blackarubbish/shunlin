import Header from '@/components/header';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDown, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import ArticleCard from '@/components/post-card';

// 模拟文章数据
const mockArticles = [
  {
    title: '使用Next.js和Tailwind CSS构建现代博客',
    slug: 'building-modern-blog-with-nextjs-and-tailwindcss',
    coverImage: '/img/avatar.jpg',
    excerpt:
      'Next.js是一个强大的React框架，它提供了许多开箱即用的功能，如服务器端渲染、静态站点生成、路由等。结合Tailwind CSS，我们可以快速构建美观且响应式的博客网站。',
    publishDate: '2023-12-15',
    tags: ['Next.js', 'Tailwind CSS', '前端开发'],
    category: '前端开发'
  },
  {
    title: 'React Hooks完全指南',
    slug: 'react-hooks-complete-guide',
    coverImage: '/img/avatar.jpg',
    excerpt:
      'React Hooks是React 16.8引入的新特性，它允许在不编写类组件的情况下使用状态和其他React特性。本文将深入探讨React Hooks的使用方法和最佳实践。',
    publishDate: '2023-11-20',
    tags: ['React', 'JavaScript', '前端开发'],
    category: 'React'
  },
  {
    title: 'TypeScript入门教程',
    slug: 'typescript-tutorial-for-beginners',
    coverImage: '/img/avatar.jpg',
    excerpt:
      'TypeScript是JavaScript的超集，添加了类型系统和其他一些特性。本文将介绍TypeScript的基础知识和如何在项目中使用它来提高代码质量。',
    publishDate: '2023-10-05',
    tags: ['TypeScript', 'JavaScript', '编程语言'],
    category: 'JavaScript'
  },
  {
    title: '现代CSS技巧分享',
    slug: 'modern-css-tips-and-tricks',
    coverImage: '/img/avatar.jpg',
    excerpt:
      'CSS在近年来发展迅速，新特性不断涌现。本文将分享一些现代CSS技巧，帮助你编写更简洁、更强大的样式代码。',
    publishDate: '2023-09-18',
    tags: ['CSS', '前端开发', 'Web设计'],
    category: '前端开发'
  },
  {
    title: 'Node.js后端开发实践',
    slug: 'nodejs-backend-development-practices',
    coverImage: '/img/avatar.jpg',
    excerpt:
      'Node.js是一个强大的JavaScript运行时，适用于构建后端服务和API。本文将分享Node.js后端开发的最佳实践和常见陷阱。',
    publishDate: '2023-08-30',
    tags: ['Node.js', '后端开发', 'JavaScript'],
    category: 'JavaScript'
  },
  {
    title: '响应式设计原则与实践',
    slug: 'responsive-design-principles-and-practices',
    coverImage: '/img/avatar.jpg',
    excerpt:
      '响应式设计是现代Web开发的重要部分，它确保网站在各种设备上都能提供良好的用户体验。本文将介绍响应式设计的核心原则和实现技巧。',
    publishDate: '2023-08-12',
    tags: ['响应式设计', 'CSS', 'Web设计'],
    category: '前端开发'
  }
];

export default async function Articles({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 获取分类参数
  const categoryParam = searchParams.category;
  console.log('当前分类:', categoryParam);

  // 根据分类过滤文章
  const filteredArticles = categoryParam
    ? mockArticles.filter((article) =>
        categoryParam === 'all' ? true : article.category === categoryParam
      )
    : mockArticles;

  const isActive = (categoryKey: string) => {
    if (!categoryParam) {
      return categoryKey === 'all';
    }
    return categoryKey === categoryParam;
  };

  return (
    <>
      <Header currentPath="/articles" />
      <div className="min-h-[cal(100vh-84px)]">
        <div className="py-14">
          <div className="mb-10 text-center">
            <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">所有文章</h1>
            <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
              我可不是乱写的嗷, 这些都是我的精华
            </p>
          </div>
          <div className="mb-10 flex gap-3.5">
            <div className="relative min-w-[300px] flex-1">
              <SearchIcon className="text-text-tertiary absolute top-1/2 left-[15px] -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索文章..."
                className="bg-input-bg text-text border-border focus:border-primary focus:ring-primary w-full rounded-full border py-3 pr-5 pl-[45px] transition-all duration-300 ease-in-out focus:ring-1 focus:outline-none"
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="bg-card-bg text-text border-border hover:border-primary flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 transition-all duration-300 ease-in-out">
                    分类
                    <ChevronDown size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <div className="p-2">
                    {[
                      {
                        name: '全部',
                        count: mockArticles.length,
                        key: 'all'
                      },
                      {
                        name: 'Next.js',
                        count: mockArticles.filter((a) => a.category === 'Next.js')
                          .length,
                        key: 'next.js'
                      },
                      {
                        name: 'React',
                        count: mockArticles.filter((a) => a.category === 'React').length,
                        key: 'react'
                      },
                      {
                        name: 'JavaScript',
                        count: mockArticles.filter((a) => a.category === 'JavaScript')
                          .length,
                        key: 'javascript'
                      },
                      {
                        name: '前端开发',
                        count: mockArticles.filter((a) => a.category === '前端开发')
                          .length,
                        key: '前端开发'
                      }
                    ].map((c) => (
                      <div
                        key={c.key}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-lg px-4 py-2 font-semibold transition-colors duration-300 ease-in-out',
                          isActive(c.key)
                            ? 'bg-primary-light text-primary'
                            : 'hover:bg-primary-light/50 hover:text-primary'
                        )}>
                        <Link
                          className="flex-1"
                          href={
                            c.key === 'all' ? '/articles' : `/articles?category=${c.key}`
                          }>
                          {c.name}
                          <span className="ml-1 text-sm opacity-70">({c.count})</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 文章列表 */}
          <div className="-mb-12 mb-3 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <div key={index} className="pt-3">
                  <ArticleCard article={article} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <h2 className="text-text mb-2 text-xl font-semibold">没有找到相关文章</h2>
                <p className="text-text-secondary">尝试更换分类或清除搜索条件</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
