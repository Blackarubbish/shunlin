import { Post, Category, PostMatter } from '@/types';
import pinyin from 'pinyin';
import fg from 'fast-glob';
import matter from 'gray-matter';
import slugify from 'slugify';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { readFileSync } from 'fs';
import { MarkdownParser, MarkdownRemarkParser } from '../markdown';
import { DEFAULT_COVER_IMAGE } from '@/consts';

let defaultCategory = {
  name: '未分类',
  key: 'uncategorized',
  icon: 'folder',
  description: '未分类的文章',
  coverImage: '/icons/pixeltrue-icons-seo-business-location-3.svg',
  order: 999,
  count: 0
} as Category;

export class BasePostManager {
  private srcDir: string;

  private posts: Post[] = [];
  private postsByTag: Record<string, Post[]> = {};
  private postsFilePathRecord: Record<string, string> = {};
  // 添加到 BasePostManager 类中
  private categoryMetadata = new Map<string, Category>();

  private isInitialized = false;
  private isLoading = false;

  private markdownParser: MarkdownParser;

  constructor(srcDir: string, parser: MarkdownParser) {
    this.srcDir = srcDir;
    this.markdownParser = parser;
  }

  /**
   * 从 Markdown 内容提取纯文本
   * @param markdown Markdown 格式的内容
   * @param maxLength 可选的最大长度限制
   * @returns 提取的纯文本
   */
  public async extractPlainText(markdown: string, maxLength?: number): Promise<string> {
    const result = await remark().use(strip).process(markdown);

    let text = String(result).trim();

    if (maxLength && text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return text;
  }

  /**
   * 从标题生成 slug (通用版本，支持多种语言)
   * @param title 文章标题
   * @returns 生成的 slug
   */
  public generateSlug(title: string): string {
    // 尝试将中文转为拼音
    const pinyinText = pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false
    })
      .flat()
      .join(' ');

    // 配置 slugify 选项
    const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true
    };

    return slugify(pinyinText, options);
  }
  /**
   * 确保 slug 的唯一性
   * @param slug 原始 slug
   * @returns 唯一的 slug
   */
  public ensureUniqueSlug(slug: string): string {
    let uniqueSlug = slug;
    let counter = 0;

    while (this.posts.some((post) => post.slug === uniqueSlug)) {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }

    return uniqueSlug;
  }

  /**
   * 从文章数据自动生成 slug
   * @param data 文章数据
   * @returns 生成的唯一 slug
   */
  public generateUniqueSlug(data: Partial<PostMatter>): string {
    // 如果已有 slug 则直接返回
    if (data.slug) return data.slug;

    // 从标题生成 slug 基础
    const baseSlug = data.title ? this.generateSlug(data.title) : `post-${Date.now()}`;

    // 确保唯一性
    return this.ensureUniqueSlug(baseSlug);
  }

  public createDefaultCategory(): Category {
    return defaultCategory;
  }

  private reset() {
    this.posts = [];
    this.postsByTag = {};
    this.postsFilePathRecord = {};
    this.categoryMetadata = new Map<string, Category>();
    this.isInitialized = false;
    this.isLoading = false;
    defaultCategory.count = 0;
  }

  public async initialize() {
    if (this.isInitialized && process.env.NODE_ENV === 'production') {
      return;
    }
    this.reset();
    this.isLoading = true;
    await this.loadCategories();
    await this.loadPosts();
    this.isInitialized = true;
    this.isLoading = false;
    defaultCategory = {
      ...defaultCategory
    };
  }

  /**
   * 加载分类配置
   */
  private async loadCategories(): Promise<void> {
    // 导入分类配置
    try {
      const data = readFileSync(`${this.srcDir}/data.json`, 'utf-8');
      const parsedData = JSON.parse(data);
      const categories = (parsedData.categories as Category[]) || [];
      for (const c of categories) {
        const { key } = c;
        const data = {
          ...c
        };
        data.coverImage = c.coverImage;
        data.icon = c.icon;
        data.count = 0;
        this.categoryMetadata.set(key, data);
      }
      // 添加默认分类
      const defaultCategoryKey = defaultCategory.key;
      if (!this.categoryMetadata.has(defaultCategoryKey)) {
        this.categoryMetadata.set(defaultCategoryKey, defaultCategory);
      }
    } catch (error) {
      throw new Error('Failed to load categories: ' + error);
    }
  }

  /**
   * 初始化并加载所有文章
   */
  private async loadPosts(): Promise<void> {
    // 获取所有 Markdown 文件
    const files = fg.sync(`**/*.md`, {
      ignore: ['**/node_modules/**', '**/public/**'],
      cwd: this.srcDir,
      absolute: true,
      onlyFiles: true
    });
    for (const file of files) {
      const { data, content } = matter.read(file) as {
        data: Partial<PostMatter>;
        content: string;
      };

      // 只展示2个标签
      if (data.tags && Array.isArray(data.tags) && data.tags.length > 2) {
        data.tags = data.tags.slice(0, 2);
      }

      if (!data.excerpt) {
        data.excerpt = await this.extractPlainText(content, 200);
      }
      const categoryInfo = this.getCategoryInfo(data.category ?? '') ?? defaultCategory;
      categoryInfo.count = (categoryInfo.count || 0) + 1;
      const isShowCover = data.showCover || !!data.coverImage;
      // 解析文章数据
      const article: Post = {
        title: data.title || '',
        slug: this.generateUniqueSlug(data),
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || DEFAULT_COVER_IMAGE,
        showCover: isShowCover, // 如果使用了默认的封面图，则不显示
        tags: data.tags || [],
        category: categoryInfo,
        readingTime: data.readingTime,
        publishDate: data.publishDate || new Date().toISOString(),
        featured: data.featured || false,
        cardCoverClassName: data.cardCoverClassName || '',
        articleCoverClassname: data.articleCoverClassname || ''
      };

      // slug关联文件路径
      this.postsFilePathRecord[article.slug] = file;

      for (const tag of article.tags) {
        if (!this.postsByTag[tag]) {
          this.postsByTag[tag] = [];
        }
        this.postsByTag[tag].push(article);
      }
      this.posts.push(article);
    }

    // 对文章进行排序，默认按发布日期降序
    this.posts.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  /**
   * 获取所有文章
   */
  public getAllPosts(): Post[] {
    return this.posts;
  }

  /**
   * 获取指定分类的所有文章
   */
  public getPostsByCategory(category: string): Post[] {
    const categoryKey = category || defaultCategory.key;
    return this.posts.filter((post) => post.category.key === categoryKey);
  }

  /**
   * 获取所有分类及其文章数量
   */
  public getAllCategories(): Category[] {
    const categories = Array.from(this.categoryMetadata.values());
    // 排序
    categories.sort((a, b) => {
      if (!a.order) {
        a.order = 999;
      }
      if (!b.order) {
        b.order = 999;
      }
      return a.order - b.order;
    });
    return categories;
  }

  /**
   * 获取指定标签的所有文章
   */
  public getPostsByTag(tag: string): Post[] {
    return this.postsByTag[tag] || [];
  }

  /**
   * 获取所有标签及其文章数量
   */
  public getAllTags(): { name: string; count: number }[] {
    return Object.entries(this.postsByTag).map(([tag, posts]) => ({
      name: tag,
      count: posts.length
    }));
  }

  /**
   * 根据slug获取文章
   */
  public getPostBySlug(slug: string): Post | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  /**
   * 根据slug获取文章内容
   */
  public getPostContentBySlug(slug: string): string | undefined {
    const filePath = this.postsFilePathRecord[slug];
    if (!filePath) {
      return;
    }
    const content = readFileSync(filePath, 'utf-8');
    return content;
  }

  /**
   * 获取精选文章
   */
  public getFeaturedPosts(limit: number = 5): Post[] {
    // 首先查找前置数据中标记为featured的文章
    const featuredPosts = this.posts.filter((post) => post.featured === true);
    // 如果有足够的精选文章，返回限制数量的精选文章
    if (featuredPosts.length >= limit) {
      return featuredPosts.slice(0, limit);
    }

    // 如果精选文章不足，用最新文章补充
    // 已经按发布日期降序排序，所以直接取前n篇
    const recentPosts = this.posts.filter(
      (post) => !featuredPosts.some((featured) => featured.slug === post.slug)
    );

    // 组合精选文章和最新文章
    const a = [...featuredPosts, ...recentPosts.slice(0, limit - featuredPosts.length)];
    return a;
  }

  public async getPostHtmlContent(slug: string): Promise<string | null> {
    const filePath = this.postsFilePathRecord[slug];
    if (!filePath) {
      return null;
    }
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const htmlContent = await this.markdownParser.parseMarkdown(fileContent);
      return htmlContent;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  /**
   * 获取相关文章
   * @param slug 当前文章的 slug
   * @param limit 返回的相关文章数量
   * @returns 相关文章列表
   */
  public getRelatedPosts(slug: string, limit: number = 5): Post[] {
    // 获取当前文章
    const currentPost = this.getPostBySlug(slug);
    if (!currentPost) {
      return [];
    }

    // 获取与当前文章相同分类的文章（排除当前文章）
    const categoryPosts = this.getPostsByCategory(currentPost.category.key).filter(
      (post) => post.slug !== slug
    );

    // 获取与当前文章有相同标签的文章（排除当前文章）
    const tagPosts = currentPost.tags.flatMap((tag) =>
      this.getPostsByTag(tag).filter((post) => post.slug !== slug)
    );

    // 合并分类和标签的相关文章，并去重
    const relatedPosts = Array.from(
      new Map([...categoryPosts, ...tagPosts].map((post) => [post.slug, post])).values()
    );

    // 如果相关文章不足 limit，从所有文章中补齐
    if (relatedPosts.length < limit) {
      const additionalPosts = this.posts
        .filter(
          (post) =>
            post.slug !== slug && !relatedPosts.some((rp) => rp.slug === post.slug)
        )
        .sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
        .slice(0, limit - relatedPosts.length);

      relatedPosts.push(...additionalPosts);
    }

    // 按发布日期降序排序，并限制返回数量
    return relatedPosts
      .sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      )
      .slice(0, limit);
  }

  public getCategoryInfo(categoryKey: string) {
    return this.categoryMetadata.get(categoryKey);
  }

  /**
   * 搜索文章
   * @param keyword 搜索关键词
   * @returns 匹配的文章列表
   */
  public searchPosts(keyword: string): Post[] {
    if (!keyword.trim()) {
      return [];
    }

    const lowerKeyword = keyword.toLowerCase();

    return this.posts.filter((post) => {
      const { title, excerpt } = post;

      // 在标题、摘要中搜索关键词
      return (
        title.toLowerCase().includes(lowerKeyword) ||
        excerpt.toLowerCase().includes(lowerKeyword)
      );
    });
  }
}

declare const globalThis: {
  blogManagerGlobal: BasePostManager | null;
} & typeof global;

let blogManager: BasePostManager | null = globalThis.blogManagerGlobal ?? null;
export function getPostManager(): BasePostManager {
  if (!blogManager) {
    throw new Error('BlogPostManager not initialized. Please call initialize() first.');
  }
  return blogManager;
}

export async function initializePostManager(srcDir: string) {
  if (!blogManager) {
    const markdownParser = new MarkdownRemarkParser({
      srcDir
    });
    blogManager = new BasePostManager(srcDir, markdownParser);
    if (process.env.NODE_ENV !== 'production') {
      globalThis.blogManagerGlobal = blogManager;
    }
    await blogManager.initialize();
  }
}
