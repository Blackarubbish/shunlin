import {
	DashboardOutlined,
	FileImageOutlined,
	FileTextOutlined,
	LogoutOutlined,
	SettingOutlined,
	TagsOutlined,
	UserOutlined,
} from "@ant-design/icons";
import type { IconBaseProps } from "@ant-design/icons/lib/components/Icon";

const icons = {
	DashboardOutlined,
	FileTextOutlined,
	UserOutlined,
	TagsOutlined,
	FileImageOutlined,
	SettingOutlined,
	LogoutOutlined,
};

export type IconNameKeysUnion = keyof typeof icons;

const Icon = ({
	name,
	...rest
}: { name: IconNameKeysUnion } & IconBaseProps) => {
	const TargetIcon = icons[name];
	return <TargetIcon {...rest} />;
};

export default Icon;
