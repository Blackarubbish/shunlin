// 文章相关类型定义
export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: "published" | "draft" | "archived";
  authorId: number;
  author: string;
  categoryId: number;
  category: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PostListParams {
  pageNum?: number;
  pageSize?: number;
  status?: "published" | "draft" | "archived";
  categoryId?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface PostListResponse {
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreatePostForm {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "published" | "draft" | "archived";
  categoryId: number;
  tags: string[];
}

export interface UpdatePostForm {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: "published" | "draft" | "archived";
  categoryId?: number;
  tags?: string[];
}
