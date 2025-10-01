import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "@/apis/auth";
import type { LoginForm, LoginResponse, User } from "@/types/auth";

// Token管理工具
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_info";

const tokenStorage = {
	get: () => localStorage.getItem(TOKEN_KEY),
	set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
	remove: () => localStorage.removeItem(TOKEN_KEY),
};

const refreshTokenStorage = {
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

			// 这里应该调用获取用户信息的API
			// 暂时返回存储的用户信息
			return userStorage.get();
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
			return response as LoginResponse;
		},
		onSuccess: (data) => {
			// 存储token和用户信息
			tokenStorage.set(data.token);
			refreshTokenStorage.set(data.refreshToken);
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

	// 刷新token（如果需要的话）
	const refreshToken = useCallback(async () => {
		const refreshTokenValue = refreshTokenStorage.get();
		if (!refreshTokenValue) {
			logout();
			return;
		}

		try {
			// 这里应该调用刷新token的API
			// 暂时直接返回
			return Promise.resolve();
		} catch (error) {
			console.error("刷新token失败:", error);
			logout();
		}
	}, [logout]);

	// 自动刷新token
	useEffect(() => {
		if (!isAuthenticated) return;

		const token = tokenStorage.get();
		if (!token) return;

		// 设置定时器，在token过期前刷新
		const refreshInterval = setInterval(
			() => {
				refreshToken();
			},
			30 * 60 * 1000,
		); // 每30分钟检查一次

		return () => clearInterval(refreshInterval);
	}, [isAuthenticated, refreshToken]);

	// 处理认证错误
	useEffect(() => {
		if (userError) {
			// 如果获取用户信息失败，可能是token过期
			logout();
		}
	}, [userError, logout]);

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
		refreshToken,

		// 原始mutation状态（用于更细粒度的控制）
		loginMutation,
		logoutMutation,
	};
};

export default useAuth;
