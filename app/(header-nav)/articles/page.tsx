import Header from '@/components/header';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDown, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import ArticleCard from '@/components/post-card';
import { getPostManager } from '@/lib/docs-manager';
import { Category, Post } from '@/types';
import SearchInput from './input';

export default async function Articles({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 获取分类参数
  // eslint-disable-next-line prefer-const
  let { category, searchKey } = await searchParams;

  const postManager = await getPostManager();
  const categories = postManager.getAllCategories();

  const categoryFilterParam: Pick<Category, 'key' | 'name' | 'count'>[] = [
    {
      key: 'all',
      name: '全部',
      count: 0
    }
  ].concat(categories);

  let posts: Post[] = [];
  if (!category) {
    posts = postManager.getAllPosts();
    category = 'all';
  } else {
    posts = postManager.getPostsByCategory(category as string);
  }
  categoryFilterParam[0].count = postManager.getAllPosts().length;

  if (searchKey) {
    const lowerSearchKey = (searchKey as string).toLowerCase();
    posts = posts.filter((post) => {
      const { title, excerpt } = post;
      return (
        title.toLowerCase().includes(lowerSearchKey) ||
        excerpt.toLowerCase().includes(lowerSearchKey)
      );
    });
  }

  const isActive = (categoryKey: string) => {
    if (!category) {
      return categoryKey === 'all';
    }
    return categoryKey === category;
  };

  return (
    <>
      <Header currentPath="/articles" />
      <div className="flex-1">
        <div className="px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6 text-center md:mb-10">
            <h1 className="text-text mb-2 text-2xl font-bold md:mb-3.5 md:text-[2.5rem]">
              所有文章
            </h1>
            <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-sm md:text-[1.1rem]">
              每一次闭上了眼就想到了你，你像一句美丽的口号挥不去
            </p>
          </div>

          {/* 移动端优化：垂直布局搜索和筛选 */}
          <div className="mb-6 flex flex-col gap-3 md:mb-10 md:flex-row md:gap-3.5">
            <div className="relative w-full">
              <SearchIcon className="text-text-tertiary absolute top-1/2 left-[15px] -translate-y-1/2" />
              <SearchInput />
            </div>
            <div className="w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="bg-card-bg text-text border-border hover:border-primary flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border px-5 py-2.5 transition-all duration-300 ease-in-out md:w-auto md:justify-start">
                    <span className="truncate">
                      {categoryFilterParam.find((i) => {
                        return i.key === (category ?? 'all');
                      })?.name || '分类'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0 md:w-56"
                  align="center"
                  side="bottom">
                  <div className="max-h-[50vh] overflow-auto p-2 md:max-h-[400px]">
                    {categoryFilterParam.map((c) => (
                      <div
                        key={c.key}
                        className={cn(
                          'flex cursor-pointer items-center gap-2.5 rounded-lg px-4 py-2.5 font-semibold transition-colors duration-300 ease-in-out md:py-2',
                          isActive(c.key)
                            ? 'bg-primary-light text-primary'
                            : 'hover:bg-primary-light/50 hover:text-primary'
                        )}>
                        <Link
                          className="flex-1 truncate"
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
          <div className="-mb-12 mb-3 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((p) => <ArticleCard key={p.slug} post={p} />)
            ) : (
              <div className="col-span-full py-8 text-center md:py-12">
                <h2 className="text-text mb-2 text-lg font-semibold md:text-xl">
                  没有找到相关文章
                </h2>
                <p className="text-text-secondary text-sm md:text-base">
                  尝试更换分类或清除搜索条件
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
