import { HttpMethod } from "@/lib/http-client";
import type {
	CreatePostForm,
	Post,
	PostListParams,
	PostListResponse,
	UpdatePostForm,
} from "@/types/posts";
import { httpClient } from "@/utils";
import {
	transformApiPostList,
	transformApiPostToPost,
	transformPostFormToApi,
	type ApiPost,
	type ApiPostListResponse,
} from "@/utils/postTransformer";

export const postsApi = {
	// 获取文章列表
	getPosts: async (params: PostListParams = {}): Promise<PostListResponse> => {
		const apiParams: Record<string, any> = {};

		if (params.pageNum) apiParams.pageNum = params.pageNum;
		if (params.pageSize) apiParams.pageSize = params.pageSize;
		if (params.search) apiParams.title = params.search;
		if (params.sortOrder) apiParams.sortOrder = params.sortOrder;

		// 转换状态：字符串 -> 数字
		if (params.status) {
			const statusMap: Record<string, number> = {
				draft: 0,
				published: 1,
				archived: 2,
			};
			apiParams.status = statusMap[params.status] || 0;
		}

		const res = await httpClient.jsonRequest<ApiPostListResponse>(
			"/api/v1/admin/posts",
			HttpMethod.GET,
			{
				params: apiParams,
			}
		);

		return transformApiPostList(res);
	},

	// 创建文章
	createPost: async (data: CreatePostForm): Promise<Post> => {
		const apiData = transformPostFormToApi({
			...data,
			slug: data.title.toLowerCase().replace(/\s+/g, "-"), // 简单的 slug 生成
		});

		const res = await httpClient.jsonRequest<ApiPost>(
			"/api/v1/admin/posts",
			HttpMethod.POST,
			{
				data: apiData,
			}
		);

		return transformApiPostToPost(res);
	},

	// 获取单篇文章
	getOnePost: async (id: number): Promise<Post> => {
		const res = await httpClient.jsonRequest<ApiPost>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.GET,
			{}
		);

		return transformApiPostToPost(res);
	},

	// 更新文章
	updatePost: async (id: number, data: UpdatePostForm): Promise<Post> => {
		const apiData = transformPostFormToApi({
			title: data.title || "",
			content: data.content || "",
			excerpt: data.excerpt,
			status: data.status || "draft",
			categoryId: data.categoryId || 1,
			tags: data.tags,
			slug: data.title?.toLowerCase().replace(/\s+/g, "-") || "",
		});

		const res = await httpClient.jsonRequest<ApiPost>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.PUT,
			{
				data: apiData,
			}
		);

		return transformApiPostToPost(res);
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
