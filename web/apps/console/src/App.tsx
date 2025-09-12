import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";

function App() {
	return (
		<StyleProvider layer>
			<ConfigProvider
				theme={{
					algorithm: theme.defaultAlgorithm,
					token: {
						colorPrimary: "#3b82f6",
						colorSuccess: "#10b981",
						colorWarning: "#f59e0b",
						colorError: "#ef4444",
						borderRadius: 8,
						fontFamily:
							'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
					},
					components: {
						Menu: {
							itemBg: "transparent",
							itemSelectedBg: "#eff6ff",
							itemSelectedColor: "#3b82f6",
							itemHoverBg: "#f1f5f9",
						},
						Card: {
							headerBg: "#ffffff",
						},
						Table: {
							headerBg: "#f8fafc",
							headerColor: "#374151",
						},
					},
				}}
			>
				<RouterProvider router={router} />
			</ConfigProvider>
		</StyleProvider>
	);
}

export default App;
