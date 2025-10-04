import { HttpMethod } from "@/lib/http-client";
import type {
	LoginForm,
	LoginResponse,
	RefreshTokenResponse,
	RegisterForm,
} from "@/types/auth";
import { hashPassword, httpClient } from "@/utils";

export const authApi = {
	login: async (data: LoginForm) => {
		const res = await httpClient.jsonRequest<LoginResponse>(
			"/api/v1/auth/login",
			HttpMethod.POST,
			{
				data: {
					username: data.email,
					password: hashPassword(data.password),
				},
			},
		);
		return res;
	},

	register: async (data: RegisterForm) => {
		const res = await httpClient.jsonRequest<LoginResponse>(
			"/api/v1/auth/register",
			HttpMethod.POST,
			{
				data: {
					username: data.username,
					email: data.email,
					password: hashPassword(data.password),
				},
			},
		);
		return res;
	},

	refreshToken: async (refreshToken: string) => {
		const res = await httpClient.jsonRequest<RefreshTokenResponse>(
			"/api/v1/auth/refresh",
			HttpMethod.POST,
			{
				data: {
					refresh_token: refreshToken,
				},
			},
		);
		return res;
	},
};
