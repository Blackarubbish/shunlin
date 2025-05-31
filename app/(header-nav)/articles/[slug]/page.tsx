import { appConfig } from '@/app-config';
import ErrorMessage from '@/components/errorMsg';
import Header from '@/components/header';
import PostContent from '@/components/post-content';
import PostTag from '@/components/post-tag';
import { DEFAULT_COVER_IMAGE } from '@/consts';
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

  const relatiedPosts = postManager.getRelatedPosts(postInstance.slug, 3);

  // 生成结构化数据
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postInstance.title,
    description: postInstance.excerpt,
    image: {
      '@type': 'ImageObject',
      url: postInstance.coverImage,
      width: '1200',
      height: '630'
    },
    author: {
      '@type': 'Person',
      name: appConfig.me.name,
      url: appConfig.siteUrl,
      image: appConfig.me.avatar
    },
    publisher: {
      '@type': 'Person',
      name: appConfig.me.name,
      logo: {
        '@type': 'ImageObject',
        url: appConfig.me.avatar
      }
    },
    datePublished: postInstance.publishDate,
    dateModified: postInstance.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${appConfig.siteUrl}/articles/${postInstance.slug}`
    },
    keywords: postInstance.tags.join(', '),
    articleSection: postInstance.category.name,
    inLanguage: 'zh-CN',
    url: `${appConfig.siteUrl}/articles/${postInstance.slug}`
  };

  // 面包屑导航结构化数据
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: appConfig.siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '文章',
        item: `${appConfig.siteUrl}/articles`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: postInstance.category.name,
        item: `${appConfig.siteUrl}/categories/${postInstance.category.key}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: postInstance.title,
        item: `${appConfig.siteUrl}/articles/${postInstance.slug}`
      }
    ]
  };

  return (
    <>
      <Header currentPath="/articles" />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

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
                  className="object-cover"
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
