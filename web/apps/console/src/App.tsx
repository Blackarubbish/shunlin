import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import { GlobalMenuProvider } from "./providers/useGlobalMenu";

function App() {
	return (
		<StyleProvider layer>
			<ConfigProvider
				theme={{
					algorithm: theme.defaultAlgorithm,
					token: {
						// 主色系 - 专业绿色调色板
						colorPrimary: "#22c55e",
						colorSuccess: "#059669",
						colorWarning: "#d97706",
						colorError: "#dc2626",
						colorInfo: "#0284c7",

						// 文字颜色系统
						colorText: "#111827",
						colorTextSecondary: "#4b5563",
						colorTextTertiary: "#6b7280",
						colorTextQuaternary: "#9ca3af",

						// 背景色系统
						colorBgContainer: "#ffffff",
						colorBgElevated: "#ffffff",
						colorBgLayout: "#f9fafb",
						colorBgSpotlight: "#f3f4f6",

						// 边框色系统
						colorBorder: "#e5e7eb",
						colorBorderSecondary: "#d1d5db",

						// 圆角系统
						borderRadius: 6,
						borderRadiusXS: 4,
						borderRadiusSM: 6,
						borderRadiusLG: 12,
						borderRadiusOuter: 16,

						// 字体系统
						fontFamily:
							'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
						fontSize: 14,
						fontSizeSM: 12,
						fontSizeLG: 16,
						fontSizeXL: 18,

						// 行高和间距
						lineHeight: 1.5,
						lineHeightLG: 1.75,
						padding: 16,
						paddingLG: 24,
						margin: 16,
						marginLG: 24,

						// 阴影系统
						boxShadow:
							"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
						boxShadowSecondary:
							"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

						// 控制高度
						controlHeight: 40,
						controlHeightSM: 32,
						controlHeightLG: 48,

						// 动画
						motionDurationMid: "0.2s",
						motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
					},
					components: {
						Layout: {
							siderBg: "#ffffff",
							bodyBg: "#f9fafb",
							headerBg: "#ffffff",
						},
						Menu: {
							itemBg: "transparent",
							itemSelectedBg: "#22c55e",
							itemSelectedColor: "#ffffff",
							itemHoverBg: "#f0fdf4",
							itemHoverColor: "#15803d",
							itemColor: "#4b5563",
							iconSize: 16,
							itemMarginInline: 8,
							itemBorderRadius: 12,
							itemHeight: 40,
							fontSize: 14,
						},
						Card: {
							headerBg: "#f0fdf4",
							colorBgContainer: "#ffffff",
							borderRadiusLG: 16,
							paddingLG: 24,
						},
						Table: {
							headerBg: "#f0fdf4",
							headerColor: "#111827",
							colorBgContainer: "#ffffff",
							borderColor: "#e5e7eb",
							rowHoverBg: "#f0fdf4",
							borderRadius: 16,
						},
						Button: {
							borderRadius: 12,
							fontWeight: 500,
							primaryShadow: "0 4px 14px 0 rgba(34, 197, 94, 0.15)",
							controlHeight: 40,
							controlHeightSM: 32,
							controlHeightLG: 48,
						},
						Input: {
							borderRadius: 12,
							activeBorderColor: "#22c55e",
							hoverBorderColor: "#86efac",
							controlHeight: 40,
						},
						Select: {
							borderRadius: 12,
							activeBorderColor: "#22c55e",
							hoverBorderColor: "#86efac",
							controlHeight: 40,
						},
						Modal: {
							borderRadiusLG: 20,
							headerBg: "#f0fdf4",
							contentBg: "#ffffff",
							footerBg: "#f9fafb",
						},
						Tag: {
							borderRadiusLG: 20,
						},
						Pagination: {
							borderRadius: 12,
							itemActiveBg: "#22c55e",
							itemSize: 32,
						},
						Notification: {
							borderRadiusLG: 16,
						},
						Tooltip: {
							borderRadius: 8,
							colorBgSpotlight: "#1f2937",
						},
						Switch: {
							colorPrimary: "#22c55e",
							colorPrimaryHover: "#16a34a",
						},
					},
				}}
			>
				<GlobalMenuProvider>
					<RouterProvider router={router} />
				</GlobalMenuProvider>
			</ConfigProvider>
		</StyleProvider>
	);
}

export default App;
