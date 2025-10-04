import { HttpMethod } from "@/lib/http-client";
import type {
	BatchUploadResponse,
	MediaFile,
	MediaListParams,
	MediaListResponse,
	UpdateMediaInfoForm,
	UploadResponse,
} from "@/types/media";
import { httpClient } from "@/utils";

export const mediaApi = {
	// 单文件上传
	uploadFile: async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);

		const res = await httpClient.jsonRequest<UploadResponse>(
			"/api/v1/admin/media/upload",
			HttpMethod.POST,
			{
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
		return res;
	},

	// 批量上传
	batchUploadFiles: async (files: File[]) => {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append("files", file);
		});

		const res = await httpClient.jsonRequest<BatchUploadResponse>(
			"/api/v1/admin/media/batch-upload",
			HttpMethod.POST,
			{
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
		return res;
	},

	// 获取媒体列表
	getMediaList: async (params: MediaListParams = {}) => {
		const res = await httpClient.jsonRequest<MediaListResponse>(
			"/api/v1/admin/media/list",
			HttpMethod.GET,
			{
				params,
			},
		);
		return res;
	},

	// 根据ID获取媒体
	getMediaById: async (id: number) => {
		const res = await httpClient.jsonRequest<MediaFile>(
			`/api/v1/admin/media/${id}`,
			HttpMethod.GET,
			{},
		);
		return res;
	},

	// 更新媒体信息
	updateMediaInfo: async (id: number, data: UpdateMediaInfoForm) => {
		const res = await httpClient.jsonRequest<MediaFile>(
			`/api/v1/admin/media/${id}`,
			HttpMethod.PUT,
			{
				data,
			},
		);
		return res;
	},

	// 删除媒体
	deleteMedia: async (id: number) => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			`/api/v1/admin/media/${id}`,
			HttpMethod.DELETE,
			{},
		);
		return res;
	},
};
