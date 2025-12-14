import { HttpMethod } from "@/lib/http-client";
import type {
	CreatePostRequest,
	GetOnePostResponse,
	PostListParams,
	PostListResponse,
	UpdatePostRequest,
} from "@/types/posts";
import { httpClient } from "@/utils";

export const postsApi = {
	// 获取文章列表
	getPosts: async (params: PostListParams = {}): Promise<PostListResponse> => {
		const apiParams: Record<string, string | number | undefined> = {};

		if (params.pageNum) apiParams.pageNum = params.pageNum;
		if (params.pageSize) apiParams.pageSize = params.pageSize;
		if (params.title) apiParams.title = params.title;
		if (params.slug) apiParams.slug = params.slug;
		if (params.categoryID) apiParams.categoryID = params.categoryID;
		if (params.authorID) apiParams.authorID = params.authorID;
		if (params.status !== undefined) apiParams.status = params.status;
		if (params.sortOrder) apiParams.sortOrder = params.sortOrder;

		const res = await httpClient.jsonRequest<PostListResponse>(
			"/api/v1/admin/posts",
			HttpMethod.GET,
			{
				params: apiParams,
			}
		);

		return res;
	},

	// 创建文章
	createPost: async (data: CreatePostRequest): Promise<GetOnePostResponse> => {
		// 开发环境下输出调试信息
		if (import.meta.env.DEV) {
			console.warn("创建文章请求数据:", data);
		}

		const res = await httpClient.jsonRequest<GetOnePostResponse>(
			"/api/v1/admin/posts",
			HttpMethod.POST,
			{
				data: data,
			}
		);

		return res;
	},

	// 获取单篇文章
	getOnePost: async (id: number): Promise<GetOnePostResponse> => {
		const res = await httpClient.jsonRequest<GetOnePostResponse>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.GET,
			{}
		);

		return res;
	},

	// 更新文章
	updatePost: async (
		id: number,
		data: UpdatePostRequest
	): Promise<GetOnePostResponse> => {
		// 开发环境下输出调试信息
		if (import.meta.env.DEV) {
			console.warn("更新文章请求数据:", data);
		}

		const res = await httpClient.jsonRequest<GetOnePostResponse>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.PUT,
			{
				data: data,
			}
		);

		return res;
	},

	// 删除文章
	deletePost: async (id: number) => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.DELETE,
			{}
		);
		return res;
	},
};
