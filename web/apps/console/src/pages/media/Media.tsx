import {
	AudioOutlined,
	CopyOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EyeOutlined,
	FileImageOutlined,
	FileTextOutlined,
	FolderOutlined,
	SearchOutlined,
	UploadOutlined,
	VideoCameraOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Image,
	Input,
	Modal,
	message,
	Popconfirm,
	Progress,
	Row,
	Select,
	Space,
	Tooltip,
	Typography,
	Upload,
	Spin,
} from "antd";
import type React from "react";
import { useState } from "react";
import type { MediaFile } from "../../types";
import {
	useMediaList,
	useUploadFile,
	useDeleteMedia,
} from "../../hooks/useMedia";

const { Title, Text } = Typography;

export const MediaLibrary: React.FC = () => {
	const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
	const [searchText, setSearchText] = useState("");
	const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

	// 使用真实API
	const { data, isLoading, refetch } = useMediaList({
		search: searchText,
		mimeType: fileTypeFilter,
	});

	const uploadFileMutation = useUploadFile();
	const deleteMediaMutation = useDeleteMedia();

	const mediaFiles = data?.items || [];
	const total = data?.total || 0;

	// 过滤媒体文件
	const filteredFiles = mediaFiles.filter((file) => {
		const matchesSearch =
			file.originalName.toLowerCase().includes(searchText.toLowerCase()) ||
			file.filename.toLowerCase().includes(searchText.toLowerCase());
		const matchesType =
			!fileTypeFilter || file.mimeType.startsWith(fileTypeFilter);
		return matchesSearch && matchesType;
	});

	// 获取文件图标
	const getFileIcon = (mimeType: string) => {
		if (mimeType.startsWith("image/"))
			return <FileImageOutlined className="text-blue-500" />;
		if (mimeType.startsWith("video/"))
			return <VideoCameraOutlined className="text-red-500" />;
		if (mimeType.startsWith("audio/"))
			return <AudioOutlined className="text-green-500" />;
		return <FileTextOutlined className="text-gray-500" />;
	};

	// 格式化文件大小
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	// 文件上传配置
	const uploadProps = {
		name: "file",
		multiple: true,
		customRequest: async ({ file, onSuccess, onError }: any) => {
			try {
				await uploadFileMutation.mutateAsync(file as File);
				onSuccess?.(null, file);
				refetch();
			} catch (error) {
				onError?.(error);
			}
		},
		beforeUpload: (file: File) => {
			const isValidSize = file.size / 1024 / 1024 < 10; // 10MB
			if (!isValidSize) {
				message.error("文件大小不能超过 10MB");
			}
			return isValidSize;
		},
		onChange: (info: any) => {
			const { status } = info.file;
			if (status === "done") {
				message.success(`${info.file.name} 上传成功`);
			} else if (status === "error") {
				message.error(`${info.file.name} 上传失败`);
			}
		},
	};

	// 处理文件选择
	const handleFileSelect = (fileId: number, checked: boolean) => {
		if (checked) {
			setSelectedFiles([...selectedFiles, fileId]);
		} else {
			setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
		}
	};

	// 全选/取消全选
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedFiles(filteredFiles.map((file) => file.id));
		} else {
			setSelectedFiles([]);
		}
	};

	// 删除文件
	const handleDelete = (fileId: number) => {
		deleteMediaMutation.mutate(fileId, {
			onSuccess: () => {
				setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
				refetch();
			},
		});
	};

	// 批量删除
	const handleBatchDelete = () => {
		Promise.all(
			selectedFiles.map((id) => deleteMediaMutation.mutateAsync(id))
		).then(() => {
			setSelectedFiles([]);
			refetch();
		});
	};

	// 复制文件链接
	const handleCopyUrl = (url: string) => {
		navigator.clipboard.writeText(url).then(() => {
			message.success("链接已复制到剪贴板");
		});
	};

	// 预览文件
	const handlePreview = (file: MediaFile) => {
		setPreviewFile(file);
	};

	if (isLoading) {
		return (
			<div className="p-6 flex justify-center items-center min-h-screen">
				<Spin size="large" tip="加载中..." />
			</div>
		);
	}

	// 网格视图
	const renderGridView = () => (
		<Row gutter={[16, 16]}>
			{filteredFiles.map((file) => (
				<Col key={file.id} xs={12} sm={8} md={6} lg={4}>
					<Card
						className={`relative group cursor-pointer transition-all duration-200 hover:shadow-lg ${
							selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
						}`}
						bodyStyle={{ padding: 0 }}
						cover={
							file.mimeType.startsWith("image/") ? (
								<div className="aspect-square overflow-hidden">
									<Image
										src={file.thumbnailUrl || file.url}
										alt={file.originalName}
										className="w-full h-full object-cover"
										preview={false}
										onClick={() => handlePreview(file)}
									/>
								</div>
							) : (
								<div className="aspect-square flex items-center justify-center bg-gray-50">
									<div className="text-center">
										<div className="text-4xl mb-2">
											{getFileIcon(file.mimeType)}
										</div>
										<Text className="text-xs text-gray-500">
											{file.mimeType.split("/")[1]?.toUpperCase()}
										</Text>
									</div>
								</div>
							)
						}
					>
						{/* 选择框 */}
						<Checkbox
							className="absolute top-2 left-2 z-10"
							checked={selectedFiles.includes(file.id)}
							onChange={(e) => handleFileSelect(file.id, e.target.checked)}
						/>

						{/* 操作按钮 */}
						<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<Space>
								<Tooltip title="预览">
									<Button
										type="text"
										size="small"
										icon={<EyeOutlined />}
										className="bg-white bg-opacity-80"
										onClick={() => handlePreview(file)}
									/>
								</Tooltip>
								<Tooltip title="复制链接">
									<Button
										type="text"
										size="small"
										icon={<CopyOutlined />}
										className="bg-white bg-opacity-80"
										onClick={() => handleCopyUrl(file.url)}
									/>
								</Tooltip>
								<Popconfirm
									title="确定删除这个文件吗？"
									onConfirm={() => handleDelete(file.id)}
									okText="确定"
									cancelText="取消"
								>
									<Tooltip title="删除">
										<Button
											type="text"
											size="small"
											icon={<DeleteOutlined />}
											className="bg-white bg-opacity-80"
											danger
										/>
									</Tooltip>
								</Popconfirm>
							</Space>
						</div>

						{/* 文件信息 */}
						<div className="p-3">
							<Tooltip title={file.originalName}>
								<Text className="text-sm font-medium truncate block">
									{file.originalName}
								</Text>
							</Tooltip>
							<div className="flex items-center justify-between mt-2">
								<Text className="text-xs text-gray-500">
									{formatFileSize(file.size)}
								</Text>
								<Text className="text-xs text-gray-500">
									{new Date(file.createdAt).toLocaleDateString("zh-CN")}
								</Text>
							</div>
						</div>
					</Card>
				</Col>
			))}
		</Row>
	);

	return (
		<div className="p-6 space-y-6">
			{/* 页面标题 */}
			<div className="flex items-center justify-between">
				<div>
					<Title level={2} className="m-0">
						媒体库
					</Title>
					<Text className="text-gray-600">
						管理您的图片、视频和其他媒体文件
					</Text>
				</div>
			</div>

			{/* 上传区域 */}
			<Card>
				<Upload.Dragger {...uploadProps} className="border-dashed">
					<p className="ant-upload-drag-icon">
						<UploadOutlined className="text-4xl text-blue-500" />
					</p>
					<p className="ant-upload-text text-lg">点击或拖拽文件到此区域上传</p>
					<p className="ant-upload-hint text-gray-500">
						支持单个或批量上传。支持 JPG、PNG、GIF、MP4、PDF
						等格式，单个文件不超过 10MB
					</p>
				</Upload.Dragger>
			</Card>

			{/* 搜索和筛选 */}
			<Card>
				<Row gutter={16} align="middle">
					<Col xs={24} sm={8}>
						<Input
							placeholder="搜索文件名..."
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={6}>
						<Select
							placeholder="文件类型"
							value={fileTypeFilter}
							onChange={setFileTypeFilter}
							allowClear
							className="w-full"
						>
							<Select.Option value="image">图片</Select.Option>
							<Select.Option value="video">视频</Select.Option>
							<Select.Option value="audio">音频</Select.Option>
							<Select.Option value="application">文档</Select.Option>
						</Select>
					</Col>
					<Col xs={24} sm={10} className="flex justify-between items-center">
						<div>
							<Checkbox
								checked={
									selectedFiles.length === filteredFiles.length &&
									filteredFiles.length > 0
								}
								indeterminate={
									selectedFiles.length > 0 &&
									selectedFiles.length < filteredFiles.length
								}
								onChange={(e) => handleSelectAll(e.target.checked)}
							>
								全选 ({selectedFiles.length})
							</Checkbox>
						</div>
						<Space>
							{selectedFiles.length > 0 && (
								<Popconfirm
									title="确定删除选中的文件吗？"
									onConfirm={handleBatchDelete}
									okText="确定"
									cancelText="取消"
								>
									<Button danger icon={<DeleteOutlined />}>
										批量删除
									</Button>
								</Popconfirm>
							)}
							<Button.Group>
								<Button
									type={viewMode === "grid" ? "primary" : "default"}
									onClick={() => setViewMode("grid")}
								>
									网格
								</Button>
								<Button
									type={viewMode === "list" ? "primary" : "default"}
									onClick={() => setViewMode("list")}
								>
									列表
								</Button>
							</Button.Group>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* 文件列表 */}
			<Card>
				{uploadFileMutation.isPending && (
					<div className="mb-4">
						<Progress percent={60} status="active" />
						<Text className="text-sm text-gray-600">正在上传文件...</Text>
					</div>
				)}

				{filteredFiles.length === 0 ? (
					<div className="text-center py-12">
						<FolderOutlined className="text-6xl text-gray-300" />
						<div className="mt-4">
							<Text className="text-gray-500">
								{searchText || fileTypeFilter
									? "没有找到匹配的文件"
									: "暂无媒体文件"}
							</Text>
						</div>
					</div>
				) : (
					renderGridView()
				)}
			</Card>

			{/* 文件预览模态框 */}
			<Modal
				title={previewFile?.originalName}
				open={!!previewFile}
				onCancel={() => setPreviewFile(null)}
				footer={[
					<Button
						key="copy"
						icon={<CopyOutlined />}
						onClick={() => previewFile && handleCopyUrl(previewFile.url)}
					>
						复制链接
					</Button>,
					<Button
						key="download"
						icon={<DownloadOutlined />}
						onClick={() => previewFile && window.open(previewFile.url)}
					>
						下载
					</Button>,
				]}
				width={800}
			>
				{previewFile && (
					<div className="space-y-4">
						{previewFile.mimeType.startsWith("image/") ? (
							<div className="text-center">
								<Image
									src={previewFile.url}
									alt={previewFile.originalName}
									className="max-h-96"
								/>
							</div>
						) : previewFile.mimeType.startsWith("video/") ? (
							<video controls className="w-full max-h-96">
								<source src={previewFile.url} type={previewFile.mimeType} />
								您的浏览器不支持视频播放
							</video>
						) : (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">
									{getFileIcon(previewFile.mimeType)}
								</div>
								<Text>无法预览此文件类型</Text>
							</div>
						)}

						<Divider />

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<Text strong>文件名：</Text>
								<div>{previewFile.originalName}</div>
							</div>
							<div>
								<Text strong>文件大小：</Text>
								<div>{formatFileSize(previewFile.size)}</div>
							</div>
							<div>
								<Text strong>文件类型：</Text>
								<div>{previewFile.mimeType}</div>
							</div>
							<div>
								<Text strong>上传时间：</Text>
								<div>
									{new Date(previewFile.createdAt).toLocaleString("zh-CN")}
								</div>
							</div>
							<div>
								<Text strong>上传者：</Text>
								<div>{previewFile.uploaderName}</div>
							</div>
							<div>
								<Text strong>文件URL：</Text>
								<div className="break-all text-blue-600">{previewFile.url}</div>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default MediaLibrary;
