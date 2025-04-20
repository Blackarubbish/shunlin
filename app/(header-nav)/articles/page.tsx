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
  searchParams: { [key: string]: string | string[] | undefined };
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
              <SearchInput />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="bg-card-bg text-text border-border hover:border-primary flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 transition-all duration-300 ease-in-out">
                    {categoryFilterParam.find((i) => {
                      return i.key === (category ?? 'all');
                    })?.name || '分类'}
                    <ChevronDown size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0">
                  <div className="p-2">
                    {categoryFilterParam.map((c) => (
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
            {posts.length > 0 ? (
              posts.map((p) => <ArticleCard key={p.slug} post={p} />)
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
