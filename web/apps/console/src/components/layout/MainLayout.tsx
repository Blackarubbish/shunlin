import {
	BellOutlined,
	DashboardOutlined,
	FileImageOutlined,
	FileTextOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SearchOutlined,
	SettingOutlined,
	TagsOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Badge,
	Button,
	Dropdown,
	Input,
	Layout,
	Menu,
	Space,
	Typography,
} from "antd";
import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const MainLayout: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedKey, setSelectedKey] = useState("dashboard");
	const navigate = useNavigate();
	const location = useLocation();

	// 根据当前路径设置选中的菜单项
	useEffect(() => {
		const path = location.pathname;
		if (path.startsWith("/posts")) {
			if (path === "/posts/create") {
				setSelectedKey("posts-create");
			} else if (path.startsWith("/posts/edit")) {
				setSelectedKey("posts-edit");
			} else {
				setSelectedKey("posts-list");
			}
		} else if (path === "/dashboard") {
			setSelectedKey("dashboard");
		} else if (path === "/categories") {
			setSelectedKey("categories");
		} else if (path === "/media") {
			setSelectedKey("media");
		} else if (path === "/users") {
			setSelectedKey("users");
		}
	}, [location.pathname]);

	// 侧边栏菜单项
	const menuItems = [
		{
			key: "dashboard",
			icon: <DashboardOutlined />,
			label: "仪表盘",
		},
		{
			key: "posts",
			icon: <FileTextOutlined />,
			label: "文章管理",
			children: [
				{
					key: "posts-list",
					label: "文章列表",
				},
				{
					key: "posts-create",
					label: "创建文章",
				},
			],
		},
		{
			key: "categories",
			icon: <TagsOutlined />,
			label: "分类管理",
		},
		{
			key: "media",
			icon: <FileImageOutlined />,
			label: "媒体文件",
		},
		{
			key: "users",
			icon: <UserOutlined />,
			label: "用户管理",
		},
	];

	// 用户下拉菜单
	const userMenuItems = [
		{
			key: "profile",
			icon: <UserOutlined />,
			label: "个人资料",
		},
		{
			key: "settings",
			icon: <SettingOutlined />,
			label: "设置",
		},
		{
			type: "divider" as const,
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: "退出登录",
			danger: true,
		},
	];

	const handleMenuClick = (key: string) => {
		setSelectedKey(key);
		// 使用 React Router 进行导航
		switch (key) {
			case "dashboard":
				navigate("/dashboard");
				break;
			case "posts-list":
				navigate("/posts");
				break;
			case "posts-create":
				navigate("/posts/create");
				break;
			case "categories":
				navigate("/categories");
				break;
			case "media":
				navigate("/media");
				break;
			case "users":
				navigate("/users");
				break;
			default:
				break;
		}
	};

	const handleUserMenuClick = ({ key }: { key: string }) => {
		if (key === "logout") {
			console.log("用户退出登录");
			// 这里添加退出登录逻辑
		} else {
			console.log("用户菜单点击:", key);
		}
	};

	return (
		<Layout className="min-h-screen">
			{/* 侧边栏 */}
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				className="bg-white border-r border-gray-200"
				width={240}
				collapsedWidth={64}
			>
				{/* Logo 区域 */}
				<div className="h-16 flex items-center justify-center border-b border-gray-200">
					{!collapsed ? (
						<Title level={4} className="m-0 text-gray-800">
							博客管理
						</Title>
					) : (
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold">B</span>
						</div>
					)}
				</div>

				{/* 导航菜单 */}
				<Menu
					mode="inline"
					selectedKeys={[selectedKey]}
					items={menuItems}
					className="border-none h-[calc(100vh-64px)] overflow-y-auto"
					onClick={({ key }) => handleMenuClick(key)}
				/>
			</Sider>

			<Layout>
				{/* 顶部导航栏 */}
				<Header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						{/* 折叠按钮 */}
						<Button
							type="text"
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() => setCollapsed(!collapsed)}
							className="w-8 h-8 flex items-center justify-center"
						/>

						{/* 搜索框 */}
						<Input
							placeholder="搜索文章、分类..."
							prefix={<SearchOutlined className="text-gray-400" />}
							className="w-64"
							allowClear
						/>
					</div>

					<div className="flex items-center space-x-4">
						{/* 通知铃铛 */}
						<Badge count={3} size="small">
							<Button
								type="text"
								icon={<BellOutlined />}
								className="w-8 h-8 flex items-center justify-center"
							/>
						</Badge>

						{/* 用户头像和下拉菜单 */}
						<Dropdown
							menu={{
								items: userMenuItems,
								onClick: handleUserMenuClick,
							}}
							placement="bottomRight"
							arrow
						>
							<Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
								<Avatar
									size={32}
									src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
									alt="用户头像"
								/>
								<div className="text-sm">
									<div className="font-medium text-gray-900">管理员</div>
									<div className="text-gray-500">admin@example.com</div>
								</div>
							</Space>
						</Dropdown>
					</div>
				</Header>

				{/* 主内容区 */}
				<Content className="p-6 overflow-y-auto">
					<div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-112px)]">
						<Outlet />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};
