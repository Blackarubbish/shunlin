import {
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface LoginForm {
	email: string;
	password: string;
	remember: boolean;
}

export const Login = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const handleLogin = async (values: LoginForm) => {
		setLoading(true);
		try {
			login(values);
		} catch (error) {
			console.error("登录错误:", error);
			message.error("登录失败，请检查用户名和密码");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen w-screen bg-gray-50">
			<div className="flex h-full w-full">
				{/* 左侧登录表单 */}
				<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
					<div className="w-full max-w-md space-y-8">
						{/* Logo和标题 */}
						<div className="text-center">
							<div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
								<span className="text-white text-xl font-bold">S</span>
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-2">
								欢迎回来
							</h2>
							<p className="text-gray-600">请登录您的账户</p>
						</div>

						{/* 登录表单 */}
						<Form
							form={form}
							name="login"
							onFinish={handleLogin}
							layout="vertical"
							size="large"
							className="space-y-4"
						>
							<Form.Item
								name="email"
								label="邮箱"
								rules={[
									{ required: true, message: "请输入邮箱地址" },
									{ type: "email", message: "请输入有效的邮箱地址" },
								]}
							>
								<Input
									prefix={<UserOutlined className="text-gray-400" />}
									placeholder="请输入邮箱"
									className="h-12 rounded-lg"
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label="密码"
								rules={[
									{ required: true, message: "请输入密码" },
									{ min: 6, message: "密码至少6位" },
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="text-gray-400" />}
									placeholder="请输入密码"
									className="h-12 rounded-lg"
									iconRender={(visible) =>
										visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
									}
								/>
							</Form.Item>

							<div className="flex items-center justify-between">
								<Form.Item name="remember" valuePropName="checked" noStyle>
									<Checkbox className="text-gray-600">记住我</Checkbox>
								</Form.Item>
								<a
									href="#"
									className="text-blue-600 hover:text-blue-500 text-sm font-medium"
								>
									忘记密码？
								</a>
							</div>

							<Form.Item className="mb-0">
								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 border-0 text-base font-medium"
								>
									{loading ? "登录中..." : "登录"}
								</Button>
							</Form.Item>
						</Form>

						{/* 注册链接 */}
						<div className="text-center">
							<span className="text-gray-600">还没有账户？</span>
							<a
								href="#"
								className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
							>
								立即注册
							</a>
						</div>

						{/* 分割线 */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-gray-50 text-gray-500">或者使用</span>
							</div>
						</div>

						{/* 第三方登录 */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								className="h-12 rounded-lg border-gray-300 hover:border-gray-400"
								icon={<span className="text-lg">🔍</span>}
							>
								Google
							</Button>
							<Button
								className="h-12 rounded-lg border-gray-300 hover:border-gray-400"
								icon={<span className="text-lg">📱</span>}
							>
								GitHub
							</Button>
						</div>
					</div>
				</div>

				{/* 右侧背景图 */}
				<div className="hidden lg:flex flex-1 relative overflow-hidden">
					<div
						className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
						style={{
							backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" style="stop-color:%23ffffff;stop-opacity:0.1"/><stop offset="100%" style="stop-color:%23ffffff;stop-opacity:0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/><g fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.1"><circle cx="200" cy="200" r="100"/><circle cx="800" cy="300" r="150"/><circle cx="300" cy="700" r="120"/><circle cx="700" cy="800" r="80"/></g></svg>')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					>
						<div className="absolute inset-0 bg-black bg-opacity-20" />
						<div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-12">
							<div className="text-center max-w-lg">
								<h1 className="text-4xl font-bold mb-6">开始您的数字化之旅</h1>
								<p className="text-xl text-blue-100 mb-8 leading-relaxed">
									连接、创造、分享。在这里发现无限可能，与世界分享您的想法和创意。
								</p>
								<div className="flex items-center justify-center space-x-8 text-blue-200">
									<div className="text-center">
										<div className="text-2xl font-bold">10K+</div>
										<div className="text-sm">活跃用户</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold">50K+</div>
										<div className="text-sm">创作内容</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold">99%</div>
										<div className="text-sm">满意度</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
