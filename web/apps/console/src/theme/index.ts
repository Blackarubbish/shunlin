import type { ThemeConfig } from "antd";
import { colors } from "./colors";

// Ant Design 主题配置
export const themeConfig: ThemeConfig = {
	token: {
		// 品牌色
		colorPrimary: colors.primary, // #635BFF
		colorSuccess: colors.success, // #36c96c
		colorWarning: colors.warning, // #f8c20a
		colorError: colors.error, // #FF6692
		colorInfo: colors.info, // #46CAEB

		// 文本颜色
		colorText: colors.dark, // #1F2A3D
		colorTextSecondary: colors.bodyText, // #98A4AE
		colorTextTertiary: colors.bodyText, // #98A4AE
		colorTextQuaternary: colors.bodyText, // #98A4AE

		// 边框
		colorBorder: colors.border, // #e0e6eb
		colorBorderSecondary: colors.borderGray, // #f3f3f4

		// 背景色
		colorBgContainer: colors.white, // #fff
		colorBgElevated: colors.white, // #fff
		colorBgLayout: colors.lightGray, // #F4F7FB
		colorBgSpotlight: colors.muted, // #EFF4FA

		// 链接色
		colorLink: colors.primary, // #635BFF
		colorLinkHover: colors.primaryEmphasis, // #5249fe
		colorLinkActive: colors.primaryEmphasis, // #5249fe

		// 圆角
		borderRadius: 6,

		// 字体
		fontSize: 14,
		fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
	},

	components: {
		// Layout 组件
		Layout: {
			headerHeight: 64,
			headerBg: colors.white,
			headerColor: colors.dark,
			siderBg: colors.white,
			bodyBg: colors.lightGray,
		},

		// Button 组件
		Button: {
			colorPrimary: colors.primary,
			colorPrimaryHover: colors.primaryEmphasis,
			colorPrimaryActive: colors.primaryEmphasis,
			primaryShadow: `0 2px 0 ${colors.lightPrimary}`,
		},

		// Menu 组件
		Menu: {
			itemBg: colors.white,
			itemSelectedBg: colors.lightPrimary,
			itemSelectedColor: colors.primary,
			itemHoverBg: colors.lightHover,
			itemHoverColor: colors.primary,
			itemActiveBg: colors.lightPrimary,
		},

		// Card 组件
		Card: {
			colorBgContainer: colors.white,
			colorBorderSecondary: colors.border,
		},

		// Input 组件
		Input: {
			colorBorder: colors.border,
			colorBgContainer: colors.white,
			colorText: colors.dark,
			colorTextPlaceholder: colors.bodyText,
			activeBorderColor: colors.primary,
			hoverBorderColor: colors.primaryEmphasis,
		},

		// Select 组件
		Select: {
			colorBorder: colors.border,
			colorPrimary: colors.primary,
			colorPrimaryHover: colors.primaryEmphasis,
		},

		// Table 组件
		Table: {
			colorBgContainer: colors.white,
			colorBorderSecondary: colors.border,
			headerBg: colors.lightGray,
			headerColor: colors.dark,
			rowHoverBg: colors.lightHover,
		},

		// Modal 组件
		Modal: {
			zIndexBase: 1000,
			colorBgElevated: colors.white,
			colorBgMask: "rgba(31, 42, 61, 0.45)", // colors.dark with opacity
		},

		// Message 组件
		Message: {
			zIndexPopup: 1010,
		},

		// Tag 组件
		Tag: {
			colorPrimary: colors.primary,
			colorSuccess: colors.success,
			colorWarning: colors.warning,
			colorError: colors.error,
			colorInfo: colors.info,
		},

		// Badge 组件
		Badge: {
			colorError: colors.error,
			colorSuccess: colors.success,
			colorWarning: colors.warning,
			colorInfo: colors.info,
		},

		// Alert 组件
		Alert: {
			colorSuccess: colors.success,
			colorSuccessBg: colors.lightSuccess,
			colorSuccessBorder: colors.successEmphasis,
			colorWarning: colors.warning,
			colorWarningBg: colors.lightWarning,
			colorWarningBorder: colors.warningEmphasis,
			colorError: colors.error,
			colorErrorBg: colors.lightError,
			colorErrorBorder: colors.errorEmphasis,
			colorInfo: colors.info,
			colorInfoBg: colors.lightInfo,
			colorInfoBorder: colors.infoEmphasis,
		},

		// Pagination 组件
		Pagination: {
			colorPrimary: colors.primary,
			colorPrimaryHover: colors.primaryEmphasis,
		},

		// Switch 组件
		Switch: {
			colorPrimary: colors.primary,
			colorPrimaryHover: colors.primaryEmphasis,
		},

		// Progress 组件
		Progress: {
			colorSuccess: colors.success,
			colorError: colors.error,
			colorInfo: colors.info,
		},
	},

	// 算法配置（可选）
	algorithm: undefined, // 使用默认算法
};

// 导出颜色和 CSS 变量
export { colors, cssVariables } from "./colors";
