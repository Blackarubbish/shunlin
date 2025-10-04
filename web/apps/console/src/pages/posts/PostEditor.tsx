import {
	EyeOutlined,
	SaveOutlined,
	SendOutlined,
	TagOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	DatePicker,
	Drawer,
	Form,
	Input,
	message,
	Select,
	Space,
	Switch,
	Tag,
	Typography,
	type UploadFile,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SLEditor } from "@/lib/sl-editor";
import type { Post } from "../../types";
import { mockCategories, mockPosts } from "../../utils/mockData";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PostEditorProps {
	mode: "create" | "edit";
}

export const PostEditor: React.FC<PostEditorProps> = ({ mode = "create" }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | undefined>(undefined);
	const [form] = Form.useForm();
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [loading, setLoading] = useState(false);
	const [_previewMode, setPreviewMode] = useState(false);
	const [publishDrawerOpen, setPublishDrawerOpen] = useState(false);
	const [content, setContent] = useState("");

	// 根据模式和ID加载文章数据
	useEffect(() => {
		if (mode === "edit" && id) {
			const foundPost = mockPosts.find((p) => p.id === parseInt(id, 10));
			if (foundPost) {
				setPost(foundPost);
				setTags(foundPost.tags);
				form.setFieldsValue({
					title: foundPost.title,
					content: foundPost.content,
					excerpt: foundPost.excerpt,
					categoryId: foundPost.categoryId,
					status: foundPost.status,
					publishedAt: foundPost.publishedAt
						? new Date(foundPost.publishedAt)
						: null,
				});
			}
		} else if (mode === "create") {
			form.setFieldsValue({
				status: "draft",
				publishedAt: null,
			});
		}
	}, [mode, id, form]);

	// 初始化表单数据
	const _initialValues = {
		status: "draft",
		publishedAt: null,
	};

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

	// 处理表单提交
	const handleSubmit = async (values: Record<string, unknown>) => {
		setLoading(true);
		try {
			const postData = {
				...values,
				tags,
				publishedAt:
					values.status === "published" && values.publishedAt
						? (values.publishedAt as Date).toISOString()
						: null,
			};

			console.log("保存文章:", postData);
			message.success(mode === "create" ? "文章创建成功！" : "文章更新成功！");

			// 保存成功后跳转到文章列表
			setTimeout(() => {
				navigate("/posts");
			}, 1000);
		} catch (_error) {
			message.error("保存失败，请重试");
		} finally {
			setLoading(false);
		}
	};

	// 处理预览
	const handlePreview = () => {
		const values = form.getFieldsValue();
		console.log("预览文章:", values);
		setPreviewMode(true);
	};

	// 处理发布
	const handlePublish = async () => {
		try {
			const values = await form.validateFields();
			await handleSubmit({
				...values,
				status: "published",
				publishedAt: new Date(),
			});
			setPublishDrawerOpen(false);
		} catch (error) {
			console.error("发布失败:", error);
		}
	};

	// 打开发布抽屉
	const handleOpenPublishDrawer = () => {
		setPublishDrawerOpen(true);
	};

	// 关闭发布抽屉
	const handleClosePublishDrawer = () => {
		setPublishDrawerOpen(false);
	};

	// 文件上传配置
	const _uploadProps = {
		name: "file",
		action: "/api/v1/admin/media/upload",
		headers: {
			authorization: "Bearer token",
		},
		onChange(info: UploadChangeParam<UploadFile>) {
			if (info.file.status === "done") {
				message.success(`${info.file.name} 上传成功`);
			} else if (info.file.status === "error") {
				message.error(`${info.file.name} 上传失败`);
			}
		},
	};

	return (
		<div className="">
			<div className="flex mb-4 items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
				<div className="flex items-center space-x-4">
					<Text className="text-sm text-gray-600">
						{mode === "edit" && post
							? `最后更新: ${new Date(post.updatedAt).toLocaleString("zh-CN")}`
							: ""}
					</Text>
				</div>

				<Space>
					<Button icon={<EyeOutlined />} onClick={handlePreview}>
						预览
					</Button>

					<Button
						icon={<SaveOutlined />}
						onClick={() => form.submit()}
						loading={loading}
					>
						保存草稿
					</Button>

					<Button
						type="primary"
						icon={<SendOutlined />}
						onClick={handleOpenPublishDrawer}
						loading={loading}
					>
						发布文章
					</Button>
				</Space>
			</div>

			<div className=" bg-white  rounded-lg">
				<SLEditor value={content} onChange={setContent} />
			</div>

			{/* 底部操作栏 */}

			{/* 发布设置 Drawer */}
			<Drawer
				title="发布文章"
				placement="right"
				width={480}
				open={publishDrawerOpen}
				onClose={handleClosePublishDrawer}
				extra={
					<Space>
						<Button onClick={handleClosePublishDrawer}>取消</Button>
						<Button
							type="primary"
							icon={<SendOutlined />}
							onClick={handlePublish}
							loading={loading}
						>
							确认发布
						</Button>
					</Space>
				}
			>
				<div className="space-y-6">
					{/* 基本信息 */}
					<Card title="基本信息" size="small" className="shadow-sm">
						<Form form={form} layout="vertical">
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
									className="text-lg"
								/>
							</Form.Item>

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
						</Form>
					</Card>

					{/* 发布设置 */}
					<Card title="发布设置" size="small" className="shadow-sm">
						<Form form={form} layout="vertical">
							<Form.Item name="status" label="文章状态">
								<Select>
									<Select.Option value="draft">草稿</Select.Option>
									<Select.Option value="published">已发布</Select.Option>
									<Select.Option value="archived">已归档</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item name="publishedAt" label="发布时间">
								<DatePicker
									showTime
									className="w-full"
									placeholder="选择发布时间"
								/>
							</Form.Item>
						</Form>
					</Card>

					{/* 分类设置 */}
					<Card title="分类设置" size="small" className="shadow-sm">
						<Form form={form} layout="vertical">
							<Form.Item
								name="categoryId"
								label="选择分类"
								rules={[{ required: true, message: "请选择文章分类" }]}
							>
								<Select placeholder="选择一个分类">
									{mockCategories.map((category) => (
										<Select.Option key={category.id} value={category.id}>
											{category.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Form>
					</Card>

					{/* 标签设置 */}
					<Card title="标签设置" size="small" className="shadow-sm">
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

							<div className="flex space-x-2">
								<Input
									placeholder="添加标签"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onPressEnter={handleAddTag}
									size="small"
								/>
								<Button
									type="primary"
									size="small"
									icon={<TagOutlined />}
									onClick={handleAddTag}
								>
									添加
								</Button>
							</div>

							<Text className="text-gray-500 text-xs">
								按回车或点击添加按钮来添加标签
							</Text>
						</div>
					</Card>

					{/* SEO设置 */}
					<Card title="SEO设置" size="small" className="shadow-sm">
						<Form form={form} layout="vertical">
							<Form.Item name="seoTitle" label="SEO标题">
								<Input placeholder="自定义SEO标题" />
							</Form.Item>

							<Form.Item name="seoDescription" label="SEO描述">
								<TextArea
									placeholder="自定义SEO描述"
									rows={3}
									showCount
									maxLength={160}
								/>
							</Form.Item>

							<Form.Item
								name="allowComments"
								label="允许评论"
								valuePropName="checked"
							>
								<Switch defaultChecked />
							</Form.Item>
						</Form>
					</Card>

					{/* 发布提示 */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<div className="flex-shrink-0">
								<SendOutlined className="text-blue-500 mt-1" />
							</div>
							<div>
								<h4 className="text-sm font-medium text-blue-800 mb-1">
									发布提醒
								</h4>
								<p className="text-sm text-blue-600">
									文章发布后将对所有用户可见。请确保内容已经完善，分类和标签设置正确。
								</p>
							</div>
						</div>
					</div>
				</div>
			</Drawer>
		</div>
	);
};

export default PostEditor;
