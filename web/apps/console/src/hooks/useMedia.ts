import { mediaApi } from "@/apis/media";
import type { MediaQueryParams } from "@/types/media";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

const MEDIA_QUERY_KEYS = {
	all: ["media"] as const,
	lists: () => [...MEDIA_QUERY_KEYS.all, "list"] as const,
	list: (params: MediaQueryParams) =>
		[...MEDIA_QUERY_KEYS.lists(), params] as const,
};

// 获取媒体列表
export const useMediaList = (params: MediaQueryParams = {}) => {
	const genRealFileURL = (fileURL: string) => {
		return `${import.meta.env.VITE_APP_API_URL}${fileURL}`;
	};
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: MEDIA_QUERY_KEYS.list(params),
		queryFn: () => mediaApi.getMediaList(params),
	});

	return { data, isLoading, error, refetch, genRealFileURL };
};

// 上传单个文件
export const useUploadFile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (file: File) => mediaApi.uploadFile(file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			message.success("文件上传成功！");
		},
		onError: (error: Error) => {
			console.error("上传失败:", error);
			message.error(error.message || "上传失败，请重试");
		},
	});
};

// 批量上传文件
export const useUploadFiles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (files: File[]) => mediaApi.uploadFiles(files),
		onSuccess: (results) => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			message.success(`成功上传 ${results.length} 个文件！`);
		},
		onError: (error: Error) => {
			console.error("批量上传失败:", error);
			message.error(error.message || "批量上传失败，请重试");
		},
	});
};

// 删除媒体文件
export const useDeleteMedia = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => mediaApi.deleteMedia(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			message.success("文件删除成功！");
		},
		onError: (error: Error) => {
			console.error("删除失败:", error);
			message.error(error.message || "删除失败，请重试");
		},
	});
};
