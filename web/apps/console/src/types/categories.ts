// 分类相关类型定义
export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	parentId?: number;
	parent?: Category;
	children?: Category[];
	postCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryForm {
	name: string;
	slug?: string;
	description?: string;
	parentId?: number;
}

export interface CategoryListParams {
	parentId?: number;
	includeChildren?: boolean;
	search?: string;
}
