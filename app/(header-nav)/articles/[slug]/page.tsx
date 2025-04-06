import { appConfig } from '@/app-config';
import ErrorMessage from '@/components/errorMsg';
import Header from '@/components/header';
import PostContent from '@/components/post-content';
import { getPostManager } from '@/lib/docs-manager';
import { Calendar, Clock, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
  // 实际使用时，可以通过params.slug从数据库或CMS获取文章数据

  const { slug } = await params;
  const postManager = await getPostManager();

  const postInstance = postManager.getPostBySlug(slug);

  if (!postInstance) {
    return <ErrorMessage message="文章不存在" />;
  }

  const htmlContent = await postManager.getPostHtmlContent(postInstance.slug);

  if (!htmlContent) {
    return <ErrorMessage message="查询不到文章内容" />;
  }

  const relatiedPosts = postManager.getRelatedPosts(postInstance.slug, 3);

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
                <span>{postInstance.publishDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{10}</span>
              </div>
            </div>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {postInstance.tags.map((t) => (
                <Link
                  key={t}
                  href={`/articles?category=${t.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-primary-light text-primary hover:bg-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-all duration-300 hover:text-white">
                  <Tag size={14} />
                  <span>{t}</span>
                </Link>
              ))}
            </div>
            <div className="relative mx-auto mb-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl">
              <Image
                src={postInstance.coverImage}
                alt={postInstance.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 文章内容 */}
          <PostContent htmlContent={htmlContent} />

          {/* 相关文章 */}
          <div className="mx-auto max-w-5xl">
            <h2 className="text-text mb-8 text-center text-2xl font-bold">相关文章</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatiedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/articles/${post.slug}`}
                  className="bg-card-bg border-border hover:border-primary group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
    </>
  );
}
