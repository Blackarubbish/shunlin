import type { Category, DashboardStats, MediaFile, Post, User } from "../types";

// 模拟用户数据
export const mockUsers: User[] = [
	{
		id: 1,
		username: "admin",
		email: "admin@example.com",
		role: "admin",
		status: "active",
		createdAt: "2024-01-15T08:00:00Z",
		updatedAt: "2024-01-15T08:00:00Z",
	},
	{
		id: 2,
		username: "editor1",
		email: "editor1@example.com",
		role: "editor",
		status: "active",
		createdAt: "2024-02-01T09:00:00Z",
		updatedAt: "2024-02-01T09:00:00Z",
	},
	{
		id: 3,
		username: "editor2",
		email: "editor2@example.com",
		role: "editor",
		status: "inactive",
		createdAt: "2024-02-15T10:00:00Z",
		updatedAt: "2024-02-15T10:00:00Z",
	},
];

// 模拟分类数据
export const mockCategories: Category[] = [
	{
		id: 1,
		name: "技术分享",
		description: "分享最新的技术趋势和开发经验",
		slug: "tech-sharing",
		postCount: 15,
		createdAt: "2024-01-10T08:00:00Z",
		updatedAt: "2024-01-10T08:00:00Z",
	},
	{
		id: 2,
		name: "生活随笔",
		description: "记录生活中的点点滴滴",
		slug: "life-notes",
		postCount: 8,
		createdAt: "2024-01-12T08:00:00Z",
		updatedAt: "2024-01-12T08:00:00Z",
	},
	{
		id: 3,
		name: "学习笔记",
		description: "学习过程中的总结和思考",
		slug: "study-notes",
		postCount: 12,
		createdAt: "2024-01-14T08:00:00Z",
		updatedAt: "2024-01-14T08:00:00Z",
	},
	{
		id: 4,
		name: "产品思考",
		description: "对产品设计和用户体验的思考",
		slug: "product-thinking",
		postCount: 6,
		createdAt: "2024-01-16T08:00:00Z",
		updatedAt: "2024-01-16T08:00:00Z",
	},
];

// 模拟文章数据
export const mockPosts: Post[] = [
	{
		id: 1,
		title: "React 19 新特性详解",
		content: "这是一篇关于 React 19 新特性的详细介绍...",
		excerpt:
			"React 19 带来了许多激动人心的新特性，包括并发特性、自动批处理等...",
		status: "published",
		authorId: 1,
		author: "admin",
		categoryId: 1,
		category: "技术分享",
		tags: ["React", "JavaScript", "前端"],
		viewCount: 1250,
		createdAt: "2024-03-01T10:00:00Z",
		updatedAt: "2024-03-01T10:00:00Z",
		publishedAt: "2024-03-01T10:00:00Z",
	},
	{
		id: 2,
		title: "Tailwind CSS v4 使用指南",
		content: "详细介绍 Tailwind CSS v4 的新功能和使用方法...",
		excerpt:
			"Tailwind CSS v4 引入了全新的架构，让开发者能够更高效地构建现代化界面...",
		status: "published",
		authorId: 2,
		author: "editor1",
		categoryId: 1,
		category: "技术分享",
		tags: ["CSS", "Tailwind", "样式"],
		viewCount: 980,
		createdAt: "2024-03-05T14:30:00Z",
		updatedAt: "2024-03-05T14:30:00Z",
		publishedAt: "2024-03-05T14:30:00Z",
	},
	{
		id: 3,
		title: "如何提高工作效率",
		content: "分享一些提高工作效率的实用方法和工具...",
		excerpt: "在快节奏的工作环境中，提高效率是每个人都关心的话题...",
		status: "draft",
		authorId: 1,
		author: "admin",
		categoryId: 2,
		category: "生活随笔",
		tags: ["效率", "工作", "生活"],
		viewCount: 0,
		createdAt: "2024-03-08T09:15:00Z",
		updatedAt: "2024-03-08T09:15:00Z",
	},
	{
		id: 4,
		title: "TypeScript 高级类型应用",
		content: "深入探讨 TypeScript 中的高级类型系统...",
		excerpt:
			"TypeScript 的类型系统非常强大，掌握高级类型能让我们写出更安全的代码...",
		status: "published",
		authorId: 2,
		author: "editor1",
		categoryId: 3,
		category: "学习笔记",
		tags: ["TypeScript", "类型系统", "编程"],
		viewCount: 756,
		createdAt: "2024-03-10T16:20:00Z",
		updatedAt: "2024-03-10T16:20:00Z",
		publishedAt: "2024-03-10T16:20:00Z",
	},
	{
		id: 5,
		title: "用户体验设计原则",
		content: "探讨优秀用户体验设计的核心原则...",
		excerpt:
			"好的用户体验设计不仅仅是美观，更重要的是要符合用户的使用习惯和心理预期...",
		status: "published",
		authorId: 1,
		author: "admin",
		categoryId: 4,
		category: "产品思考",
		tags: ["UX", "设计", "用户体验"],
		viewCount: 432,
		createdAt: "2024-03-12T11:45:00Z",
		updatedAt: "2024-03-12T11:45:00Z",
		publishedAt: "2024-03-12T11:45:00Z",
	},
];

// 模拟媒体文件数据
export const mockMediaFiles: MediaFile[] = [
	{
		id: 1,
		filename: "hero-image-1.jpg",
		originalName: "首页英雄图.jpg",
		mimeType: "image/jpeg",
		size: 245760,
		url: "/uploads/hero-image-1.jpg",
		thumbnailUrl: "/uploads/thumbnails/hero-image-1-thumb.jpg",
		uploadedBy: 1,
		uploaderName: "admin",
		createdAt: "2024-02-20T14:30:00Z",
	},
	{
		id: 2,
		filename: "article-cover-2.png",
		originalName: "文章封面图2.png",
		mimeType: "image/png",
		size: 156890,
		url: "/uploads/article-cover-2.png",
		thumbnailUrl: "/uploads/thumbnails/article-cover-2-thumb.png",
		uploadedBy: 2,
		uploaderName: "editor1",
		createdAt: "2024-02-22T09:15:00Z",
	},
	{
		id: 3,
		filename: "demo-video.mp4",
		originalName: "演示视频.mp4",
		mimeType: "video/mp4",
		size: 15678900,
		url: "/uploads/demo-video.mp4",
		uploadedBy: 1,
		uploaderName: "admin",
		createdAt: "2024-02-25T16:45:00Z",
	},
	{
		id: 4,
		filename: "document.pdf",
		originalName: "技术文档.pdf",
		mimeType: "application/pdf",
		size: 987654,
		url: "/uploads/document.pdf",
		uploadedBy: 2,
		uploaderName: "editor1",
		createdAt: "2024-02-28T13:20:00Z",
	},
];

// 模拟仪表盘统计数据
export const mockDashboardStats: DashboardStats = {
	totalPosts: mockPosts.length,
	publishedPosts: mockPosts.filter((post) => post.status === "published")
		.length,
	draftPosts: mockPosts.filter((post) => post.status === "draft").length,
	totalCategories: mockCategories.length,
	totalMediaFiles: mockMediaFiles.length,
	totalUsers: mockUsers.length,
	recentPosts: mockPosts.slice(0, 5),
	popularPosts: mockPosts
		.filter((post) => post.status === "published")
		.sort((a, b) => b.viewCount - a.viewCount)
		.slice(0, 5),
};
