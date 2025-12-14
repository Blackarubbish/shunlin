import { SLEditor } from "@/lib/sl-editor";
import { PostStatusMap } from "@/types/posts";
import {
	ArrowLeftOutlined,
	DownOutlined,
	EyeOutlined,
	SaveOutlined,
	SendOutlined,
	SettingOutlined,
	UpOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Form,
	Input,
	message,
	Select,
	Space,
	Spin,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import { pinyin } from "pinyin-pro";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useCreatePost, usePost, useUpdatePost } from "../../hooks/usePosts";
import "./PostEditor.css";

const { Text } = Typography;
const { TextArea } = Input;

export const PostEditor: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [content, setContent] = useState("");
	const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
	const [basicInfoCollapsed, setBasicInfoCollapsed] = useState(false);

	// 根据 URL 中是否有 id 来判断是创建还是编辑模式
	const mode = id ? "edit" : "create";

	// 使用真实API获取文章数据 (编辑模式)
	const { data: post, isLoading: isLoadingPost } = usePost(
		Number(id),
		mode === "edit" && !!id
	);

	// 获取分类列表
	const { data: categoriesData, isLoading: isLoadingCategories } =
		useCategories();
	const categories = categoriesData?.items || [];

	// 创建和更新文章的mutations
	const createPostMutation = useCreatePost();
	const updatePostMutation = useUpdatePost();

	// 根据模式和ID加载文章数据
	useEffect(() => {
		if (mode === "edit" && post) {
			// 后端不返回 tag 字段，默认空数组
			setTags([]);
			setContent(post.content);
			form.setFieldsValue({
				title: post.title,
				slug: post.slug,
				excerpt: "", // 后端不返回 excerpt，默认空
				categoryID: post.categoryID,
				status: PostStatusMap.toString(post.status), // 数字 -> 字符串
			});
		} else if (mode === "create") {
			form.setFieldsValue({
				status: "draft",
			});
		}
	}, [mode, post, form]);

	// 处理标签添加
	const handleAddTag = () => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag("");
		}
	};

	// 处理标签删除
	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	// 生成 slug - 使用 pinyin-pro 自动转换中文为拼音
	const generateSlug = (title: string) => {
		if (!title) return "";

		const pinyinStr = pinyin(title, {
			toneType: "none",
			type: "string",
			separator: "-",
			pattern: "pinyin",
			nonZh: "consecutive",
		});

		return pinyinStr
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]/g, "")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");
	};

	// 处理表单提交
	const handleSubmit = async (values: Record<string, unknown>) => {
		try {
			if (!content || content.trim() === "") {
				message.error("请输入文章内容");
				return;
			}

			// 确保 slug 格式正确（只包含小写字母、数字和连字符）
			let slug = values.slug as string;
			if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
				// 如果 slug 无效，从标题重新生成
				slug = generateSlug(values.title as string);
				form.setFieldsValue({ slug });
				message.warning("已自动修正文章别名格式");
			}

			// 构建后端请求数据
			const requestData = {
				title: values.title as string,
				slug: slug,
				content,
				categoryID: values.categoryID as number,
			};

			// 开发环境下输出调试信息
			if (import.meta.env.DEV) {
				console.warn("提交的文章数据:", requestData);
			}

			if (mode === "create") {
				await createPostMutation.mutateAsync(requestData);
				message.success("文章创建成功！");
				setTimeout(() => {
					navigate("/posts");
				}, 1000);
			} else if (mode === "edit" && id) {
				// 编辑模式：可能包含 status 字段
				const updateData = {
					...requestData,
					status:
						values.status !== undefined
							? PostStatusMap.toNumber(values.status as "draft" | "published")
							: undefined,
				};

				await updatePostMutation.mutateAsync({
					id: Number(id),
					data: updateData,
				});
				message.success("文章更新成功！");
				setTimeout(() => {
					navigate("/posts");
				}, 1000);
			}
		} catch (error) {
			console.error("保存失败:", error);
			message.error("保存失败，请重试");
		}
	};

	// 处理发布
	const handlePublish = async () => {
		try {
			const values = await form.validateFields();
			await handleSubmit({
				...values,
				status: "published",
			});
		} catch (error) {
			console.error("发布失败:", error);
			message.error("请检查表单信息是否完整");
		}
	};

	// 保存草稿
	const handleSaveDraft = async () => {
		try {
			const values = form.getFieldsValue();
			// 草稿模式下，只要有标题就可以保存
			if (!values.title) {
				message.error("请至少填写标题");
				return;
			}
			await handleSubmit({
				...values,
				status: "draft",
			});
		} catch (error) {
			console.error("保存草稿失败:", error);
			message.error("保存失败");
		}
	};

	const isLoading =
		isLoadingPost ||
		isLoadingCategories ||
		createPostMutation.isPending ||
		updatePostMutation.isPending;

	if (mode === "edit" && isLoadingPost) {
		return (
			<div className="p-6 flex justify-center items-center min-h-screen">
				<Spin size="large" tip="加载文章中..." />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 顶部操作栏 */}
			<div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-[1600px] mx-auto px-6 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Tooltip title="返回列表">
								<Button
									icon={<ArrowLeftOutlined />}
									onClick={() => navigate("/posts")}
									type="text"
								>
									返回
								</Button>
							</Tooltip>
							<div className="h-6 w-px bg-gray-300" />
							<Text className="text-base font-medium text-gray-700">
								{mode === "edit" ? "编辑文章" : "创建文章"}
							</Text>
							{mode === "edit" && post && (
								<Text type="secondary" className="text-sm">
									最后更新: {new Date(post.updatedAt).toLocaleString("zh-CN")}
								</Text>
							)}
						</div>

						<Space size="middle">
							<Button
								icon={<EyeOutlined />}
								onClick={() => message.info("预览功能开发中")}
							>
								预览
							</Button>
							<Button
								icon={<SaveOutlined />}
								onClick={handleSaveDraft}
								loading={isLoading}
							>
								保存草稿
							</Button>
							<Button
								type="primary"
								icon={<SendOutlined />}
								onClick={handlePublish}
								loading={isLoading}
							>
								发布文章
							</Button>
							<div className="h-6 w-px bg-gray-300" />
							<Tooltip title={settingsPanelOpen ? "关闭设置" : "更多设置"}>
								<Button
									icon={<SettingOutlined />}
									type={settingsPanelOpen ? "primary" : "default"}
									onClick={() => setSettingsPanelOpen(!settingsPanelOpen)}
								>
									{settingsPanelOpen ? "关闭设置" : "更多设置"}
								</Button>
							</Tooltip>
						</Space>
					</div>
				</div>
			</div>

			{/* 主内容区域 */}
			<div className="max-w-[1600px] mx-auto px-6 py-6">
				<div className="flex gap-6">
					{/* 左侧主编辑区 */}
					<div
						className={`flex-1 transition-all duration-300 ${
							settingsPanelOpen ? "mr-0" : "mr-0"
						}`}
					>
						{/* 基本信息区域 - 可折叠 */}
						<Card
							className="mb-4 shadow-sm"
							bodyStyle={{ padding: basicInfoCollapsed ? "12px 24px" : "24px" }}
						>
							<div className="flex items-center justify-between mb-4">
								<Text className="font-medium text-gray-700">基本信息</Text>
								<Button
									type="text"
									size="small"
									icon={basicInfoCollapsed ? <DownOutlined /> : <UpOutlined />}
									onClick={() => setBasicInfoCollapsed(!basicInfoCollapsed)}
								>
									{basicInfoCollapsed ? "展开" : "收起"}
								</Button>
							</div>

							{!basicInfoCollapsed && (
								<Form form={form} layout="vertical">
									<div className="grid grid-cols-1 gap-4">
										{/* 文章标题 */}
										<Form.Item
											name="title"
											label="文章标题"
											rules={[
												{ required: true, message: "请输入文章标题" },
												{ min: 5, message: "标题至少5个字符" },
												{ max: 100, message: "标题不能超过100个字符" },
											]}
										>
											<Input
												placeholder="输入一个吸引人的标题..."
												size="large"
												onChange={(e) => {
													const slug = generateSlug(e.target.value);
													form.setFieldsValue({ slug });
												}}
											/>
										</Form.Item>

										{/* 第二行：分类和Slug */}
										<div className="grid grid-cols-2 gap-4">
											<Form.Item
												name="categoryID"
												label="文章分类"
												rules={[{ required: true, message: "请选择文章分类" }]}
											>
												<Select placeholder="选择一个分类" size="large">
													{categories.map((category) => (
														<Select.Option
															key={category.id}
															value={category.id}
														>
															{category.name}
														</Select.Option>
													))}
												</Select>
											</Form.Item>

											<Form.Item
												name="slug"
												label="文章别名 (URL)"
												rules={[
													{ required: true, message: "请输入文章别名" },
													{
														pattern: /^[a-z0-9-]+$/,
														message: "别名只能包含小写字母、数字和连字符",
													},
												]}
												tooltip="用于生成文章的 URL，会自动从标题生成"
											>
												<Input placeholder="my-article-slug" size="large" />
											</Form.Item>
										</div>

										{/* 文章摘要 */}
										<Form.Item
											name="excerpt"
											label="文章摘要"
											rules={[
												{ required: true, message: "请输入文章摘要" },
												{ max: 300, message: "摘要不能超过300个字符" },
											]}
										>
											<TextArea
												placeholder="简要描述文章内容，用于SEO和文章列表展示..."
												rows={3}
												showCount
												maxLength={300}
											/>
										</Form.Item>
									</div>
								</Form>
							)}
						</Card>

						{/* Markdown 编辑器 */}
						<Card className="shadow-sm" bodyStyle={{ padding: 0 }}>
							<SLEditor value={content} onChange={setContent} height={600} />
						</Card>
					</div>

					{/* 右侧设置面板 - 可切换显示 */}
					<div
						className={`transition-all duration-300 ease-in-out ${
							settingsPanelOpen
								? "w-80 opacity-100"
								: "w-0 opacity-0 overflow-hidden"
						}`}
					>
						{settingsPanelOpen && (
							<div className="space-y-4">
								{/* 标签管理 */}
								<Card
									title="标签管理"
									size="small"
									className="shadow-sm"
									extra={
										<Text type="secondary" className="text-xs">
											{tags.length} 个标签
										</Text>
									}
								>
									<div className="space-y-3">
										<div className="flex flex-wrap gap-2">
											{tags.map((tag) => (
												<Tag
													key={tag}
													closable
													onClose={() => handleRemoveTag(tag)}
													color="blue"
												>
													{tag}
												</Tag>
											))}
										</div>
										<div className="flex gap-2">
											<Input
												placeholder="添加标签..."
												value={newTag}
												onChange={(e) => setNewTag(e.target.value)}
												onPressEnter={handleAddTag}
												size="small"
											/>
											<Button
												size="small"
												type="primary"
												onClick={handleAddTag}
											>
												添加
											</Button>
										</div>
									</div>
								</Card>

								{/* 发布状态 */}
								<Card title="发布状态" size="small" className="shadow-sm">
									<Form form={form} layout="vertical">
										<Form.Item name="status" label="状态">
											<Select size="large">
												<Select.Option value="draft">
													<Space>
														<span>📝</span>
														<span>草稿</span>
													</Space>
												</Select.Option>
												<Select.Option value="published">
													<Space>
														<span>✅</span>
														<span>已发布</span>
													</Space>
												</Select.Option>
											</Select>
										</Form.Item>
									</Form>
								</Card>

								{/* 提示信息 */}
								<Card
									size="small"
									className="shadow-sm bg-blue-50 border-blue-200"
								>
									<div className="flex items-start space-x-3">
										<SendOutlined className="text-blue-500 mt-1" />
										<div>
											<Text className="text-sm font-medium text-blue-800 block mb-1">
												发布提醒
											</Text>
											<Text className="text-xs text-blue-600">
												文章发布后将对所有用户可见。请确保内容已经完善，分类和标签设置正确。
											</Text>
										</div>
									</div>
								</Card>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostEditor;
