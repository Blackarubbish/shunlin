import { HttpMethod } from "@/lib/http-client";
import type {
	CreatePostForm,
	Post,
	PostListParams,
	PostListResponse,
	UpdatePostForm,
} from "@/types/posts";
import { httpClient } from "@/utils";

export const postsApi = {
	// 获取文章列表
	getPosts: async (params: PostListParams = {}) => {
		const res = await httpClient.jsonRequest<PostListResponse>(
			"/api/v1/admin/posts",
			HttpMethod.GET,
			{
				params,
			},
		);
		return res;
	},

	// 创建文章
	createPost: async (data: CreatePostForm) => {
		const res = await httpClient.jsonRequest<Post>(
			"/api/v1/admin/posts",
			HttpMethod.POST,
			{
				data,
			},
		);
		return res;
	},

	// 获取单篇文章
	getOnePost: async (id: number) => {
		const res = await httpClient.jsonRequest<Post>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.GET,
			{},
		);
		return res;
	},

	// 更新文章
	updatePost: async (id: number, data: UpdatePostForm) => {
		const res = await httpClient.jsonRequest<Post>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.PUT,
			{
				data,
			},
		);
		return res;
	},

	// 删除文章
	deletePost: async (id: number) => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			`/api/v1/admin/posts/${id}`,
			HttpMethod.DELETE,
			{},
		);
		return res;
	},
};
