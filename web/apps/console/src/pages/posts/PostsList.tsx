import {
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Badge,
	Button,
	Card,
	DatePicker,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../types";
import { mockPosts } from "../../utils/mockData";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const PostsList: React.FC = () => {
	const navigate = useNavigate();
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchText, setSearchText] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");

	// 过滤后的文章数据
	const filteredPosts = mockPosts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchText.toLowerCase()) ||
			post.author.toLowerCase().includes(searchText.toLowerCase());
		const matchesStatus = !statusFilter || post.status === statusFilter;
		const matchesCategory = !categoryFilter || post.category === categoryFilter;

		return matchesSearch && matchesStatus && matchesCategory;
	});

	// 表格列定义
	const columns = [
		{
			title: "文章信息",
			dataIndex: "title",
			key: "title",
			width: 300,
			render: (title: string, record: Post) => (
				<div className="flex items-start space-x-3">
					<Avatar
						size={40}
						shape="square"
						src={`https://picsum.photos/seed/${record.id}/80/80`}
						className="rounded-lg"
					/>
					<div className="flex-1 min-w-0">
						<div className="font-medium text-gray-900 truncate">{title}</div>
						<div className="text-sm text-gray-500 mt-1">
							{record.excerpt.substring(0, 60)}...
						</div>
						<div className="flex items-center space-x-4 mt-2">
							<Space size="small">
								{record.tags.map((tag) => (
									<Tag key={tag} color="blue">
										{tag}
									</Tag>
								))}
							</Space>
						</div>
					</div>
				</div>
			),
		},
		{
			title: "作者",
			dataIndex: "author",
			key: "author",
			width: 120,
			render: (author: string) => (
				<div className="flex items-center space-x-2">
					<Avatar
						size={24}
						src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`}
					/>
					<span className="text-sm">{author}</span>
				</div>
			),
		},
		{
			title: "分类",
			dataIndex: "category",
			key: "category",
			width: 100,
			render: (category: string) => <Tag color="purple">{category}</Tag>,
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: (status: string) => {
				const statusConfig = {
					published: { color: "success", text: "已发布", count: 1 },
					draft: { color: "warning", text: "草稿", count: 0 },
					archived: { color: "default", text: "已归档", count: 0 },
				};
				const config = statusConfig[status as keyof typeof statusConfig];
				return (
					<Badge
						count={config.count}
						dot={config.count > 0}
						color={config.color === "success" ? "#52c41a" : undefined}
					>
						<Tag color={config.color}>{config.text}</Tag>
					</Badge>
				);
			},
		},
		{
			title: "浏览量",
			dataIndex: "viewCount",
			key: "viewCount",
			width: 100,
			sorter: (a: Post, b: Post) => a.viewCount - b.viewCount,
			render: (viewCount: number) => (
				<Space>
					<EyeOutlined className="text-gray-400" />
					<span className="text-sm">{viewCount.toLocaleString()}</span>
				</Space>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 120,
			sorter: (a: Post, b: Post) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (createdAt: string) => (
				<div className="text-sm text-gray-600">
					{new Date(createdAt).toLocaleDateString("zh-CN")}
				</div>
			),
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			fixed: "right" as const,
			render: (_: any, record: Post) => (
				<Space size="small">
					<Tooltip title="查看">
						<Button
							type="text"
							icon={<EyeOutlined />}
							size="small"
							onClick={() => handleView(record)}
						/>
					</Tooltip>
					<Tooltip title="编辑">
						<Button
							type="text"
							icon={<EditOutlined />}
							size="small"
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Popconfirm
						title="确定删除这篇文章吗？"
						description="删除后无法恢复，请谨慎操作。"
						onConfirm={() => handleDelete(record)}
						okText="确定"
						cancelText="取消"
					>
						<Tooltip title="删除">
							<Button
								type="text"
								icon={<DeleteOutlined />}
								size="small"
								danger
							/>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	// 事件处理函数
	const handleView = (record: Post) => {
		console.log("查看文章:", record);
		Modal.info({
			title: record.title,
			content: `${record.content.substring(0, 200)}...`,
			width: 600,
		});
	};

	const handleEdit = (record: Post) => {
		console.log("编辑文章:", record);
		navigate(`/posts/edit/${record.id}`);
	};

	const handleDelete = (record: Post) => {
		console.log("删除文章:", record);
	};

	const handleBatchDelete = () => {
		console.log("批量删除:", selectedRowKeys);
		Modal.confirm({
			title: "确定删除选中的文章吗？",
			content: `将删除 ${selectedRowKeys.length} 篇文章，此操作无法恢复。`,
			okText: "确定删除",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				// 这里添加批量删除逻辑
				setSelectedRowKeys([]);
			},
		});
	};

	const handleExport = () => {
		console.log("导出数据");
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: setSelectedRowKeys,
	};

	// 获取唯一的分类列表
	const categories = Array.from(
		new Set(mockPosts.map((post) => post.category)),
	);

	return (
		<div className="p-6 space-y-6">
			{/* 页面标题和操作按钮 */}
			<div className="flex items-center justify-between">
				<div>
					<Title level={2} className="m-0">
						文章管理
					</Title>
					<Text className="text-gray-600">
						管理您的博客文章，包括创建、编辑和发布
					</Text>
				</div>
				<Space>
					<Button icon={<ExportOutlined />} onClick={handleExport}>
						导出
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => navigate("/posts/create")}
					>
						创建文章
					</Button>
				</Space>
			</div>

			{/* 搜索和筛选区域 */}
			<Card className="mb-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Input
						placeholder="搜索文章标题或作者..."
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
					<Select
						placeholder="选择状态"
						value={statusFilter}
						onChange={setStatusFilter}
						allowClear
						className="w-full"
					>
						<Select.Option value="published">已发布</Select.Option>
						<Select.Option value="draft">草稿</Select.Option>
						<Select.Option value="archived">已归档</Select.Option>
					</Select>
					<Select
						placeholder="选择分类"
						value={categoryFilter}
						onChange={setCategoryFilter}
						allowClear
						className="w-full"
					>
						{categories.map((category) => (
							<Select.Option key={category} value={category}>
								{category}
							</Select.Option>
						))}
					</Select>
					<RangePicker
						placeholder={["开始日期", "结束日期"]}
						className="w-full"
					/>
				</div>
			</Card>

			{/* 批量操作栏 */}
			{selectedRowKeys.length > 0 && (
				<Card className="bg-blue-50 border-blue-200">
					<div className="flex items-center justify-between">
						<Text>
							已选择 <strong>{selectedRowKeys.length}</strong> 篇文章
						</Text>
						<Space>
							<Button size="small">批量发布</Button>
							<Button size="small">批量归档</Button>
							<Button size="small" danger onClick={handleBatchDelete}>
								批量删除
							</Button>
						</Space>
					</div>
				</Card>
			)}

			{/* 文章列表表格 */}
			<Card>
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={filteredPosts}
					rowKey="id"
					pagination={{
						total: filteredPosts.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
					}}
					scroll={{ x: 1200 }}
					size="middle"
				/>
			</Card>
		</div>
	);
};

export default PostsList;
