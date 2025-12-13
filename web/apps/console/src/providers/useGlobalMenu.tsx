// 创建菜单上下文

import { useMount } from "ahooks";
import { createContext, type Dispatch, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@/components/Icons";

// ItemType<MenuItemType>
// type MenuItem = Required<MenuProps>["items"][number];

export type MenuItem = {
	key: string;
	label: string;
	icon: React.ReactNode;
	path?: string;
	children?: MenuItem[];
	index?: boolean;
};

const GlobalMenu: MenuItem[] = [
	{
		key: "dashboard",
		label: "仪表盘",
		icon: <Icon name="DashboardOutlined" />,
		path: "/dashboard",
		index: true,
	},
	{
		key: "posts",
		label: "文章管理",
		icon: <Icon name="FileTextOutlined" />,
		children: [
			{
				key: "posts-list",
				label: "文章列表",
				icon: <Icon name="FileTextOutlined" />,
				path: "/posts",
				index: true,
			},
			{
				key: "posts-create",
				label: "创建文章",
				icon: <Icon name="FileTextOutlined" />,
				path: "/posts/create",
			},
		],
	},
	{
		key: "categories",
		label: "分类管理",
		icon: <Icon name="TagsOutlined" />,
		path: "/categories",
	},
	{
		key: "media",
		label: "媒体文件",
		icon: <Icon name="FileImageOutlined" />,
		path: "/media",
	},
	{
		key: "users",
		label: "用户管理",
		icon: <Icon name="UserOutlined" />,
		path: "/users",
	},
];

type GlobalMenuContextType = {
	menuItems: MenuItem[];
	setMenuItems: Dispatch<MenuItem[]>;

	currentKey: string;
	setCurrentKey: Dispatch<string>;

	collapsed: boolean;
	setCollapsed: Dispatch<boolean>;
};

const GlobalMenuContext = createContext<GlobalMenuContextType>({
	menuItems: [],
	setMenuItems: () => {},
	currentKey: "",
	setCurrentKey: () => {},
	collapsed: false,
	setCollapsed: () => {},
});

export const searchItemByKey = (
	key: string,
	items: MenuItem[]
): MenuItem | undefined => {
	if (items.length === 0) return;
	for (const item of items) {
		if (!item) continue;
		if (item.key === key) {
			return item;
		}
		if (item.children && item.children.length > 0) {
			const result = searchItemByKey(key, item.children);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
};

export const searchItemByPath = (
	path: string,
	items: MenuItem[]
): MenuItem | undefined => {
	if (items.length === 0) return;
	for (const item of items) {
		if (!item) continue;
		if (item.path && path.startsWith(item.path)) {
			return item;
		}
		if (item.children && item.children.length > 0) {
			const result = searchItemByPath(path, item.children);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
};

export const GlobalMenuProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [menuItems, setMenuItems] = useState<MenuItem[]>(GlobalMenu);
	const [currentKey, setCurrentKey] = useState<string>("");
	const [collapsed, setCollapsed] = useState<boolean>(false);
	return (
		<GlobalMenuContext.Provider
			value={{
				menuItems,
				setMenuItems,
				currentKey,
				setCurrentKey,
				collapsed,
				setCollapsed,
			}}
		>
			{children}
		</GlobalMenuContext.Provider>
	);
};

export const useGlobalMenu = () => {
	const context = useContext(GlobalMenuContext);
	const navigate = useNavigate();
	const location = useLocation();

	//Note：useNavigate 需要在RouterProvider 中使用，所以这里需要使用 useNavigate
	const handleItemClick = (key: string) => {
		context.setCurrentKey(key);
		const item = searchItemByKey(key, context.menuItems);
		console.log("item handleItemClick", item);
		if (item) {
			context.setCurrentKey(item.key);
		}
		if (item?.path) {
			navigate(item.path);
		}
	};
	useMount(() => {
		// 判断当前路径是否在菜单中
		const item = searchItemByPath(location.pathname, context.menuItems);
		if (item) {
			context.setCurrentKey(item.key);
		} else {
			context.setCurrentKey("dashboard");
			navigate("/dashboard");
		}
	});
	return { ...context, handleItemClick };
};
