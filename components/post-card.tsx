import { Article } from '@/types';
import Image from 'next/image';
import { CalendarFilled, ArrowRightOutlined, TagOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface Props {
  article: Article;
}

export default function PostCard({ article }: Props) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="bg-card-bg shadow-card group hover:border-primary relative top-0 flex flex-col overflow-hidden rounded-2xl border-b-[3px] border-transparent text-left transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:border-b-[3px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={article.coverImage || '/img/avatar.jpg'}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          alt={article.title || 'Article cover'}
          width={600}
          height={400}
        />
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-white shadow-md">
            {article.category}
          </span>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-6">
        <h3 className="text-text group-hover:text-primary mb-3 line-clamp-2 text-xl font-bold transition-colors duration-300">
          {article.title}
        </h3>

        <p className="text-text-secondary mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
          {article.excerpt}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="text-text-secondary flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs">
                <TagOutlined className="text-primary mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-text-tertiary flex items-center text-xs">
            <CalendarFilled className="text-primary mr-1.5" />
            {article.publishDate}
          </span>

          <span className="text-primary flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-3">
            阅读全文
            <ArrowRightOutlined className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
