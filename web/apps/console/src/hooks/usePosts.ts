import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { postsApi } from "@/apis";
import type {
	CreatePostRequest,
	PostListParams,
	UpdatePostRequest,
} from "@/types/posts";

const POSTS_QUERY_KEYS = {
	all: ["posts"] as const,
	lists: () => [...POSTS_QUERY_KEYS.all, "list"] as const,
	list: (params: PostListParams) =>
		[...POSTS_QUERY_KEYS.lists(), params] as const,
	details: () => [...POSTS_QUERY_KEYS.all, "detail"] as const,
	detail: (id: number) => [...POSTS_QUERY_KEYS.details(), id] as const,
};

// 获取文章列表
export const usePosts = (params: PostListParams = {}) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: POSTS_QUERY_KEYS.list(params),
		queryFn: () => postsApi.getPosts(params),
	});

	return { data, isLoading, error, refetch };
};

// 获取单篇文章
export const usePost = (id: number, enabled = true) => {
	const { data, isLoading, error } = useQuery({
		queryKey: POSTS_QUERY_KEYS.detail(id),
		queryFn: () => postsApi.getOnePost(id),
		enabled: enabled && !!id,
	});

	return { data, isLoading, error };
};

// 创建文章
export const useCreatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
			message.success("文章创建成功！");
		},
		onError: (error: Error) => {
			console.error("创建文章失败:", error);
			message.error(error.message || "创建文章失败，请重试");
		},
	});
};

// 更新文章
export const useUpdatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
			postsApi.updatePost(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({
				queryKey: POSTS_QUERY_KEYS.detail(variables.id),
			});
			message.success("文章更新成功！");
		},
		onError: (error: Error) => {
			console.error("更新文章失败:", error);
			message.error(error.message || "更新文章失败，请重试");
		},
	});
};

// 删除文章
export const useDeletePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => postsApi.deletePost(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEYS.lists() });
			message.success("文章删除成功！");
		},
		onError: (error: Error) => {
			console.error("删除文章失败:", error);
			message.error(error.message || "删除文章失败，请重试");
		},
	});
};
