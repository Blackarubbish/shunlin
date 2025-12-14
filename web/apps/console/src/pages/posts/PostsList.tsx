import { TagUtils } from "@/types/posts";
import {
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import {
	Badge,
	Button,
	Card,
	DatePicker,
	Input,
	Modal,
	Popconfirm,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeletePost, usePosts } from "../../hooks/usePosts";
import type { PostListItem } from "../../types/posts";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const PostsList: React.FC = () => {
	const navigate = useNavigate();
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchText, setSearchText] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [pageNum, setPageNum] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// 使用真实API获取文章列表
	const { data, isLoading, refetch } = usePosts({
		pageNum,
		pageSize,
		status: statusFilter ? (Number(statusFilter) as 0 | 1) : undefined,
		title: searchText,
	});

	// 删除文章的mutation
	const deletePostMutation = useDeletePost();

	// 过滤后的文章数据
	const posts = data?.items || [];
	const total = data?.total || 0;

	// 表格列定义
	const columns = [
		{
			title: "文章信息",
			dataIndex: "title",
			key: "title",
			width: 300,
			render: (title: string, record: PostListItem) => (
				<div className="flex items-start space-x-3">
					<div className="flex-1 min-w-0">
						<div className="font-medium text-gray-900 truncate">{title}</div>
						<div className="text-sm text-gray-500 mt-1">
							{record.slug || "无描述"}
						</div>
						<div className="flex items-center space-x-4 mt-2">
							<Space size="small">
								{TagUtils.toArray(record.tag).map((tag) => (
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
			title: "分类",
			dataIndex: "category",
			key: "category",
			width: 100,
			render: (category: PostListItem["category"]) => (
				<Tag color="purple">{category?.name || "未分类"}</Tag>
			),
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: (status: 0 | 1) => {
				const statusConfig = {
					0: { color: "warning", text: "草稿", count: 0 },
					1: { color: "success", text: "已发布", count: 1 },
				};
				const config = statusConfig[status];
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
			title: "更新时间",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 180,
			sorter: (a: PostListItem, b: PostListItem) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
			render: (updatedAt: string) => (
				<div className="text-sm text-gray-600">
					{new Date(updatedAt).toLocaleString("zh-CN")}
				</div>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 120,
			sorter: (a: PostListItem, b: PostListItem) =>
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
			render: (_: unknown, record: PostListItem) => (
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
	const handleView = (record: PostListItem) => {
		if (import.meta.env.DEV) {
			console.warn("查看文章:", record);
		}
		Modal.info({
			title: record.title,
			content: `文章 ID: ${record.id}`,
			width: 600,
		});
	};

	const handleEdit = (record: PostListItem) => {
		if (import.meta.env.DEV) {
			console.warn("编辑文章:", record);
		}
		navigate(`/posts/edit/${record.id}`);
	};

	const handleDelete = (record: PostListItem) => {
		deletePostMutation.mutate(record.id, {
			onSuccess: () => {
				refetch();
			},
		});
	};

	const handleBatchDelete = () => {
		Modal.confirm({
			title: "确定删除选中的文章吗？",
			content: `将删除 ${selectedRowKeys.length} 篇文章，此操作无法恢复。`,
			okText: "确定删除",
			okType: "danger",
			cancelText: "取消",
			onOk() {
				// 批量删除文章
				Promise.all(
					selectedRowKeys.map((id) =>
						deletePostMutation.mutateAsync(id as number)
					)
				).then(() => {
					setSelectedRowKeys([]);
					refetch();
				});
			},
		});
	};

	const handleExport = () => {
		if (import.meta.env.DEV) {
			console.warn("导出数据");
		}
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: setSelectedRowKeys,
	};

	// 获取唯一的分类列表
	const categories = Array.from(
		new Map(posts.map((post) => [post.category.id, post.category])).values()
	);

	// 处理搜索
	const handleSearch = () => {
		setPageNum(1); // 重置到第一页
		refetch();
	};

	if (isLoading) {
		return (
			<div className="p-6 flex justify-center items-center min-h-screen">
				<Spin size="large" tip="加载中..." />
			</div>
		);
	}

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
						onPressEnter={handleSearch}
						allowClear
					/>
					<Select
						placeholder="选择状态"
						value={statusFilter}
						onChange={(value) => {
							setStatusFilter(value);
							setPageNum(1);
						}}
						allowClear
						className="w-full"
					>
						<Select.Option value="1">已发布</Select.Option>
						<Select.Option value="0">草稿</Select.Option>
					</Select>
					<Select
						placeholder="选择分类"
						value={categoryFilter}
						onChange={(value) => {
							setCategoryFilter(value);
							setPageNum(1);
						}}
						allowClear
						className="w-full"
					>
						{categories.map((category) => (
							<Select.Option key={category.id} value={category.id.toString()}>
								{category.name}
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
					dataSource={posts}
					rowKey="id"
					loading={isLoading}
					pagination={{
						current: pageNum,
						pageSize: pageSize,
						total: total,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
						onChange: (page, size) => {
							setPageNum(page);
							setPageSize(size);
						},
					}}
					scroll={{ x: 1200 }}
					size="middle"
				/>
			</Card>
		</div>
	);
};

export default PostsList;
