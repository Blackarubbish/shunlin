import Header from '@/components/header';
import { BookOpen, Code, Database, Globe, Lightbulb, PenTool } from 'lucide-react';
import Link from 'next/link';

// 模拟分类数据
const categories = [
  { name: 'JavaScript', count: 12, icon: <Code size={24} />, slug: 'javascript' },
  { name: 'React', count: 8, icon: <Globe size={24} />, slug: 'react' },
  { name: 'Node.js', count: 6, icon: <Database size={24} />, slug: 'nodejs' },
  { name: '前端开发', count: 15, icon: <PenTool size={24} />, slug: 'frontend' },
  { name: '后端开发', count: 7, icon: <BookOpen size={24} />, slug: 'backend' },
  { name: '开发心得', count: 9, icon: <Lightbulb size={24} />, slug: 'experience' }
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
              className="bg-card-bg border-border hover:border-primary group flex flex-col items-center rounded-xl border p-8 text-center transition-all duration-300 ease-in-out hover:shadow-md">
              <div className="text-primary bg-primary-light group-hover:bg-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ease-in-out group-hover:text-white">
                {category.icon}
              </div>
              <h2 className="text-text mb-2 text-xl font-bold">{category.name}</h2>
              <p className="text-text-secondary mb-0">{category.count} 篇文章</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
