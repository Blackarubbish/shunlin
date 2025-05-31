import { MetadataRoute } from 'next';
import { appConfig } from '@/app-config';
import { getPostManager, initializePostManager } from '@/lib/docs-manager';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = appConfig.siteUrl;

  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    {
      url: `${baseUrl}/friends`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }
  ];

  try {
    await initializePostManager(appConfig.srcDir);
    // 动态获取所有文章
    const postManager = getPostManager();
    const posts = postManager.getAllPosts();

    const articlePages = posts.map((post) => ({
      url: `${baseUrl}/articles/${post.slug}`,
      lastModified: new Date(post.publishDate || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }));
    return [...staticPages, ...articlePages];
  } catch (error) {
    console.error('生成sitemap时出错:', error);
    // 如果获取文章失败，至少返回静态页面
    return staticPages;
  }
}
