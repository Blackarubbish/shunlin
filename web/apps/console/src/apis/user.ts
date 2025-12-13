import { HttpMethod } from "@/lib/http-client";
import type { ChangePasswordForm, User } from "@/types";
import { hashPassword, httpClient } from "@/utils";

export const userApi = {
	// 获取用户资料
	getProfile: async () => {
		const res = await httpClient.jsonRequest<User>(
			"/api/v1/admin/user/profile",
			HttpMethod.GET,
			{}
		);
		return res;
	},

	// 修改密码
	changePassword: async (data: ChangePasswordForm) => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			"/api/v1/admin/user/change-password",
			HttpMethod.POST,
			{
				data: {
					current_password: hashPassword(data.currentPassword),
					new_password: hashPassword(data.newPassword),
				},
			}
		);
		return res;
	},

	// 登出
	logout: async () => {
		const res = await httpClient.jsonRequest<{ message: string }>(
			"/api/v1/admin/user/logout",
			HttpMethod.POST,
			{}
		);
		return res;
	},
};
