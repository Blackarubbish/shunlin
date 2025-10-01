import type { LoginForm } from "@/types/auth";

import { hashPassword, httpClient } from "@/utils";

const authApi = {
	login: async (data: LoginForm) => {
		const res = await httpClient.post("/api/v1/auth/login", {
			username: data.email,
			password: hashPassword(data.password),
		});
		return res;
	},
};

export default authApi;
