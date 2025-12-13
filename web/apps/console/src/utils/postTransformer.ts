// 文章数据转换工具 - 处理 API 返回的 snake_case 和前端使用的 camelCase

import type { Post } from "@/types/posts";

// API 返回的原始文章数据结构
export interface ApiPost {
  id?: number;
  ID?: number;
  created_at?: string;
  CreatedAt?: string;
  updated_at?: string;
  UpdatedAt?: string;
  title: string;
  content: string;
  slug: string;
  status: number | string;
  author_id: number;
  category_id: number;
  category?: {
    id?: number;
    ID?: number;
    name: string;
    slug: string;
    description: string;
  };
  Category?: {
    id?: number;
    ID?: number;
    name: string;
    slug: string;
    description: string;
  };
  tag?: string;
  excerpt?: string;
}

// API 返回的文章列表响应
export interface ApiPostListResponse {
  items: ApiPost[];
  total: number;
  page: number;
  size?: number;
  pageSize?: number;
}

// 状态映射：数字 -> 字符串
const statusMap: Record<number, "published" | "draft" | "archived"> = {
  0: "draft",
  1: "published",
  2: "archived",
};

// 状态映射：字符串 -> 数字
const statusReverseMap: Record<string, number> = {
  draft: 0,
  published: 1,
  archived: 2,
};

// 转换单个文章数据：API 格式 -> 前端格式
export function transformApiPostToPost(apiPost: ApiPost): Post {
  const category = apiPost.category || apiPost.Category;
  const id = apiPost.id || apiPost.ID || 0;
  const createdAt = apiPost.created_at || apiPost.CreatedAt || "";
  const updatedAt = apiPost.updated_at || apiPost.UpdatedAt || "";

  // 处理状态：如果是数字则转换，如果是字符串则直接使用
  let status: "published" | "draft" | "archived" = "draft";
  if (typeof apiPost.status === "number") {
    status = statusMap[apiPost.status] || "draft";
  } else if (typeof apiPost.status === "string") {
    status = apiPost.status as "published" | "draft" | "archived";
  }

  return {
    id,
    title: apiPost.title,
    content: apiPost.content || "",
    excerpt: apiPost.excerpt || "",
    status,
    authorId: apiPost.author_id,
    author: "", // API 暂时不返回 author 名称
    categoryId: apiPost.category_id,
    category: category?.name || "",
    tags: apiPost.tag ? apiPost.tag.split(",").filter(Boolean) : [],
    viewCount: 0, // API 暂时不返回浏览量
    createdAt,
    updatedAt,
    publishedAt: status === "published" ? createdAt : undefined,
  };
}

// 转换文章列表：API 格式 -> 前端格式
export function transformApiPostList(
  apiResponse: ApiPostListResponse
): {
  items: Post[];
  total: number;
  page: number;
  pageSize: number;
} {
  return {
    items: apiResponse.items.map(transformApiPostToPost),
    total: apiResponse.total,
    page: apiResponse.page,
    pageSize: apiResponse.size || apiResponse.pageSize || 10,
  };
}

// 转换创建/更新表单：前端格式 -> API 格式
export function transformPostFormToApi(form: {
  title: string;
  content: string;
  excerpt?: string;
  status: "published" | "draft" | "archived";
  categoryId: number;
  tags?: string[];
  slug: string;
  authorId?: number;
}) {
  return {
    title: form.title,
    content: form.content,
    excerpt: form.excerpt,
    slug: form.slug,
    status: statusReverseMap[form.status] || 0,
    author_id: form.authorId || 1, // 默认作者 ID
    category_id: form.categoryId,
    tag: form.tags?.join(",") || "",
  };
}

