import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalMenuProvider } from "./providers/useGlobalMenu";

const queryClient = new QueryClient();

function App() {
	return (
		<StyleProvider layer>
			<ConfigProvider
				theme={{
					token: {
						// Seed Token，影响范围大
						colorPrimary: "#00b96b",
						borderRadius: 6,
					},
					components: {
						Layout: {
							headerHeight: 76,
						},
					},
				}}
			>
				<GlobalMenuProvider>
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={router} />
					</QueryClientProvider>
				</GlobalMenuProvider>
			</ConfigProvider>
		</StyleProvider>
	);
}

export default App;
