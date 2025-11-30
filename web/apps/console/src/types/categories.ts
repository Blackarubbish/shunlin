// 分类相关类型定义
export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  postCount: number;
}

export interface CreateCategoryForm {
  name: string;
  slug: string;
  description: string;
}

export interface UpdateCategoryForm {
  name?: string;
  slug?: string;
  description?: string;
}

export interface CategoryListParams {
  parentId?: number;
  includeChildren?: boolean;
  search?: string;
}

export interface CategoryListResponse {
  items: CategoryItem[];
  total: number;
  page: number;
  pageSize: number;
}
