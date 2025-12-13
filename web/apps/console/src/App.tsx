import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntdApp, ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalMenuProvider } from "./providers/useGlobalMenu";
import { themeConfig } from "./theme";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 重试2次，如果失败则不重试
			retry: 2,
			retryDelay: 1000,
			staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
		},
	},
});

function App() {
	return (
		<StyleProvider layer>
			<ConfigProvider theme={themeConfig}>
				<AntdApp>
					<GlobalMenuProvider>
						<QueryClientProvider client={queryClient}>
							<RouterProvider router={router} />
						</QueryClientProvider>
					</GlobalMenuProvider>
				</AntdApp>
			</ConfigProvider>
		</StyleProvider>
	);
}

export default App;
