// 媒体文件相关类型定义（与后端 Go DTO 完全对应）

// 媒体项（对应后端 MediaItemDto）
export interface MediaItem {
	id: number;
	originalName: string;
	filename: string;
	fileURL: string;
	filetype: string; // image, video, document, audio
	filesize: number;
	extension: string;
	uploadedAt: string;
}

// 上传响应（对应后端 UploadResponseDto）
export interface UploadResponse {
	id: number;
	originalName: string;
	filename: string;
	fileURL: string;
	filetype: string;
	filesize: number;
	extension: string;
	uploadedAt: string;
}

// 媒体查询参数（对应后端 MediaQueryDto）
export interface MediaQueryParams {
	filetype?: "image" | "video" | "document" | "audio";
	page?: number;
	pageSize?: number;
	uploadedBy?: number;
}

// 媒体列表响应（对应后端 MediaListResponseDto）
export interface MediaListResponse {
	items: MediaItem[];
	total: number;
	page: number;
	size: number;
}

// 批量上传响应（对应后端 BatchUploadResponseDto）
export interface BatchUploadResponse {
	successCount: number;
	errorCount: number;
	results: UploadResponse[];
	errors?: string[];
}
