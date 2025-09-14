import type { RouteObject } from "react-router-dom";
import type { IconNameKeysUnion } from "@/components/Icons";

// 用户类型
export interface User {
	id: number;
	username: string;
	email: string;
	role: "admin" | "editor";
	status: "active" | "inactive";
	createdAt: string;
	updatedAt: string;
}

// 文章类型
export interface Post {
	id: number;
	title: string;
	content: string;
	excerpt: string;
	status: "published" | "draft" | "archived";
	authorId: number;
	author: string;
	categoryId: number;
	category: string;
	tags: string[];
	viewCount: number;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
}

// 分类类型
export interface Category {
	id: number;
	name: string;
	description: string;
	slug: string;
	postCount: number;
	createdAt: string;
	updatedAt: string;
}

// 媒体文件类型
export interface MediaFile {
	id: number;
	filename: string;
	originalName: string;
	mimeType: string;
	size: number;
	url: string;
	thumbnailUrl?: string;
	uploadedBy: number;
	uploaderName: string;
	createdAt: string;
}

// 统计数据类型
export interface DashboardStats {
	totalPosts: number;
	publishedPosts: number;
	draftPosts: number;
	totalCategories: number;
	totalMediaFiles: number;
	totalUsers: number;
	recentPosts: Post[];
	popularPosts: Post[];
}

// API响应类型
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	total?: number;
	page?: number;
	pageSize?: number;
}

// 分页参数类型
export interface PaginationParams {
	page: number;
	pageSize: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	search?: string;
}

export type RouteItem = RouteObject & {
	handle?: {
		title?: string;
		icon?: IconNameKeysUnion;
		hidden?: boolean;
		order?: number;
	};
	children?: RouteItem[];
};
