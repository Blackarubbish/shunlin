import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/apis/auth";
import { userApi } from "@/apis/user";
import type { LoginForm, LoginResponse, User } from "@/types";

// Token管理工具
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_info";

export const tokenStorage = {
	get: () => localStorage.getItem(TOKEN_KEY),
	set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
	remove: () => localStorage.removeItem(TOKEN_KEY),
};

export const refreshTokenStorage = {
	get: () => localStorage.getItem(REFRESH_TOKEN_KEY),
	set: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
	remove: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
};

const userStorage = {
	get: (): User | null => {
		const userStr = localStorage.getItem(USER_KEY);
		return userStr ? JSON.parse(userStr) : null;
	},
	set: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
	remove: () => localStorage.removeItem(USER_KEY),
};

// 查询键
const AUTH_QUERY_KEYS = {
	user: ["auth", "user"] as const,
	login: ["auth", "login"] as const,
	logout: ["auth", "logout"] as const,
};

export const useAuth = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const _refreshTokenInterval = useRef<ReturnType<typeof setInterval> | null>(
		null,
	);

	// 获取当前用户信息
	const {
		data: user,
		isLoading: isUserLoading,
		error: userError,
	} = useQuery({
		queryKey: AUTH_QUERY_KEYS.user,
		queryFn: async (): Promise<User | null> => {
			const token = tokenStorage.get();
			if (!token) return null;

			return userApi.getProfile();
			// return userStorage.get();
		},
		staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
		retry: false,
		enabled: !!tokenStorage.get(),
	});

	// 登录mutation
	const loginMutation = useMutation({
		mutationKey: AUTH_QUERY_KEYS.login,
		mutationFn: async (loginData: LoginForm): Promise<LoginResponse> => {
			const response = await authApi.login(loginData);
			return response;
		},
		onSuccess: (data) => {
			// 存储token和用户信息
			tokenStorage.set(data.token);
			refreshTokenStorage.set(data.refresh_token);
			userStorage.set(data.user);

			// 更新查询缓存
			queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);

			message.success("登录成功！");
			navigate("/");
		},
		onError: (error: unknown) => {
			console.error("登录失败:", error);
			const errorMessage =
				error instanceof Error ? error.message : "登录失败，请检查用户名和密码";
			message.error(errorMessage);
		},
	});

	// 登出mutation
	const logoutMutation = useMutation({
		mutationKey: AUTH_QUERY_KEYS.logout,
		mutationFn: async () => {
			// 这里应该调用登出API
			// 暂时只清除本地存储
			return Promise.resolve();
		},
		onSuccess: () => {
			// 清除所有认证相关数据
			tokenStorage.remove();
			refreshTokenStorage.remove();
			userStorage.remove();

			// 清除所有查询缓存
			queryClient.clear();

			message.success("已退出登录");
			navigate("/login");
		},
		onError: (error: unknown) => {
			console.error("登出失败:", error);
			message.error("登出失败");
		},
	});

	const refreshTokenMutation = useMutation({
		mutationKey: ["auth", "refresh"],
		mutationFn: async () => {
			const refreshTokenValue = refreshTokenStorage.get();
			if (!refreshTokenValue) {
				throw new Error("没有refresh token");
			}
			return await authApi.refreshToken(refreshTokenValue);
		},
		onSuccess: (data) => {
			tokenStorage.set(data.token);
			refreshTokenStorage.set(data.refresh_token);
		},
		onError: (error) => {
			console.error("Token刷新失败:", error);
			logout();
		},
	});

	// 登出函数
	const logout = useCallback(() => {
		logoutMutation.mutate();
	}, [logoutMutation]);

	// 登录函数
	const login = useCallback(
		(loginData: LoginForm) => {
			loginMutation.mutate(loginData);
		},
		[loginMutation],
	);

	// 检查是否已认证
	const isAuthenticated = !!user && !!tokenStorage.get();

	// 获取token
	const getToken = useCallback(() => {
		return tokenStorage.get();
	}, []);

	// 处理认证错误
	useEffect(() => {
		if (userError) {
			// 如果获取用户信息失败，可能是token过期
			logout();
		}
	}, [userError, logout]);

	useEffect(() => {}, []);

	return {
		// 状态
		user,
		isAuthenticated,
		isLoading:
			isUserLoading || loginMutation.isPending || logoutMutation.isPending,

		// 方法
		login,
		logout,
		getToken,

		// 原始mutation状态（用于更细粒度的控制）
		refreshTokenMutation,
		loginMutation,
		logoutMutation,
	};
};

export default useAuth;
