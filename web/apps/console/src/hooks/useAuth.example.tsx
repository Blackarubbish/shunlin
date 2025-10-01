// useAuth钩子使用示例

import { Button, Form, Input } from "antd";
import { useAuth } from "./useAuth";

// 在组件中使用useAuth钩子
export const LoginExample = () => {
	const { login, logout, user, isAuthenticated, isLoading } = useAuth();

	const handleLogin = (values: {
		email: string;
		password: string;
		remember: boolean;
	}) => {
		login(values);
	};

	const handleLogout = () => {
		logout();
	};

	if (isAuthenticated) {
		return (
			<div>
				<h2>欢迎, {user?.username}!</h2>
				<p>邮箱: {user?.email}</p>
				<Button onClick={handleLogout} loading={isLoading}>
					退出登录
				</Button>
			</div>
		);
	}

	return (
		<Form onFinish={handleLogin}>
			<Form.Item name="email" rules={[{ required: true, type: "email" }]}>
				<Input placeholder="邮箱" />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, min: 6 }]}>
				<Input.Password placeholder="密码" />
			</Form.Item>
			<Form.Item name="remember" valuePropName="checked">
				<Input type="checkbox" /> 记住我
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit" loading={isLoading} block>
					登录
				</Button>
			</Form.Item>
		</Form>
	);
};

// 在路由守卫中使用
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>加载中...</div>;
	}

	if (!isAuthenticated) {
		return <div>请先登录</div>;
	}

	return <>{children}</>;
};

// 在应用初始化时使用
export const AppInitializer = () => {
	const { isAuthenticated, user, isLoading } = useAuth();

	if (isLoading) {
		return <div>初始化中...</div>;
	}

	return (
		<div>
			{isAuthenticated ? (
				<div>欢迎回来, {user?.username}!</div>
			) : (
				<div>请登录</div>
			)}
		</div>
	);
};
