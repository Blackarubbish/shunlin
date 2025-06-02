import Header from '@/components/header';
import Link from 'next/link';
import Image from 'next/image';
import { getPostManager } from '@/lib/docs-manager';
import { Icon, ICON_MAP, IconName } from '@/components/icons';
import { BookOpen } from 'lucide-react';
import { appConfig } from '@/app-config';

// 强制页面使用静态生成
export const dynamic = 'force-static';

// 可选：添加生成元数据
export const metadata = {
  title: '文章分类 | ' + appConfig.title,
  description: '浏览所有文章分类，找到你感兴趣的内容'
};

export default async function Categories() {
  const blogManager = getPostManager();

  const categories = blogManager.getAllCategories();

  const renderIcon = (iconKey: string) => {
    if (iconKey in ICON_MAP) {
      return <Icon size={26} iconKey={iconKey as IconName} strokeWidth={3} />;
    }
    return <Icon size={26} iconKey="Book" strokeWidth={3} />;
  };
  return (
    <>
      <Header currentPath="/categories" />
      <div className="flex-1 py-14">
        <div className="mb-10 text-center">
          <h1 className="text-text mb-3.5 text-[2.5rem] font-bold">文章分类</h1>
          <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-[1.1rem]">
            春天的风，鲜艳了吗？美丽了吗？不见了吧
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/articles?category=${category.key}`}
              className="group overflow-hidden rounded-xl border border-gray-100 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image
                  src={category.coverImage}
                  alt={category.name}
                  fill
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/20" /> */}
              </div>

              <div className="bg-card-bg relative p-5">
                <div className="border-card-bg bg-primary absolute -top-8 right-5 flex h-16 w-16 items-center justify-center rounded-full border-4 text-white shadow-md">
                  {renderIcon(category.icon || 'Book')}
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
