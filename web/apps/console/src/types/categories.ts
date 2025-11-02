// 分类相关类型定义
export interface Category {
	ID: number;
	name: string;
	slug: string;
	description?: string;
	postCount: number;
	CreatedAt: string;
	UpdatedAt: string;
}

export interface CreateCategoryForm {
	name: string;
	slug: string;
	description?: string;
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
