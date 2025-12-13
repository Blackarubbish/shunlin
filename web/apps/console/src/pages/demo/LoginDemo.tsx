import { Button, Card, Space, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const LoginDemo = () => {
	return (
		<div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
			<Card className="elevated-card">
				<Title level={2}>🌿 绿色主题登录页面演示</Title>

				<Paragraph>
					我已经为您创建了一个基于现代绿色设计系统的专业登录页面。这个登录页面具有以下特色：
				</Paragraph>

				<Title level={3}>✨ 设计特色</Title>
				<ul>
					<li>
						<strong>现代化设计</strong>
						：基于最新的设计系统规范，使用精心调配的绿色调色板
					</li>
					<li>
						<strong>响应式布局</strong>：完美适配桌面端和移动端设备
					</li>
					<li>
						<strong>微交互动画</strong>：流畅的动画效果，提升用户体验
					</li>
					<li>
						<strong>专业表单验证</strong>：完整的表单验证和错误处理机制
					</li>
					<li>
						<strong>品牌展示区域</strong>
						：左侧品牌展示区域，可放置Logo和品牌信息
					</li>
					<li>
						<strong>社交登录支持</strong>：预留Google和GitHub登录按钮
					</li>
				</ul>

				<Title level={3}>🎨 视觉元素</Title>
				<ul>
					<li>
						<strong>背景装饰</strong>：浮动的绿色圆形装饰元素
					</li>
					<li>
						<strong>品牌插画</strong>：夏日主题的装饰图标（叶子、太阳等）
					</li>
					<li>
						<strong>玻璃态效果</strong>：现代的毛玻璃背景效果
					</li>
					<li>
						<strong>渐变设计</strong>：精心设计的绿色渐变背景
					</li>
				</ul>

				<Title level={3}>🔧 技术实现</Title>
				<ul>
					<li>
						<strong>TypeScript</strong>：完整的类型定义
					</li>
					<li>
						<strong>Ant Design</strong>：基于最新版本的组件库
					</li>
					<li>
						<strong>CSS变量</strong>：使用设计令牌系统，便于主题定制
					</li>
					<li>
						<strong>无障碍支持</strong>：考虑了可访问性和用户偏好
					</li>
				</ul>

				<Title level={3}>📝 需要的素材</Title>
				<Paragraph>
					目前使用了emoji作为临时图标，您可以替换为以下素材：
				</Paragraph>
				<ul>
					<li>
						<strong>品牌Logo</strong>：建议使用SVG格式的公司Logo
					</li>
					<li>
						<strong>背景插画</strong>：夏日绿色主题的插画或图标
					</li>
					<li>
						<strong>社交登录图标</strong>：Google、GitHub等平台的官方图标
					</li>
				</ul>

				<div style={{ marginTop: "32px" }}>
					<Space size="large">
						<Button type="primary" size="large" className="primary-button">
							<Link to="/login">查看登录页面</Link>
						</Button>
						<Button size="large">
							<Link to="/register">查看注册页面</Link>
						</Button>
						<Button size="large">
							<Link to="/forgot-password">查看忘记密码页面</Link>
						</Button>
					</Space>
				</div>

				<div
					style={{
						marginTop: "24px",
						padding: "16px",
						background: "var(--color-bg-success)",
						borderRadius: "8px",
					}}
				>
					<Paragraph style={{ margin: 0, color: "var(--color-text-success)" }}>
						💡 <strong>提示</strong>
						：登录页面已经集成到路由系统中，您可以直接访问 <code>
							/login
						</code>{" "}
						路径查看效果。
					</Paragraph>
				</div>
			</Card>
		</div>
	);
};

export default LoginDemo;
