import {
	DeleteOutlined,
	EditOutlined,
	FileTextOutlined,
	PlusOutlined,
	TagsOutlined,
} from "@ant-design/icons";
import {
	App,
	Button,
	Card,
	Col,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Space,
	Spin,
	Statistic,
	Table,
	Tooltip,
	Typography,
} from "antd";
import { pinyin } from "pinyin-pro";
import type React from "react";
import { useState } from "react";
import {
	useCategories,
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from "@/hooks/useCategories";
import type { CategoryItem } from "@/types/categories";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const Categories: React.FC = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
		null
	);
	const [form] = Form.useForm();

	// 使用真实API
	const { data, isLoading } = useCategories();
	const categories = data?.items || [];
	const total = data?.total || 0;
	const { message } = App.useApp();
	const createCategoryMutation = useCreateCategory({
		onSuccess: () => {
			message.success("分类创建成功！");
		},
		onError: (error) => {
			message.error(error.message || "创建分类失败，请重试");
		},
	});
	const updateCategoryMutation = useUpdateCategory({
		onSuccess: () => {
			message.success("分类更新成功！");
		},
		onError: (error) => {
			message.error(error.message || "更新分类失败，请重试");
		},
	});
	const deleteCategoryMutation = useDeleteCategory({
		onSuccess: () => {
			message.success("分类删除成功！");
		},
		onError: (error) => {
			message.error(error.message || "删除分类失败，请重试");
		},
	});

	// 统计数据
	const totalPosts = categories.reduce(
		(sum, category) => sum + (category.postCount || 0),
		0
	);
	const averagePostsPerCategory =
		categories.length > 0 ? Math.round(totalPosts / categories.length) : 0;

	// 表格列定义
	const columns = [
		{
			title: "分类信息",
			dataIndex: "name",
			key: "name",
			render: (name: string) => (
				<div>
					<Text strong className="text-gray-900">
						{name}
					</Text>
				</div>
			),
		},
		{
			title: "别名",
			dataIndex: "slug",
			key: "slug",
			render: (slug: string) => (
				<Text className="text-sm text-gray-600">{slug}</Text>
			),
		},
		{
			title: "描述",
			dataIndex: "description",
			key: "description",
			render: (description: string) => (
				<Text className="text-sm text-gray-600">{description || "-"}</Text>
			),
		},
		{
			title: "文章数量",
			dataIndex: "postCount",
			key: "postCount",
			width: 120,
			sorter: (a: CategoryItem, b: CategoryItem) => a.postCount - b.postCount,
			render: (postCount: number) => (
				<div className="text-center">
					<div className="text-lg font-semibold text-blue-600">
						{postCount || 0}
					</div>
					<div className="text-xs text-gray-500">篇文章</div>
				</div>
			),
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 150,
			sorter: (a: CategoryItem, b: CategoryItem) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (createdAt: string) => (
				<span className="text-xs text-gray-500">
					{new Date(createdAt).toLocaleDateString("zh-CN")}
				</span>
			),
		},
		{
			title: "操作",
			key: "action",
			width: 120,
			render: (_: any, record: CategoryItem) => (
				<Space size="small">
					<Tooltip title="编辑分类">
						<Button
							type="text"
							icon={<EditOutlined />}
							size="small"
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Popconfirm
						title="确定删除这个分类吗？"
						description={`分类下有 ${record.postCount} 篇文章，删除后这些文章将变为未分类状态。`}
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
						disabled={record.postCount > 0}
					>
						<Tooltip
							title={
								record.postCount > 0 ? "该分类下还有文章，无法删除" : "删除分类"
							}
						>
							<Button
								type="text"
								icon={<DeleteOutlined />}
								danger
								disabled={record.postCount > 0}
							/>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	// 打开创建/编辑模态框
	const handleCreate = () => {
		setEditingCategory(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (category: CategoryItem) => {
		setEditingCategory(category);
		form.setFieldsValue({
			name: category.name,
			description: category.description,
			slug: category.slug,
		});
		setIsModalVisible(true);
	};

	// 处理表单提交
	const handleSubmit = async (values: any) => {
		try {
			if (editingCategory) {
				await updateCategoryMutation.mutateAsync({
					id: editingCategory.id,
					data: {
						name: values.name,
						slug: values.slug,
						description: values.description,
					},
				});
			} else {
				// 创建新分类
				await createCategoryMutation.mutateAsync({
					name: values.name,
					slug: values.slug,
					description: values.description,
				});
			}

			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			console.error("操作失败:", error);
		}
	};

	// 删除分类
	const handleDelete = async (categoryId: number) => {
		try {
			await deleteCategoryMutation.mutateAsync(categoryId);
		} catch (error) {
			console.error("删除失败:", error);
		}
	};

	// 生成 slug - 使用 pinyin-pro 自动转换中文为拼音
	const generateSlug = (name: string) => {
		if (!name) return "";

		// 使用 pinyin-pro 转换，pattern 设置为 'pinyin' 只转换中文
		const pinyinStr = pinyin(name, {
			toneType: "none", // 不带声调
			type: "string", // 返回字符串
			separator: "-", // 中文字之间用连字符分隔
			pattern: "pinyin", // 只转换中文，保留其他字符
			nonZh: "consecutive", // 保留非中文字符
		});

		return pinyinStr
			.toLowerCase()
			.replace(/\s+/g, "-") // 空格转为连字符
			.replace(/[^\w-]/g, "") // 移除非字母数字和连字符的字符
			.replace(/-+/g, "-") // 多个连字符合并为一个
			.replace(/^-|-$/g, ""); // 移除开头和结尾的连字符
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
						分类管理
					</Title>
					<Text className="text-gray-600">
						管理博客文章的分类，帮助读者更好地浏览内容
					</Text>
				</div>
				<div className="flex items-center space-x-2">
					<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
						创建分类
					</Button>
					<Button
						type="primary"
						onClick={() => {
							console.log("message", message);
							message.success("刷新成功！");
						}}
					>
						刷新
					</Button>
				</div>
			</div>

			{/* 统计卡片 */}
			<Row gutter={16}>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="总分类数"
							value={total}
							prefix={<TagsOutlined className="text-blue-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="总文章数"
							value={totalPosts}
							prefix={<FileTextOutlined className="text-green-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="平均文章数"
							value={averagePostsPerCategory}
							suffix="篇/分类"
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
			</Row>

			{/* 分类列表 */}
			<Card>
				<Table
					columns={columns}
					dataSource={categories}
					rowKey="id"
					pagination={{
						total: total,
						current: data?.page || 1,
						pageSize: data?.pageSize || 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
					}}
				/>
			</Card>

			{/* 创建/编辑分类模态框 */}
			<Modal
				title={editingCategory ? "编辑分类" : "创建分类"}
				open={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					form.resetFields();
				}}
				footer={null}
				width={600}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="mt-4"
				>
					<Form.Item
						name="name"
						label="分类名称"
						rules={[
							{ required: true, message: "请输入分类名称" },
							{ min: 2, message: "分类名称至少2个字符" },
							{ max: 50, message: "分类名称不能超过50个字符" },
						]}
					>
						<Input
							placeholder="输入分类名称"
							onChange={(e) => {
								const slug = generateSlug(e.target.value);
								form.setFieldsValue({ slug });
							}}
						/>
					</Form.Item>

					<Form.Item
						name="slug"
						label="分类别名"
						rules={[
							{ required: true, message: "请输入分类别名" },
							{
								pattern: /^[a-z0-9-]+$/,
								message: "别名只能包含小写字母、数字和连字符",
							},
						]}
					>
						<Input placeholder="category-slug" />
					</Form.Item>

					<Form.Item
						name="description"
						label="分类描述"
						rules={[{ max: 200, message: "描述不能超过200个字符" }]}
					>
						<TextArea
							placeholder="简要描述这个分类的用途..."
							rows={4}
							showCount
							maxLength={200}
						/>
					</Form.Item>

					<div className="flex justify-end space-x-3 pt-4">
						<Button
							onClick={() => {
								setIsModalVisible(false);
								form.resetFields();
							}}
						>
							取消
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={
								createCategoryMutation.isPending ||
								updateCategoryMutation.isPending
							}
						>
							{editingCategory ? "更新分类" : "创建分类"}
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default Categories;
