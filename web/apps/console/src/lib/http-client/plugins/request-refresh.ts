import axios from "axios";
import { authApi } from "@/apis/auth";
import { refreshTokenStorage, tokenStorage } from "@/hooks/useAuth";
import type { RefreshTokenResponse } from "@/types/auth";
import { concatBearerHeaderValue } from "@/utils/string";
import type { HttpError, ResponsePlugin } from "..";

interface TokenRefreshPluginCreatorOpt {
	onRefreshError?: (error: HttpError) => void;
	onStartRefresh?: () => boolean;
	onRefreshSuccess?: (data: RefreshTokenResponse) => void;
}

// 在 response-error.ts 中添加
export const tokenRefreshPluginCreator = (
	opts: TokenRefreshPluginCreatorOpt
): ResponsePlugin => {
	const { onRefreshError, onRefreshSuccess } = opts;
	// 是否开始刷新, 默认是 true
	const onStartRefresh = opts.onStartRefresh || (() => true);
	return () => {
		return {
			onRejected: async (error) => {
				const originalRequest = error.config;
				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;
					try {
						if (onStartRefresh?.()) {
							return Promise.reject(error);
						}
						const refreshToken = refreshTokenStorage.get();
						if (refreshToken) {
							const response = await authApi.refreshToken(refreshToken);
							tokenStorage.set(response.token);
							refreshTokenStorage.set(response.refresh_token);
							originalRequest.headers.Authorization = concatBearerHeaderValue(
								response.token
							);
							onRefreshSuccess?.(response);
							return axios(originalRequest);
						}
					} catch (_refreshError) {
						onRefreshError?.(error);
					}
				}

				return Promise.reject(error);
			},
			key: "tokenRefresh",
		};
	};
};
