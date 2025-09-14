import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import type { RouteItem } from "@/types";

// biome-ignore lint/suspicious/noExplicitAny: Module conversion utility function
function convert(m: any) {
	const { default: Component } = m;

	return {
		Component,
	};
}

export const routes: RouteItem[] = [
	// 认证相关路由
	{
		path: "/login",
		lazy: () => import("@/pages/auth/Login").then(convert),
	},
	{
		path: "/register",
		lazy: () => import("@/pages/auth/Register").then(convert),
	},
	{
		path: "/forgot-password",
		lazy: () => import("@/pages/auth/ForgotPassword").then(convert),
	},
	// 主应用路由
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				lazy: () => import("@/pages/dashboard/Dashboard").then(convert),
			},
			{
				path: "dashboard",
				lazy: () => import("@/pages/dashboard/Dashboard").then(convert),
				handle: {
					icon: "DashboardOutlined",
					title: "仪表盘",
					order: 1,
				},
			},
			{
				path: "posts",
				handle: {
					icon: "FileTextOutlined",
					title: "文章管理",
					order: 2,
				},
				children: [
					{
						index: true,
						lazy: () => import("@/pages/posts/PostsList").then(convert),
					},
					{
						path: "create",
						lazy: () => import("@/pages/posts/PostEditor").then(convert),
						handle: {
							title: "创建文章",
							order: 2,
						},
					},
					{
						path: "edit/:id",
						lazy: () => import("@/pages/posts/PostEditor").then(convert),
						handle: {
							title: "编辑文章",
							order: 3,
						},
					},
				],
			},
			{
				path: "categories",
				lazy: () => import("@/pages/categories/Categories").then(convert),
				handle: {
					icon: "TagsOutlined",
					title: "分类管理",
					order: 2,
				},
			},
			{
				path: "media",
				lazy: () => import("@/pages/media/Media").then(convert),
				handle: {
					icon: "FileImageOutlined",
					title: "媒体文件",
					order: 3,
				},
			},
			{
				path: "users",
				lazy: () => import("@/pages/users/UserManagement").then(convert),
				handle: {
					icon: "UserOutlined",
					title: "用户管理",
					order: 4,
				},
			},
			{
				path: "demo/login",
				lazy: () => import("@/pages/demo/LoginDemo").then(convert),
				handle: {
					icon: "LogoutOutlined",
					title: "登录演示",
					order: 5,
				},
			},
		],
	},
];

export const router = createBrowserRouter(routes);
