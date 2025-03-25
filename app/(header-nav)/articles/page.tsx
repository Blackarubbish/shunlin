import Header from '@/components/header';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { ChevronDown, SearchIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Articles({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 获取分类参数
  const categoryParam = searchParams.category;
  console.log('当前分类:', categoryParam);

  const isActive = (categoryKey: string) => {
    if (!categoryParam) {
      return categoryKey === 'all';
    }
    return categoryKey === categoryParam;
  };
  return (
    <>
      <Header currentPath="/articles" />
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
                      count: 10,
                      icon: 'all',
                      key: 'all'
                    },
                    {
                      name: 'JavaScript',
                      count: 10,
                      icon: 'javascript',
                      key: 'javascript1'
                    },
                    {
                      name: 'JavaScript',
                      count: 10,
                      icon: 'javascript',
                      key: 'javascript2'
                    },
                    {
                      name: 'JavaScript',
                      count: 10,
                      icon: 'javascript',
                      key: 'javascript3'
                    },
                    {
                      name: 'JavaScript',
                      count: 10,
                      icon: 'javascript',
                      key: 'javascript4'
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
                      <Link className="flex-1" href={`/articles?category=${c.key}`}>
                        {c.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
