/**
 * @deprecated 统一用Post替代Article
 */
export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  publishDate: string;
  featured?: boolean;
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: Category;
  publishDate: string;
  featured?: boolean;
  showCover?: boolean;
  readingTime?: string; // 以分钟为单位的阅读时间字符串
  cardCoverClassName?: string;
  articleCoverClassname?: string;
}

export interface Category {
  name: string;
  key: string;
  icon: string;
  count: number;
  description?: string;
  coverImage: string;
  order?: number;
}

// todo: 需要合并Post和PostMatter, 添加zod校验
export interface PostMatter {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  publishDate: string;
  featured?: boolean;
  readingTime?: string; // 以分钟为单位的阅读时间字符串
  showCover?: boolean;
  cardCoverClassName?: string;
  articleCoverClassname?: string;
}

export interface Friends {
  name: string;
  url: string;
  avatar: string;
  description: string;
}
