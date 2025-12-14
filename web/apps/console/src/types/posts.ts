// 文章相关类型定义（与后端 Go DTO 完全对应）

// 文章分类信息
export interface PostCategory {
	id: number;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

// 文章状态枚举（后端使用数字）
export type PostStatus = 0 | 1; // 0=草稿, 1=已发布

// 文章列表项（对应后端 PostListItemDto）
export interface PostListItem {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	slug: string;
	status: PostStatus;
	authorID: number;
	categoryID: number;
	category: PostCategory;
	tag: string; // 逗号分隔的标签字符串
}

// 获取文章列表响应（对应后端 GetPostsResponseDto）
export interface PostListResponse {
	items: PostListItem[];
	total: number;
	page: number;
	size: number;
}

// 获取文章列表的查询参数（对应后端 GetPostsQueryDto）
export interface PostListParams {
	slug?: string;
	title?: string;
	categoryID?: number;
	authorID?: number;
	pageNum?: number;
	pageSize?: number;
	status?: PostStatus;
	sortOrder?: "asc" | "desc";
}

// 创建文章请求（对应后端 CreatePostRequestDto）
export interface CreatePostRequest {
	title: string;
	content: string;
	slug: string;
	categoryID: number;
}

// 获取单个文章响应（对应后端 GetOnePostResponseDto）
export interface GetOnePostResponse {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	slug: string;
	status: PostStatus;
	authorID: number;
	categoryID: number;
	category: PostCategory;
	content: string;
}

// 更新文章请求（对应后端 UpdatePostRequestDto）
export interface UpdatePostRequest {
	title?: string;
	content?: string;
	slug?: string;
	categoryID?: number;
	authorID?: number;
	status?: PostStatus; // 0=草稿 1=已发布
}

// ===== 前端辅助类型（仅用于表单和展示） =====

// 前端友好的状态字符串
export type PostStatusString = "draft" | "published";

// 状态转换工具
export const PostStatusMap = {
	toNumber: (status: PostStatusString): PostStatus => {
		return status === "draft" ? 0 : 1;
	},
	toString: (status: PostStatus): PostStatusString => {
		return status === 0 ? "draft" : "published";
	},
};

// 标签转换工具
export const TagUtils = {
	toArray: (tagString: string): string[] => {
		return tagString ? tagString.split(",").filter(Boolean) : [];
	},
	toString: (tags: string[]): string => {
		return tags.join(",");
	},
};
