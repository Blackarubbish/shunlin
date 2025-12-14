import type { RouteObject } from "react-router-dom";
import type { IconNameKeysUnion } from "@/components/Icons";

// 用户类型
export interface User {
	id: number;
	username: string;
	email: string;
	role: "admin" | "editor";
	status: "active" | "inactive";
}

// 统计数据类型
export interface DashboardStats {
	totalPosts: number;
	publishedPosts: number;
	draftPosts: number;
	totalCategories: number;
	totalMediaFiles: number;
	totalUsers: number;
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

// 导出各模块类型
export * from "./auth";
export * from "./categories";
export * from "./posts";
export * from "./media";
