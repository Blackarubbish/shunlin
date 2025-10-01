import { QueryClient } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import {
	bearerTokenPluginCreator,
	createInstance,
	errorHandlerPluginCreator,
} from "@/lib/http-client";

export const request = createInstance({
	baseURL: import.meta.env.VITE_API_URL || "/",
	plugins: {
		request: [bearerTokenPluginCreator({ token: () => "123" })],
		response: [
			errorHandlerPluginCreator({
				onError: (error) => {
					console.error(error);
				},
			}),
		],
	},
});

export const httpClient = {
	getRequesterInstance: () => request,
	get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
		const res = await request.get<T>(url, config);
		return res.data;
	},

	post: async <T = unknown, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	) => {
		const res = await request.post<T>(url, data, config);
		return res.data;
	},

	put: async <T = unknown, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	) => {
		const res = await request.put<T>(url, data, config);
		return res.data;
	},

	delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
		const res = await request.delete<T>(url, config);
		return res.data;
	},

	patch: async <T = unknown, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	) => {
		const res = await request.patch<T>(url, data, config);
		return res.data;
	},

	request: async <T = unknown, D = unknown>(config: AxiosRequestConfig<D>) => {
		const res = await request.request<T>(config);
		return res.data;
	},

	pureRequest: async <T = unknown, D = unknown>(
		config: AxiosRequestConfig<D>,
	) => {
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
