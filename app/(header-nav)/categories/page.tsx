import Header from '@/components/header';
import { BookOpen, Code, Database, Globe, Lightbulb, PenTool } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// 模拟分类数据 (添加封面图片)
// 模拟分类数据 (添加封面图片和描述)
const categories = [
  {
    name: 'JavaScript',
    count: 12,
    icon: <Code size={24} />,
    slug: 'javascript',
    description: 'Web开发中最流行的编程语言，前端开发的基础。',
    coverImage: '/images/categories/javascript.jpg'
  },
  {
    name: 'React',
    count: 8,
    icon: <Globe size={24} />,
    slug: 'react',
    description: '用于构建用户界面的JavaScript库，专注于组件化开发。',
    coverImage: '/images/categories/react.jpg'
  },
  {
    name: 'Node.js',
    count: 6,
    icon: <Database size={24} />,
    slug: 'nodejs',
    description: '基于Chrome V8引擎的JavaScript运行环境，用于服务端开发。',
    coverImage: '/images/categories/nodejs.jpg'
  },
  {
    name: '前端开发',
    count: 15,
    icon: <PenTool size={24} />,
    slug: 'frontend',
    description: '创建网站用户界面和交互体验的技术与实践。',
    coverImage: '/images/categories/frontend.jpg'
  },
  {
    name: '后端开发',
    count: 7,
    icon: <BookOpen size={24} />,
    slug: 'backend',
    description: '处理服务器端逻辑、数据库和API的技术栈。',
    coverImage: '/images/categories/backend.jpg'
  },
  {
    name: '开发心得',
    count: 9,
    icon: <Lightbulb size={24} />,
    slug: 'experience',
    description: '分享编程过程中的经验、教训和实用技巧。',
    coverImage: '/images/categories/experience.jpg'
  }
];
export default function Categories() {
  return (
    <>
      <Header currentPath="/categories" />
      <div className="py-14">
        <div className="mb-10 text-center">
          <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">文章分类</h1>
          <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
            在这里浏览所有的文章分类，找到你感兴趣的内容
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/articles?category=${category.slug}`}
              className="group overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image
                  src={category.coverImage || '/images/categories/default.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              </div>

              <div className="bg-card-bg relative p-5">
                <div className="border-card-bg bg-primary absolute -top-8 right-5 flex h-16 w-16 items-center justify-center rounded-full border-4 text-white shadow-md">
                  {category.icon}
                </div>

                <h2 className="text-text mb-1 text-xl font-bold">{category.name}</h2>
                <p className="text-text-secondary mb-2 flex items-center text-sm">
                  <BookOpen size={16} className="mr-1" />
                  {category.count} 篇文章
                </p>

                {/* 添加描述信息 */}
                <p className="text-text-secondary mt-2 line-clamp-2 border-t border-gray-100 pt-2 text-sm">
                  {category.description || `关于${category.name}的文章集合`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
