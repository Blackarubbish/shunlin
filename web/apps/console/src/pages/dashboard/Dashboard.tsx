import {
	ArrowUpOutlined,
	EditOutlined,
	EyeOutlined,
	FileImageOutlined,
	FileTextOutlined,
	TagsOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Col,
	List,
	Progress,
	Row,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
} from "antd";
import type React from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";

// import { mockDashboardStats } from "../../utils/mockData";

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
	const navigate = useNavigate();

	// 临时数据占位
	const stats = {
		totalPosts: 156,
		publishedPosts: 128,
		totalCategories: 12,
		totalMediaFiles: 342,
		recentPosts: [
			{
				id: "1",
				title: "React 18 新特性详解",
				author: "张三",
				createdAt: "2024-11-25",
				category: "前端开发",
				status: "published",
				viewCount: 1250,
			},
			{
				id: "2",
				title: "TypeScript 高级类型系统",
				author: "李四",
				createdAt: "2024-11-24",
				category: "编程语言",
				status: "published",
				viewCount: 980,
			},
			{
				id: "3",
				title: "前端性能优化实战",
				author: "王五",
				createdAt: "2024-11-23",
				category: "前端开发",
				status: "draft",
				viewCount: 650,
			},
			{
				id: "4",
				title: "Node.js 微服务架构",
				author: "赵六",
				createdAt: "2024-11-22",
				category: "后端开发",
				status: "published",
				viewCount: 520,
			},
			{
				id: "5",
				title: "GraphQL 完整指南",
				author: "张三",
				createdAt: "2024-11-20",
				category: "后端开发",
				status: "archived",
				viewCount: 430,
			},
		],
		popularPosts: [
			{
				id: "1",
				title: "深入理解 JavaScript 闭包",
				viewCount: 15680,
			},
			{
				id: "2",
				title: "CSS Grid 布局完全指南",
				viewCount: 12340,
			},
			{
				id: "3",
				title: "Vue 3 Composition API 实战",
				viewCount: 10250,
			},
			{
				id: "4",
				title: "Docker 容器化部署实践",
				viewCount: 8960,
			},
			{
				id: "5",
				title: "MongoDB 数据库设计",
				viewCount: 7820,
			},
		],
	};

	// 最近文章表格列定义
	const recentPostsColumns = [
		{
			title: "标题",
			dataIndex: "title",
			key: "title",
			render: (title: string, record: Post) => (
				<div>
					<Text strong className="text-gray-900">
						{title}
					</Text>
					<div className="text-xs text-gray-500 mt-1">
						{record.author} ·{" "}
						{new Date(record.createdAt).toLocaleDateString("zh-CN")}
					</div>
				</div>
			),
		},
		{
			title: "分类",
			dataIndex: "category",
			key: "category",
			render: (category: string) => <Tag color="blue">{category}</Tag>,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: string) => {
				const statusConfig = {
					published: { color: "success", text: "已发布" },
					draft: { color: "warning", text: "草稿" },
					archived: { color: "default", text: "已归档" },
				};
				const config = statusConfig[status as keyof typeof statusConfig];
				return <Tag color={config.color}>{config.text}</Tag>;
			},
		},
		{
			title: "浏览量",
			dataIndex: "viewCount",
			key: "viewCount",
			render: (viewCount: number) => (
				<Space>
					<EyeOutlined className="text-gray-400" />
					<span>{viewCount.toLocaleString()}</span>
				</Space>
			),
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: Post) => (
				<Button
					type="text"
					icon={<EditOutlined />}
					size="small"
					onClick={() => navigate(`/posts/edit/${record.id}`)}
				>
					编辑
				</Button>
			),
		},
	];

	// 热门文章列表项
	const popularPostsData = stats.popularPosts.map((post, index) => ({
		title: (
			<div className="flex items-center space-x-3">
				<div
					className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
						index < 3
							? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
							: "bg-gray-100 text-gray-600"
					}`}
				>
					{index + 1}
				</div>
				<div className="flex-1">
					<Text strong className="text-gray-900">
						{post.title}
					</Text>
					<div className="text-xs text-gray-500 mt-1">
						{post.viewCount.toLocaleString()} 次浏览
					</div>
				</div>
			</div>
		),
	}));

	return (
		<div className="p-6 space-y-6">
			{/* 页面标题 */}
			<div className="mb-6">
				<Title level={2} className="m-0 text-gray-900">
					仪表盘
				</Title>
				<Text className="text-gray-600">欢迎回来，这里是您的博客管理概览</Text>
			</div>

			{/* 统计卡片 */}
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="总文章数"
							value={stats.totalPosts}
							prefix={<FileTextOutlined className="text-blue-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
						<div className="mt-2 text-sm text-gray-500">
							<ArrowUpOutlined className="text-green-500" /> 较上月增长 12%
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="已发布"
							value={stats.publishedPosts}
							prefix={<EyeOutlined className="text-green-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
						<div className="mt-2">
							<Progress
								percent={Math.round(
									(stats.publishedPosts / stats.totalPosts) * 100,
								)}
								size="small"
								strokeColor="#10b981"
								showInfo={false}
							/>
							<Text className="text-xs text-gray-500">
								发布率{" "}
								{Math.round((stats.publishedPosts / stats.totalPosts) * 100)}%
							</Text>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="分类数量"
							value={stats.totalCategories}
							prefix={<TagsOutlined className="text-purple-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
						<div className="mt-2 text-sm text-gray-500">
							<ArrowUpOutlined className="text-green-500" /> 新增 2 个分类
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card className="h-full">
						<Statistic
							title="媒体文件"
							value={stats.totalMediaFiles}
							prefix={<FileImageOutlined className="text-orange-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
						<div className="mt-2 text-sm text-gray-500">存储空间使用 68%</div>
					</Card>
				</Col>
			</Row>

			{/* 内容区域 */}
			<Row gutter={[16, 16]}>
				{/* 最近文章 */}
				<Col xs={24} xl={14}>
					<Card
						title={
							<div className="flex items-center justify-between">
								<span>最近文章</span>
								<Button
									type="link"
									size="small"
									onClick={() => navigate("/posts")}
								>
									查看全部
								</Button>
							</div>
						}
						className="h-full"
					>
						<Table
							dataSource={stats.recentPosts}
							columns={recentPostsColumns}
							rowKey="id"
							pagination={false}
							size="small"
							className="border-none"
						/>
					</Card>
				</Col>

				{/* 热门文章 */}
				<Col xs={24} xl={10}>
					<Card
						title={
							<div className="flex items-center justify-between">
								<span>热门文章</span>
								<Button type="link" size="small">
									查看更多
								</Button>
							</div>
						}
						className="h-full"
					>
						<List
							dataSource={popularPostsData}
							renderItem={(item) => (
								<List.Item className="border-none px-0">{item.title}</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>

			{/* 快速操作 */}
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Card title="快速操作">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Button
								type="primary"
								size="large"
								icon={<FileTextOutlined />}
								className="h-16 flex flex-col items-center justify-center"
								onClick={() => navigate("/posts/create")}
							>
								<span className="text-sm">创建文章</span>
							</Button>

							<Button
								size="large"
								icon={<TagsOutlined />}
								className="h-16 flex flex-col items-center justify-center"
								onClick={() => navigate("/categories")}
							>
								<span className="text-sm">管理分类</span>
							</Button>

							<Button
								size="large"
								icon={<FileImageOutlined />}
								className="h-16 flex flex-col items-center justify-center"
								onClick={() => navigate("/media")}
							>
								<span className="text-sm">上传媒体</span>
							</Button>

							<Button
								size="large"
								icon={<UserOutlined />}
								className="h-16 flex flex-col items-center justify-center"
								onClick={() => navigate("/users")}
							>
								<span className="text-sm">用户管理</span>
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
