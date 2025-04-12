import { Post } from '@/types';
import Image from 'next/image';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <div className="bg-card-bg shadow-card group hover:border-primary relative top-0 flex flex-col overflow-hidden rounded-2xl border-b-[3px] border-transparent text-left transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:border-b-[3px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={post.coverImage || '/img/avatar.jpg'}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          alt={post.title || 'Article cover'}
          width={600}
          height={400}
        />
        <div className="absolute right-3 bottom-3">
          <Link
            href={`/categories/`}
            className="bg-primary rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-white shadow-md">
            {post.category.name}
          </Link>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-text group-hover:text-primary group/head relative mb-3 line-clamp-2 text-xl font-bold transition-colors duration-300">
          <Link href={`/articles/${post.slug}`} className="relative inline-block">
            {post.title}
            <span className="bg-primary absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover/head:w-full"></span>
          </Link>
        </h3>

        <p className="text-text-secondary mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                href={`/tags/${tag}`}
                key={index}
                className="bg-tag flex items-center rounded-md px-2 py-1 text-xs">
                <Tag size={14} className="text-primary mr-1" />
                <span className="text-text-secondary">{tag}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-text-tertiary flex items-center text-xs">
            <Calendar size={24} className="text-primary mr-1.5" />
            {post.publishDate}
          </span>

          <Link
            href={`/articles/${post.slug}`}
            className="text-primary group group/link flex items-center gap-1.5 text-sm font-semibold transition-all duration-300">
            阅读全文
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
