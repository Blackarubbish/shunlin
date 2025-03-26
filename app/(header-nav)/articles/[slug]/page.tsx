import Header from '@/components/header';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// 模拟文章数据
const mockArticle = {
  title: '使用Next.js和Tailwind CSS构建现代博客',
  content: `
  <h2>引言</h2>
  <p>Next.js是一个强大的React框架，它提供了许多开箱即用的功能，如服务器端渲染、静态站点生成、路由等。结合Tailwind CSS，我们可以快速构建美观且响应式的博客网站。</p>
  
  <h2>技术栈选择</h2>
  <p>在开始构建博客之前，我们需要选择合适的技术栈。对于前端框架，我选择了Next.js，因为它提供了：</p>
  <ul>
    <li>服务端渲染和静态生成，有利于SEO</li>
    <li>文件系统路由，简化了路由配置</li>
    <li>API路由，方便构建后端接口</li>
    <li>良好的开发者体验</li>
  </ul>
  
  <p>对于样式解决方案，我选择了Tailwind CSS，因为：</p>
  <ul>
    <li>使用utility-first的方式，开发速度快</li>
    <li>高度可定制，可以打造独特的设计风格</li>
    <li>内置响应式设计系统</li>
    <li>与Next.js集成简单</li>
  </ul>
  
  <h2>项目搭建</h2>
  <p>首先，我们使用create-next-app创建一个新项目，并配置Tailwind CSS：</p>
  <pre><code>npx create-next-app my-blog
cd my-blog
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>
  
  <p>然后，配置Tailwind CSS：</p>
  <pre><code>// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}</code></pre>
  
  <h2>构建博客页面</h2>
  <p>接下来，我们需要设计和实现博客的主要页面，包括：</p>
  <ul>
    <li>首页</li>
    <li>文章列表页</li>
    <li>文章详情页</li>
    <li>关于页面</li>
  </ul>
  
  <h2>添加动态功能</h2>
  <p>为博客添加动态功能，如：</p>
  <ul>
    <li>评论系统</li>
    <li>文章搜索</li>
    <li>分类和标签筛选</li>
  </ul>
  
  <h2>部署</h2>
  <p>最后，我们可以将博客部署到Vercel或其他支持Next.js的平台上。</p>
  
  <h2>结论</h2>
  <p>使用Next.js和Tailwind CSS，我们可以快速构建一个功能丰富、外观现代的博客网站。这种组合不仅提供了良好的开发体验，还能确保博客具有出色的性能和用户体验。</p>
  `,
  publishDate: '2023-12-15',
  readTime: '8 分钟',
  author: {
    name: '李顺林',
    avatar: '/img/avatar.jpg'
  },
  categories: ['Next.js', 'Tailwind CSS', '前端开发'],
  coverImage: '/img/avatar.jpg',
  relatedPosts: [
    {
      title: 'React Hooks完全指南',
      slug: 'react-hooks-guide',
      coverImage: '/img/avatar.jpg'
    },
    {
      title: 'TypeScript入门教程',
      slug: 'typescript-tutorial',
      coverImage: '/img/avatar.jpg'
    },
    {
      title: '现代CSS技巧分享',
      slug: 'modern-css-tips',
      coverImage: '/img/avatar.jpg'
    }
  ]
};

export default function ArticleDetail({ params }: { params: { slug: string } }) {
  // 实际使用时，可以通过params.slug从数据库或CMS获取文章数据
  console.log('当前文章slug:', params.slug);
  
  return (
    <>
      <Header currentPath="/articles" />
      <div className="py-14">
        <article>
          {/* 文章头部信息 */}
          <div className="mb-10">
            <h1 className="text-text mb-6 text-center text-4xl font-bold leading-tight md:text-5xl">
              {mockArticle.title}
            </h1>
            <div className="text-text-secondary mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{mockArticle.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{mockArticle.publishDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{mockArticle.readTime}</span>
              </div>
            </div>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {mockArticle.categories.map((category) => (
                <Link
                  key={category}
                  href={`/articles?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-primary-light text-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-all duration-300 hover:bg-primary hover:text-white"
                >
                  <Tag size={14} />
                  <span>{category}</span>
                </Link>
              ))}
            </div>
            <div className="relative mx-auto mb-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl">
              <Image
                src={mockArticle.coverImage}
                alt={mockArticle.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* 文章内容 */}
          <div 
            className="prose prose-lg mx-auto max-w-3xl dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: mockArticle.content }}
          />
          
          {/* 作者信息 */}
          <div className="bg-card-bg border-border mx-auto my-16 max-w-3xl rounded-xl border p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={mockArticle.author.avatar}
                  alt={mockArticle.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-text mb-2 text-xl font-bold">{mockArticle.author.name}</h3>
                <p className="text-text-secondary">
                  全栈开发者，热爱分享前端技术和开发经验。专注于React、Next.js和TypeScript等技术栈。
                </p>
              </div>
            </div>
          </div>
          
          {/* 相关文章 */}
          <div className="mx-auto max-w-5xl">
            <h2 className="text-text mb-8 text-center text-2xl font-bold">相关文章</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockArticle.relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="bg-card-bg border-border hover:border-primary group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-text group-hover:text-primary text-lg font-bold transition-colors duration-300">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
} 