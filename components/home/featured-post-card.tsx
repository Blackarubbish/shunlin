import { Article } from '@/types';
import Image from 'next/image';
import { CalendarFilled, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { appConfig } from '@/app-config';

interface Props {
  article: Article;
}

export default function FeaturedPostCard({ article }: Props) {
  return (
    <article className="bg-card-bg shadow-card group hover:border-primary cursor-pointer overflow-hidden rounded-2xl text-left transition-transform duration-300 ease-in-out hover:-mb-1 hover:-translate-y-2.5 hover:border-b-[3px] hover:border-solid hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
      <div className="h-52 overflow-hidden">
        <Image
          src={appConfig.me.avatar}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          alt="posts-card"
          width={200}
          height={200}
        />
      </div>
      <div className="p-5">
        <div className="bg-primary-light text-primary mb-4 inline-block rounded-[20px] px-3 py-[5px] text-[0.8rem] font-semibold">
          {article.category}
        </div>
        <h3 className="text-text mb-[10px] text-[1.2rem] leading-[1.4] font-bold">
          {article.title}
        </h3>
        <p className="text-text-secondary mb-4 line-clamp-3 text-[0.9rem] leading-[1.6]">
          社交恐惧症是很多人都面临的问题，本文将分享一些实用的方法来帮助你逐步克服这个困扰
          社交恐惧症是很多人都面临的问题，本文将分享一些实用的方法来帮助你逐步克服这个困扰社交恐惧症是很多人都面临的问题，本文将分享一些实用的方法来帮助你逐步克服这个困扰...
          {article.excerpt}
        </p>
        <div className="text-text-tertiary mb-4 gap-3 text-[0.8rem]">
          <span>
            <CalendarFilled className="mr-[5px]" />
            {article.publishDate}
          </span>
        </div>
        <Link
          href="/"
          className="text-primary group inline-flex items-center gap-1.5 text-[0.9rem] font-semibold transition-[gap] duration-300 ease-in-out hover:gap-2.5">
          阅读全文
          <ArrowRightOutlined className="[&>svg]:stroke-[3]" />
        </Link>
      </div>
    </article>
  );
}
