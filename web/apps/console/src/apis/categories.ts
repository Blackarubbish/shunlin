import { HttpMethod } from "@/lib/http-client";
import type {
	CategoryItem,
	CategoryListParams,
	CategoryListResponse,
	CreateCategoryForm,
	UpdateCategoryForm,
} from "@/types/categories";
import { httpClient } from "@/utils";

export const categoriesApi = {
	// 创建分类
	createCategory: async (data: CreateCategoryForm) => {
		const res = await httpClient.jsonRequest<CategoryItem>(
			"/api/v1/admin/categories",
			HttpMethod.POST,
			{
				data,
			}
		);
		return res;
	},

	// 获取分类列表
	getCategories: async (params: CategoryListParams = {}) => {
		const res = await httpClient.jsonRequest<CategoryListResponse>(
			"/api/v1/admin/categories",
			HttpMethod.GET,
			{
				params,
			}
		);
		return res;
	},

	// 更新分类
	updateCategory: async (id: number, data: UpdateCategoryForm) => {
		const res = await httpClient.jsonRequest<CategoryItem>(
			`/api/v1/admin/categories/${id}`,
			HttpMethod.PATCH,
			{
				data,
			}
		);
		return res;
	},
	// 删除分类
	deleteCategory: async (id: number) => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			`/api/v1/admin/categories/${id}`,
			HttpMethod.DELETE,
			{}
		);
		return res;
	},
};
