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

export interface PostMatter {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  publishDate: string;
  featured?: boolean;
}
