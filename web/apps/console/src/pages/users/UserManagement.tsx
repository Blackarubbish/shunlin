import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	LockOutlined,
	MailOutlined,
	PlusOutlined,
	SearchOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Form,
	Input,
	Modal,
	message,
	Popconfirm,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import type React from "react";
import { useState } from "react";
import type { User } from "../../types";
import { mockUsers } from "../../utils/mockData";

const { Title, Text } = Typography;

export const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>(mockUsers);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("");

	// 过滤用户
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.username.toLowerCase().includes(searchText.toLowerCase()) ||
			user.email.toLowerCase().includes(searchText.toLowerCase());
		const matchesRole = !roleFilter || user.role === roleFilter;
		const matchesStatus = !statusFilter || user.status === statusFilter;
		return matchesSearch && matchesRole && matchesStatus;
	});

	// 统计数据
	const totalUsers = users.length;
	const activeUsers = users.filter((user) => user.status === "active").length;
	const adminUsers = users.filter((user) => user.role === "admin").length;

	// 表格列定义
	const columns = [
		{
			title: "用户信息",
			dataIndex: "username",
			key: "username",
			render: (username: string, record: User) => (
				<div className="flex items-center space-x-3">
					<Avatar
						size={40}
						src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
						icon={<UserOutlined />}
					/>
					<div>
						<div className="font-medium text-gray-900">{username}</div>
						<div className="text-sm text-gray-500 flex items-center">
							<MailOutlined className="mr-1" />
							{record.email}
						</div>
					</div>
				</div>
			),
		},
		{
			title: "角色",
			dataIndex: "role",
			key: "role",
			width: 100,
			render: (role: string) => {
				const roleConfig = {
					admin: { color: "red", text: "管理员" },
					editor: { color: "blue", text: "编辑" },
				};
				const config = roleConfig[role as keyof typeof roleConfig];
				return <Tag color={config.color}>{config.text}</Tag>;
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			width: 100,
			render: (status: string) => {
				const statusConfig = {
					active: { color: "success", text: "正常" },
					inactive: { color: "default", text: "禁用" },
				};
				const config = statusConfig[status as keyof typeof statusConfig];
				return <Badge status={config.color as any} text={config.text} />;
			},
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			width: 150,
			sorter: (a: User, b: User) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (createdAt: string) => (
				<Text className="text-sm text-gray-600">
					{new Date(createdAt).toLocaleDateString("zh-CN")}
				</Text>
			),
		},
		{
			title: "最后更新",
			dataIndex: "updatedAt",
			key: "updatedAt",
			width: 150,
			sorter: (a: User, b: User) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
			render: (updatedAt: string) => (
				<Text className="text-sm text-gray-600">
					{new Date(updatedAt).toLocaleDateString("zh-CN")}
				</Text>
			),
		},
		{
			title: "操作",
			key: "action",
			width: 150,
			render: (_: any, record: User) => (
				<Space size="small">
					<Tooltip title="查看详情">
						<Button
							type="text"
							icon={<EyeOutlined />}
							size="small"
							onClick={() => handleView(record)}
						/>
					</Tooltip>
					<Tooltip title="编辑用户">
						<Button
							type="text"
							icon={<EditOutlined />}
							size="small"
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Popconfirm
						title="确定删除这个用户吗？"
						description="删除后用户将无法登录系统，请谨慎操作。"
						onConfirm={() => handleDelete(record.id)}
						okText="确定"
						cancelText="取消"
						disabled={record.role === "admin"} // 不能删除管理员
					>
						<Tooltip
							title={
								record.role === "admin" ? "不能删除管理员账户" : "删除用户"
							}
						>
							<Button
								type="text"
								icon={<DeleteOutlined />}
								size="small"
								danger
								disabled={record.role === "admin"}
							/>
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	// 打开创建/编辑模态框
	const handleCreate = () => {
		setEditingUser(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (user: User) => {
		setEditingUser(user);
		form.setFieldsValue({
			username: user.username,
			email: user.email,
			role: user.role,
			status: user.status,
		});
		setIsModalVisible(true);
	};

	// 查看用户详情
	const handleView = (user: User) => {
		Modal.info({
			title: "用户详情",
			width: 500,
			content: (
				<div className="space-y-4 mt-4">
					<div className="flex items-center space-x-4">
						<Avatar
							size={64}
							src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
							icon={<UserOutlined />}
						/>
						<div>
							<Title level={4} className="m-0">
								{user.username}
							</Title>
							<Text className="text-gray-600">{user.email}</Text>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 pt-4 border-t">
						<div>
							<Text strong>用户角色：</Text>
							<div>
								<Tag color={user.role === "admin" ? "red" : "blue"}>
									{user.role === "admin" ? "管理员" : "编辑"}
								</Tag>
							</div>
						</div>
						<div>
							<Text strong>账户状态：</Text>
							<div>
								<Badge
									status={user.status === "active" ? "success" : "default"}
									text={user.status === "active" ? "正常" : "禁用"}
								/>
							</div>
						</div>
						<div>
							<Text strong>创建时间：</Text>
							<div>{new Date(user.createdAt).toLocaleString("zh-CN")}</div>
						</div>
						<div>
							<Text strong>最后更新：</Text>
							<div>{new Date(user.updatedAt).toLocaleString("zh-CN")}</div>
						</div>
					</div>
				</div>
			),
		});
	};

	// 处理表单提交
	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			if (editingUser) {
				// 编辑用户
				const updatedUsers = users.map((user) =>
					user.id === editingUser.id
						? {
								...user,
								...values,
								updatedAt: new Date().toISOString(),
							}
						: user,
				);
				setUsers(updatedUsers);
				message.success("用户信息更新成功！");
			} else {
				// 创建新用户
				const newUser: User = {
					id: Date.now(), // 实际项目中应该由后端生成
					...values,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				setUsers([...users, newUser]);
				message.success("用户创建成功！");
			}

			setIsModalVisible(false);
			form.resetFields();
		} catch (_error) {
			message.error("操作失败，请重试");
		} finally {
			setLoading(false);
		}
	};

	// 删除用户
	const handleDelete = async (userId: number) => {
		try {
			const updatedUsers = users.filter((user) => user.id !== userId);
			setUsers(updatedUsers);
			message.success("用户删除成功！");
		} catch (_error) {
			message.error("删除失败，请重试");
		}
	};

	// 切换用户状态
	const _handleToggleStatus = async (userId: number) => {
		try {
			const updatedUsers = users.map((user) =>
				user.id === userId
					? {
							...user,
							status: user.status === "active" ? "inactive" : "active",
							updatedAt: new Date().toISOString(),
						}
					: user,
			);
			setUsers(updatedUsers as User[]);
			message.success("用户状态更新成功！");
		} catch (_error) {
			message.error("状态更新失败，请重试");
		}
	};

	return (
		<div className="p-6 space-y-6">
			{/* 页面标题和操作按钮 */}
			<div className="flex items-center justify-between">
				<div>
					<Title level={2} className="m-0">
						用户管理
					</Title>
					<Text className="text-gray-600">
						管理系统用户，包括管理员和编辑用户
					</Text>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
					创建用户
				</Button>
			</div>

			{/* 统计卡片 */}
			<Row gutter={16}>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="总用户数"
							value={totalUsers}
							prefix={<UserOutlined className="text-blue-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="活跃用户"
							value={activeUsers}
							prefix={<UserOutlined className="text-green-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card>
						<Statistic
							title="管理员"
							value={adminUsers}
							prefix={<UserOutlined className="text-red-500" />}
							valueStyle={{ color: "#1f2937" }}
						/>
					</Card>
				</Col>
			</Row>

			{/* 搜索和筛选 */}
			<Card>
				<Row gutter={16}>
					<Col xs={24} sm={8}>
						<Input
							placeholder="搜索用户名或邮箱..."
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={6}>
						<Select
							placeholder="选择角色"
							value={roleFilter}
							onChange={setRoleFilter}
							allowClear
							className="w-full"
						>
							<Select.Option value="admin">管理员</Select.Option>
							<Select.Option value="editor">编辑</Select.Option>
						</Select>
					</Col>
					<Col xs={24} sm={6}>
						<Select
							placeholder="选择状态"
							value={statusFilter}
							onChange={setStatusFilter}
							allowClear
							className="w-full"
						>
							<Select.Option value="active">正常</Select.Option>
							<Select.Option value="inactive">禁用</Select.Option>
						</Select>
					</Col>
				</Row>
			</Card>

			{/* 用户列表 */}
			<Card>
				<Table
					columns={columns}
					dataSource={filteredUsers}
					rowKey="id"
					pagination={{
						total: filteredUsers.length,
						pageSize: 10,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total, range) =>
							`第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
					}}
				/>
			</Card>

			{/* 创建/编辑用户模态框 */}
			<Modal
				title={editingUser ? "编辑用户" : "创建用户"}
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
						name="username"
						label="用户名"
						rules={[
							{ required: true, message: "请输入用户名" },
							{ min: 3, message: "用户名至少3个字符" },
							{ max: 20, message: "用户名不能超过20个字符" },
							{
								pattern: /^[a-zA-Z0-9_]+$/,
								message: "用户名只能包含字母、数字和下划线",
							},
						]}
					>
						<Input placeholder="输入用户名" prefix={<UserOutlined />} />
					</Form.Item>

					<Form.Item
						name="email"
						label="邮箱地址"
						rules={[
							{ required: true, message: "请输入邮箱地址" },
							{ type: "email", message: "请输入有效的邮箱地址" },
						]}
					>
						<Input placeholder="输入邮箱地址" prefix={<MailOutlined />} />
					</Form.Item>

					{!editingUser && (
						<Form.Item
							name="password"
							label="密码"
							rules={[
								{ required: true, message: "请输入密码" },
								{ min: 6, message: "密码至少6个字符" },
							]}
						>
							<Input.Password
								placeholder="输入密码"
								prefix={<LockOutlined />}
							/>
						</Form.Item>
					)}

					<Form.Item
						name="role"
						label="用户角色"
						rules={[{ required: true, message: "请选择用户角色" }]}
					>
						<Select placeholder="选择角色">
							<Select.Option value="admin">管理员</Select.Option>
							<Select.Option value="editor">编辑</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="status"
						label="账户状态"
						rules={[{ required: true, message: "请选择账户状态" }]}
					>
						<Select placeholder="选择状态">
							<Select.Option value="active">正常</Select.Option>
							<Select.Option value="inactive">禁用</Select.Option>
						</Select>
					</Form.Item>

					<div className="flex justify-end space-x-3 pt-4 border-t">
						<Button
							onClick={() => {
								setIsModalVisible(false);
								form.resetFields();
							}}
						>
							取消
						</Button>
						<Button type="primary" htmlType="submit" loading={loading}>
							{editingUser ? "更新用户" : "创建用户"}
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default UserManagement;
