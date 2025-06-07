import { appConfig } from '@/app-config';
import { Comment } from '@/components/comment';
import ErrorMessage from '@/components/errorMsg';
import Header from '@/components/header';
import PostContent from '@/components/post-content';
import PostTag from '@/components/post-tag';
import { DEFAULT_COVER_IMAGE } from '@/consts';
import { cn } from '@/lib';
import { getPostManager } from '@/lib/docs-manager';
import { Calendar, Clock, User } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}
const postManager = getPostManager();
const posts = postManager.getAllPosts();

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { slug } = await params;

  const postInstance = postManager.getPostBySlug(slug);

  if (!postInstance) {
    return {
      title: '文章不存在',
      description: '您访问的文章不存在'
    };
  }

  const articleUrl = `${appConfig.siteUrl}/articles/${postInstance.slug}`;

  return {
    title: `${postInstance.title} | ${appConfig.headerTitle}`,
    description: postInstance.excerpt,
    keywords: postInstance.tags,
    authors: [{ name: appConfig.me.name, url: appConfig.siteUrl }],
    creator: appConfig.me.name,
    publisher: appConfig.me.name,

    // Open Graph 优化
    openGraph: {
      title: postInstance.title,
      description: postInstance.excerpt,
      url: articleUrl,
      type: 'article',
      siteName: appConfig.title,
      locale: 'zh-CN',
      publishedTime: postInstance.publishDate,
      modifiedTime: postInstance.publishDate,
      authors: [appConfig.me.name],
      tags: postInstance.tags,
      images: [
        {
          url: postInstance.coverImage || DEFAULT_COVER_IMAGE,
          width: 1200,
          height: 630,
          alt: postInstance.title
        }
      ]
    },
    // 分类信息
    category: postInstance.category.name
  };
}

export default async function ArticleDetail(Props: Props) {
  const { params } = Props;
  // 实际使用时，可以通过params.slug从数据库或CMS获取文章数据

  const { slug } = await params;
  const postInstance = postManager.getPostBySlug(slug);

  if (!postInstance) {
    return (
      <>
        <Header currentPath="/articles" />
        <div className="py-14">
          <ErrorMessage message="文章不存在!" />
        </div>
      </>
    );
  }

  const htmlContent = await postManager.getPostHtmlContent(postInstance.slug);

  if (!htmlContent) {
    return (
      <>
        <Header currentPath="/articles" />
        <div className="py-14">
          <ErrorMessage message="文章内容加载失败" />
        </div>
      </>
    );
  }

  const relatedPosts = postManager.getRelatedPosts(postInstance.slug, 3);

  return (
    <>
      <Header currentPath="/articles" />
      <div className="py-14">
        <article>
          {/* 文章头部信息 */}
          <div className="mb-10">
            <h1 className="text-text mb-6 text-center text-4xl leading-tight font-bold md:text-5xl">
              {postInstance.title}
            </h1>
            <div className="text-text-secondary mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{appConfig.me.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <time dateTime={postInstance.publishDate}>
                  {postInstance.publishDate}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{postInstance.readingTime || '10分钟'}</span>
              </div>
            </div>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {postInstance.tags.map((t, idx) => (
                <PostTag key={`${t}-${idx}`} name={t} />
              ))}
            </div>
            {postInstance.showCover && (
              <div className="relative mx-auto mb-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl">
                <Image
                  src={postInstance.coverImage}
                  alt={postInstance.title}
                  fill
                  className={cn('object-cover', postInstance.articleCoverClassname)}
                  priority
                />
              </div>
            )}
          </div>

          {/* 文章内容 */}
          <PostContent htmlContent={htmlContent} />

          {/* 相关文章 */}
          <div className="mx-auto max-w-5xl">
            <h2 className="text-text mb-8 text-center text-2xl font-bold">相关文章</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="bg-card-bg border-border hover:border-primary group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className={cn(
                        'object-cover transition-transform duration-300 group-hover:scale-105',
                        post.cardCoverClassName
                      )}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-text group-hover:text-primary text-lg font-bold transition-colors duration-300">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
      <Comment />
    </>
  );
}
