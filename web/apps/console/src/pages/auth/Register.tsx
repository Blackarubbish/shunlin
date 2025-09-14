import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Typography } from "antd";
import type React from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // 复用登录页面的样式

const { Title, Text } = Typography;

interface RegisterFormValues {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const Register: React.FC = () => {
	const [form] = Form.useForm();

	const onFinish = async (values: RegisterFormValues) => {
		try {
			console.log("注册信息:", values);
			message.success("注册成功！");
			// 这里应该跳转到登录页面或主页面
		} catch (_error) {
			message.error("注册失败，请重试");
		}
	};

	return (
		<div className="login-container">
			<div className="login-background">
				<div className="bg-decoration bg-decoration-1"></div>
				<div className="bg-decoration bg-decoration-2"></div>
				<div className="bg-decoration bg-decoration-3"></div>
				<div className="bg-decoration bg-decoration-4"></div>
				<div className="bg-decoration bg-decoration-5"></div>
			</div>

			<div className="login-content">
				<div className="login-brand">
					<div className="brand-content">
						<div className="brand-logo">
							<div className="logo-placeholder">
								<div className="logo-icon">🌿</div>
								<Title level={2} className="logo-text">
									GreenAdmin
								</Title>
							</div>
						</div>
						<div className="brand-description">
							<Title level={3} className="brand-title">
								加入我们的平台
							</Title>
							<Text className="brand-subtitle">
								创建账户，开始您的数据管理之旅
							</Text>
						</div>
						<div className="brand-illustration">
							<div className="illustration-placeholder">
								<div className="leaf leaf-1">🍃</div>
								<div className="leaf leaf-2">🌱</div>
								<div className="leaf leaf-3">🍀</div>
								<div className="sun">☀️</div>
							</div>
						</div>
					</div>
				</div>

				<div className="login-form-section">
					<div className="login-form-container elevated-card">
						<div className="form-header">
							<Title level={2} className="form-title">
								创建账户
							</Title>
							<Text type="secondary" className="form-subtitle">
								填写信息以创建您的新账户
							</Text>
						</div>

						<Form
							form={form}
							name="register"
							className="login-form"
							onFinish={onFinish}
							size="large"
							layout="vertical"
						>
							<Form.Item
								name="name"
								label="姓名"
								rules={[
									{ required: true, message: "请输入姓名" },
									{ min: 2, message: "姓名至少2个字符" },
								]}
							>
								<Input
									prefix={<UserOutlined className="input-icon" />}
									placeholder="请输入姓名"
									className="enhanced-input"
								/>
							</Form.Item>

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
								/>
							</Form.Item>

							<Form.Item
								name="confirmPassword"
								label="确认密码"
								dependencies={["password"]}
								rules={[
									{ required: true, message: "请确认密码" },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error("两次输入的密码不一致"));
										},
									}),
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="input-icon" />}
									placeholder="请再次输入密码"
									className="enhanced-input"
								/>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="primary-button login-button"
									block
								>
									注册
								</Button>
							</Form.Item>

							<div className="form-footer">
								<Text type="secondary">
									已有账户？{" "}
									<Link to="/login" className="register-link">
										立即登录
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

export default Register;
