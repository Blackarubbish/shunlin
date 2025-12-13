import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { mediaApi } from "@/apis";
import type { MediaListParams, UpdateMediaInfoForm } from "@/types/media";

const MEDIA_QUERY_KEYS = {
	all: ["media"] as const,
	lists: () => [...MEDIA_QUERY_KEYS.all, "list"] as const,
	list: (params: MediaListParams) =>
		[...MEDIA_QUERY_KEYS.lists(), params] as const,
	details: () => [...MEDIA_QUERY_KEYS.all, "detail"] as const,
	detail: (id: number) => [...MEDIA_QUERY_KEYS.details(), id] as const,
};

// 获取媒体列表
export const useMediaList = (params: MediaListParams = {}) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: MEDIA_QUERY_KEYS.list(params),
		queryFn: () => mediaApi.getMediaList(params),
	});

	return { data, isLoading, error, refetch };
};

// 获取单个媒体文件
export const useMedia = (id: number, enabled = true) => {
	const { data, isLoading, error } = useQuery({
		queryKey: MEDIA_QUERY_KEYS.detail(id),
		queryFn: () => mediaApi.getMediaById(id),
		enabled: enabled && !!id,
	});

	return { data, isLoading, error };
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
			console.error("上传文件失败:", error);
			message.error(error.message || "上传文件失败，请重试");
		},
	});
};

// 批量上传文件
export const useBatchUploadFiles = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (files: File[]) => mediaApi.batchUploadFiles(files),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			message.success("文件批量上传成功！");
		},
		onError: (error: Error) => {
			console.error("批量上传失败:", error);
			message.error(error.message || "批量上传失败，请重试");
		},
	});
};

// 更新媒体信息
export const useUpdateMediaInfo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateMediaInfoForm }) =>
			mediaApi.updateMediaInfo(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({
				queryKey: MEDIA_QUERY_KEYS.detail(variables.id),
			});
			message.success("媒体信息更新成功！");
		},
		onError: (error: Error) => {
			console.error("更新媒体信息失败:", error);
			message.error(error.message || "更新媒体信息失败，请重试");
		},
	});
};

// 删除媒体
export const useDeleteMedia = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => mediaApi.deleteMedia(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.lists() });
			message.success("媒体删除成功！");
		},
		onError: (error: Error) => {
			console.error("删除媒体失败:", error);
			message.error(error.message || "删除媒体失败，请重试");
		},
	});
};
