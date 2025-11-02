// 媒体文件相关类型定义
export interface MediaFile {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListParams {
  page?: number;
  pageSize?: number;
  mimeType?: string;
  search?: string;
}

export interface MediaListResponse {
  items: MediaFile[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateMediaInfoForm {
  filename?: string;
  description?: string;
}

export interface UploadResponse {
  file: MediaFile;
  message: string;
}

export interface BatchUploadResponse {
  files: MediaFile[];
  message: string;
}
