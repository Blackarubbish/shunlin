import type {
	AxiosError,
	AxiosResponse,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

export const HttpMethod = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE",
	PATCH: "PATCH",
} as const;

export type HttpMethodUnion = (typeof HttpMethod)[keyof typeof HttpMethod];
export interface HttpError<T = unknown> {
	code: number; // 自定义错误码
	statusCode: number; // 响应状态码
	detail: string | object;
	data?: T; // 响应数据
}

// 响应拦截器配置
export interface ResponseInterceptorConfig {
	onSuccess?: (response: AxiosResponse) => unknown;
	onError?: (error: AxiosError) => unknown;
}

interface HttpClientOpt extends CreateAxiosDefaults {
	plugins: {
		request: RequestPlugin[];
		response: ResponsePlugin[];
	};
}

export type ResponsePlugin = (config: HttpClientOpt) => {
	onFullfilled?: (
		response: AxiosResponse
	) => AxiosResponse | Promise<AxiosResponse>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onRejected?: (error: any) => any;
	key: string;
};

export type RequestPlugin = (config: HttpClientOpt) => {
	onFullfilled?: (
		config: InternalAxiosRequestConfig
	) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onRejected?: (error: any) => any;
	key: string;
};

export const createInstance = (opts: HttpClientOpt) => {
	const instance = axios.create(opts);

	const plugins = opts.plugins;

	instance.interceptors.request.use((config) => {
		return config;
	});

	for (const plugin of plugins.request) {
		const { onFullfilled, onRejected } = plugin(opts);
		instance.interceptors.request.use(onFullfilled, onRejected);
	}
	for (const plugin of plugins.response) {
		const { onFullfilled, onRejected } = plugin(opts);
		instance.interceptors.response.use(onFullfilled, onRejected);
	}

	return instance;
};

export * from "./plugins/request-bear";
export * from "./plugins/request-refresh";
export * from "./plugins/response-error";
