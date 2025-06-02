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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

const POSTS_PER_PAGE = 9;

export default async function Articles({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 获取分类参数
  // eslint-disable-next-line prefer-const
  let { category, searchKey, page } = await searchParams;

  const currentPage = page ? parseInt(page as string) : 1;

  const postManager = getPostManager();
  const categories = postManager.getAllCategories();

  const categoryFilterParam: Pick<Category, 'key' | 'name' | 'count'>[] = [
    {
      key: 'all',
      name: '全部',
      count: 0
    }
  ].concat(categories);

  let allPosts: Post[] = [];
  if (!category) {
    allPosts = postManager.getAllPosts();
    category = 'all';
  } else {
    allPosts = postManager.getPostsByCategory(category as string);
  }
  categoryFilterParam[0].count = postManager.getAllPosts().length;

  if (searchKey) {
    const lowerSearchKey = (searchKey as string).toLowerCase();
    allPosts = allPosts.filter((post) => {
      const { title, excerpt } = post;
      return (
        title.toLowerCase().includes(lowerSearchKey) ||
        excerpt.toLowerCase().includes(lowerSearchKey)
      );
    });
  }

  // 计算分页
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  const isActive = (categoryKey: string) => {
    if (!category) {
      return categoryKey === 'all';
    }
    return categoryKey === category;
  };

  // 生成分页链接的辅助函数
  const generatePaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.set('category', Array.isArray(category) ? category[0] : category);
    }
    if (searchKey) {
      params.set('searchKey', Array.isArray(searchKey) ? searchKey[0] : searchKey);
    }
    if (pageNum > 1) {
      params.set('page', pageNum.toString());
    }
    const queryString = params.toString();
    return `/articles${queryString ? `?${queryString}` : ''}`;
  };

  // 生成分页数字数组
  const generatePaginationNumbers = () => {
    const numbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          numbers.push(i);
        }
        numbers.push('ellipsis');
        numbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        numbers.push(1);
        numbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          numbers.push(i);
        }
      } else {
        numbers.push(1);
        numbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          numbers.push(i);
        }
        numbers.push('ellipsis');
        numbers.push(totalPages);
      }
    }

    return numbers;
  };

  return (
    <>
      <Header currentPath="/articles" />
      <div className="flex-1">
        <div className="px-4 py-14 md:px-8 md:py-14">
          <div className="mb-6 text-center md:mb-10">
            <h1 className="text-text mb-2 text-[2.5rem] font-bold md:mb-3.5">所有文章</h1>
            <p className="text-text-secondary mx-auto my-0 max-w-[700px] text-sm md:text-[1.1rem]">
              有人在爱丽丝的仙境闲逛 有人学国王穿着新衣裳
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

          {/* 文章统计信息 */}
          {totalPosts > 0 && (
            <div className="mb-6 text-center">
              <p className="text-text-secondary text-sm">
                共找到 {totalPosts} 篇文章，当前显示第 {currentPage} 页
              </p>
            </div>
          )}

          {/* 文章列表 */}
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
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

          {/* 分页控制器 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* 上一页 */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={generatePaginationUrl(currentPage - 1)}
                        className="text-text hover:text-primary hover:bg-primary-light/50 border-border"
                      />
                    </PaginationItem>
                  )}

                  {/* 页码 */}
                  {generatePaginationNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis className="text-text-secondary" />
                      ) : (
                        <PaginationLink
                          href={generatePaginationUrl(pageNum as number)}
                          isActive={currentPage === pageNum}
                          className={cn(
                            'text-text hover:text-primary hover:bg-primary-light/50 border-border',
                            currentPage === pageNum &&
                              'bg-primary hover:bg-primary text-white hover:text-white'
                          )}>
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {/* 下一页 */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={generatePaginationUrl(currentPage + 1)}
                        className="text-text hover:text-primary hover:bg-primary-light/50 border-border"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
