import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Result, Typography } from "antd";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "@/pages/auth/Login.css"; // 复用登录页面的样式

const { Title, Text } = Typography;

interface ForgotPasswordFormValues {
	email: string;
}

const ForgotPassword: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const onFinish = async (values: ForgotPasswordFormValues) => {
		setLoading(true);
		try {
			console.log("重置密码邮箱:", values.email);
			// 模拟API调用
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setEmailSent(true);
			message.success("重置链接已发送到您的邮箱");
		} catch (_error) {
			message.error("发送失败，请重试");
		} finally {
			setLoading(false);
		}
	};

	if (emailSent) {
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
					<div
						className="login-form-section"
						style={{ flex: 1, justifyContent: "center" }}
					>
						<div className="login-form-container elevated-card">
							<Result
								status="success"
								title="邮件已发送"
								subTitle="我们已向您的邮箱发送了密码重置链接，请查收邮件并按照说明操作。"
								extra={[
									<Button type="primary" key="back" className="primary-button">
										<Link to="/login">
											<ArrowLeftOutlined /> 返回登录
										</Link>
									</Button>,
								]}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

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
								重置密码
							</Title>
							<Text className="brand-subtitle">
								输入您的邮箱地址，我们将发送重置链接
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
								忘记密码
							</Title>
							<Text type="secondary" className="form-subtitle">
								输入您的邮箱地址，我们将发送密码重置链接
							</Text>
						</div>

						<Form
							form={form}
							name="forgot-password"
							className="login-form"
							onFinish={onFinish}
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
									placeholder="请输入注册时使用的邮箱地址"
									className="enhanced-input"
								/>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="primary-button login-button"
									loading={loading}
									block
								>
									{loading ? "发送中..." : "发送重置链接"}
								</Button>
							</Form.Item>

							<div className="form-footer">
								<Text type="secondary">
									<Link to="/login" className="register-link">
										<ArrowLeftOutlined /> 返回登录
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

export default ForgotPassword;
