import {
	BellOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SearchOutlined,
	SettingOutlined,
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
import { Outlet } from "react-router-dom";
import { useGlobalMenu } from "@/providers/useGlobalMenu";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const MainLayout: React.FC = () => {
	const { menuItems, currentKey, handleItemClick, collapsed, setCollapsed } =
		useGlobalMenu();

	console.log("menuItems", menuItems);

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
					selectedKeys={[currentKey]}
					items={menuItems}
					className="border-none h-[calc(100vh-64px)] overflow-y-auto"
					onClick={({ key }) => handleItemClick(key)}
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
				<Content className="p-6 overflow-y-auto h-[calc(100vh-64px)] overflow-auto">
					<div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-112px)]">
						<Outlet />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};
