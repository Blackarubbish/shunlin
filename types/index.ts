export interface Article {
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  summary: string;
  category: string;
}

export interface Category {
  name: string;
  count: number;
  icon: string;
  key: string;
}
