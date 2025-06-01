import { Post } from '@/types';
import PostCard from '../post-card';
import Link from 'next/link';

interface Props {
  posts: Post[];
}
export default function FeaturedPosts({ posts }: Props) {
  return (
    <div className="py-14 text-center">
      <h2 className="text-text after:bg-primary after:border-radius-[2px] relative mb-10 inline-block text-[2rem] font-bold after:absolute after:bottom-[-10px] after:left-1/2 after:h-[4px] after:w-[60px] after:transform-[translateX(-50%)] after:content-['']">
        精选文章
      </h2>
      <div className="animate-scroll-container hidden overflow-x-hidden px-4 py-8 lg:flex">
        <div className="animate-scroll-right-to-left flex">
          {posts.slice(0, 9).map((p) => (
            <div key={p.slug} className="flex-shrink-0 px-4">
              <div className="w-[350px]">
                <PostCard post={p} />
              </div>
            </div>
          ))}
        </div>
        <div className="animate-scroll-right-to-left flex">
          {posts.slice(0, 9).map((p) => (
            <div key={`duplicate-${p.slug}`} className="flex-shrink-0 px-4">
              <div className="w-[350px]">
                <PostCard post={p} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px] lg:hidden">
        {posts.slice(0, 4).map((p) => (
          <PostCard post={p} key={p.slug} />
        ))}
      </div>
      <div className="relative mt-2 h-14">
        <Link
          href="/articles"
          className="text-primary border-primary hover:bg-primary inline-flex items-center justify-center gap-2 rounded-3xl border-2 px-6 py-3 font-semibold transition-all duration-300 hover:text-white">
          查看更多文章
        </Link>
      </div>
    </div>
  );
}
