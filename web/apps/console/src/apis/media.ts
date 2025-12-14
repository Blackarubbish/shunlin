import { HttpMethod } from "@/lib/http-client";
import type {
	MediaListResponse,
	MediaQueryParams,
	UploadResponse,
} from "@/types/media";
import { httpClient } from "@/utils";

export const mediaApi = {
	// 获取媒体列表
	getMediaList: async (
		params: MediaQueryParams = {}
	): Promise<MediaListResponse> => {
		const apiParams: Record<string, string | number | undefined> = {};

		if (params.page) apiParams.page = params.page;
		if (params.pageSize) apiParams.pageSize = params.pageSize;
		if (params.filetype) apiParams.filetype = params.filetype;
		if (params.uploadedBy) apiParams.uploadedBy = params.uploadedBy;

		const res = await httpClient.jsonRequest<MediaListResponse>(
			"/api/v1/admin/media/list",
			HttpMethod.GET,
			{
				params: apiParams,
			}
		);

		return res;
	},

	// 上传单个文件
	uploadFile: async (file: File): Promise<UploadResponse> => {
		const formData = new FormData();
		formData.append("file", file);

		const res = await httpClient.request<{ data: UploadResponse }>({
			url: "/api/v1/admin/media/upload",
			method: HttpMethod.POST,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return res.data.data;
	},

	// 批量上传文件
	uploadFiles: async (files: File[]): Promise<UploadResponse[]> => {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append("files", file);
		});

		const res = await httpClient.request<{
			data: { results: UploadResponse[] };
		}>({
			url: "/api/v1/admin/media/upload/batch",
			method: HttpMethod.POST,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return res.data.data.results;
	},

	// 删除媒体文件
	deleteMedia: async (id: number): Promise<void> => {
		await httpClient.jsonRequest<{ message: string }>(
			`/api/v1/admin/media/${id}`,
			HttpMethod.DELETE,
			{}
		);
	},
};
