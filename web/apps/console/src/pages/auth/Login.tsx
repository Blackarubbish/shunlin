import {
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
	MailOutlined,
} from "@ant-design/icons";
import {
	Form,
	Input,
	Button,
	Checkbox,
	Typography,
	Space,
	Divider,
	message,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const { Title, Text } = Typography;

interface LoginFormValues {
	email: string;
	password: string;
	remember: boolean;
}

const Login: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: LoginFormValues) => {
		setLoading(true);
		try {
			// 模拟登录API调用
			console.log("登录信息:", values);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			message.success("登录成功！");
			// 这里应该跳转到主页面
		} catch {
			message.error("登录失败，请检查用户名和密码");
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo: {
		errorFields: Array<{ name: string[]; errors: string[] }>;
	}) => {
		console.log("表单验证失败:", errorInfo);
	};

	return (
		<div className="login-container">
			{/* 背景装饰元素 */}
			<div className="login-background">
				<div className="bg-decoration bg-decoration-1"></div>
				<div className="bg-decoration bg-decoration-2"></div>
				<div className="bg-decoration bg-decoration-3"></div>
				<div className="bg-decoration bg-decoration-4"></div>
				<div className="bg-decoration bg-decoration-5"></div>
			</div>

			{/* 主要内容区域 */}
			<div className="login-content">
				{/* 左侧品牌区域 */}
				<div className="login-brand">
					<div className="brand-content">
						<div className="brand-logo">
							{/* 这里应该放置品牌Logo，可以是SVG图标或图片 */}
							<div className="logo-placeholder">
								{/* 临时Logo占位符 - 可以替换为实际的Logo */}
								<div className="logo-icon">🌿</div>
								<Title level={2} className="logo-text">
									GreenAdmin
								</Title>
							</div>
						</div>
						<div className="brand-description">
							<Title level={3} className="brand-title">
								欢迎来到现代化管理平台
							</Title>
							<Text className="brand-subtitle">
								体验清新、高效的数据管理解决方案
							</Text>
						</div>
						{/* 装饰性插画区域 */}
						<div className="brand-illustration">
							{/* 这里可以放置夏日主题的插画，比如：
                  - 绿色植物插画
                  - 夏日风景插画
                  - 抽象几何图形
                  暂时用CSS创建简单的装饰图形 */}
							<div className="illustration-placeholder">
								<div className="leaf leaf-1">🍃</div>
								<div className="leaf leaf-2">🌱</div>
								<div className="leaf leaf-3">🍀</div>
								<div className="sun">☀️</div>
							</div>
						</div>
					</div>
				</div>

				{/* 右侧登录表单区域 */}
				<div className="login-form-section">
					<div className="login-form-container elevated-card">
						<div className="form-header">
							<Title level={2} className="form-title">
								登录账户
							</Title>
							<Text type="secondary" className="form-subtitle">
								请输入您的凭据以访问您的账户
							</Text>
						</div>

						<Form
							form={form}
							name="login"
							className="login-form"
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							size="large"
							layout="vertical"
						>
							<Form.Item
								name="email"
								label="邮箱地址"
								rules={[
									{ required: true, message: "请输入邮箱地址" },
									{ type: "email", message: "请输入有效的邮箱地址" },
								]}
							>
								<Input
									prefix={<MailOutlined className="input-icon" />}
									placeholder="请输入邮箱地址"
									className="enhanced-input"
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label="密码"
								rules={[
									{ required: true, message: "请输入密码" },
									{ min: 6, message: "密码至少6位字符" },
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="input-icon" />}
									placeholder="请输入密码"
									className="enhanced-input"
									iconRender={(visible) =>
										visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
									}
								/>
							</Form.Item>

							<Form.Item className="form-options">
								<div className="options-row">
									<Form.Item name="remember" valuePropName="checked" noStyle>
										<Checkbox className="remember-checkbox">记住我</Checkbox>
									</Form.Item>
									<Link to="/forgot-password" className="forgot-link">
										忘记密码？
									</Link>
								</div>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="primary-button login-button"
									loading={loading}
									block
								>
									{loading ? "登录中..." : "登录"}
								</Button>
							</Form.Item>

							<Divider className="form-divider">
								<Text type="secondary">或者</Text>
							</Divider>

							<div className="social-login">
								<Space
									direction="vertical"
									size="middle"
									style={{ width: "100%" }}
								>
									<Button
										className="social-button google-button"
										icon={<span className="social-icon">🔍</span>}
										block
									>
										使用 Google 登录
									</Button>
									<Button
										className="social-button github-button"
										icon={<span className="social-icon">🐙</span>}
										block
									>
										使用 GitHub 登录
									</Button>
								</Space>
							</div>

							<div className="form-footer">
								<Text type="secondary">
									还没有账户？{" "}
									<Link to="/register" className="register-link">
										立即注册
									</Link>
								</Text>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
