import { QueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { tokenStorage } from "@/hooks/useAuth";
import {
	bearerTokenPluginCreator,
	createInstance,
	errorHandlerPluginCreator,
	type HttpMethodUnion,
	tokenRefreshPluginCreator,
} from "@/lib/http-client";
import type { JsonResponse } from "@/types/http";

export const request = createInstance({
	baseURL: import.meta.env.VITE_API_URL || "/",
	plugins: {
		request: [
			bearerTokenPluginCreator({
				token: (config) => {
					console.log("config", config);
					const url = config.url;
					if (url?.includes("/api/v1/auth/refresh")) {
						return "";
					}
					return tokenStorage.get() || "";
				},
			}),
		],
		response: [
			errorHandlerPluginCreator({
				onError: (error) => {
					console.error(error);
				},
			}),
			tokenRefreshPluginCreator({
				onRefreshError: (error) => {
					console.error(error);
				},
			}),
		],
	},
});

export const httpClient = {
	getRequesterInstance: () => request,

	jsonRequest: async <T, D = unknown>(
		url: string,
		method: HttpMethodUnion,
		config: AxiosRequestConfig<D>,
	) => {
		const res = await request.request<JsonResponse<T>>({
			url,
			method,
			...config,
		});
		return res.data.data;
	},

	request: async <T = unknown, D = unknown>(config: AxiosRequestConfig<D>) => {
		const res = await request.request<T>(config);
		return res;
	},
};

export const tanstackQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});
