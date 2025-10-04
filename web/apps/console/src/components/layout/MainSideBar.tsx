import { Layout, Menu, Typography } from "antd";
import type { ComponentProps } from "react";
import type { MenuItem } from "@/providers";

const { Sider } = Layout;

interface MainSideBarProps extends ComponentProps<typeof Sider> {
	collapsed: boolean;
	title: string;
	menuItems: MenuItem[];
	currentKey: string;
	handleItemClick: (key: string) => void;
}


const { Title } = Typography;

export const MainSideBar = (props: MainSideBarProps) => {
	const { collapsed, title, menuItems, currentKey, handleItemClick, ...rest } =
		props;
	return (
		<Sider
			trigger={null}
			collapsible
			collapsed={collapsed}
			className="bg-white border-r border-gray-200"
			width={300}
			collapsedWidth={64}
			{...rest}
		>
			{/* Logo 区域 */}
			<div className="h-[74px] flex items-center justify-center  border-gray-200">
				{!collapsed ? (
					<Title level={4} className="m-0 text-gray-800">
						{title}
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
				className="border-none h-[calc(100vh-74px)] overflow-y-auto"
				onClick={({ key }) => handleItemClick(key)}
			/>
		</Sider>
	);
};
