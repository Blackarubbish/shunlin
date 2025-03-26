export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  publishDate: string;
}

export interface Category {
  name: string;
  count: number;
  icon: string;
  key: string;
  coverImage?: string;
}
