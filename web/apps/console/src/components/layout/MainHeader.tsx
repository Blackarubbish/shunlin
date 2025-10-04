import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Layout, Space } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import type { ComponentProps } from "react";
import Icon from "@/components/Icons";
import type { User } from "@/types";

const { Header } = Layout;

interface MainHeaderProps extends ComponentProps<typeof Header> {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	userMenuItems: ItemType[];
	handleUserMenuClick: ({ key }: { key: string }) => void;
	user: User | null | undefined;
}

export const MainHeader = (props: MainHeaderProps) => {
	const {
		collapsed,
		setCollapsed,
		userMenuItems,
		handleUserMenuClick,
		user,
		...rest
	} = props;
	return (
		<Header
			className="bg-white border-b border-gray-200 px-4 h-[74px] flex items-center justify-between"
			{...rest}
		>
			<div className="flex items-center space-x-4">
				{/* 折叠按钮 */}
				<Button
					type="text"
					size="large"
					icon={
						collapsed ? (
							<Icon name="MenuUnfoldOutlined" />
						) : (
							<Icon name="MenuFoldOutlined" />
						)
					}
					onClick={() => setCollapsed(!collapsed)}
				/>

				{/* 搜索框 */}
				<Input
					placeholder="搜索文章、分类..."
					prefix={<SearchOutlined className="text-gray-400" />}
					className="w-64"
					size="large"
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
							<div className="font-medium text-gray-900">{user?.username}</div>
							<div className="text-gray-500">{user?.email}</div>
						</div>
					</Space>
				</Dropdown>
			</div>
		</Header>
	);
};
