import type { AxiosRequestConfig } from "axios";
import { concatBearerHeaderValue } from "@/utils/string";
import type { RequestPlugin } from "..";

interface BearerTokenPluginCreatorOpt {
	token: string | ((config: AxiosRequestConfig) => string);
}

export const bearerTokenPluginCreator = (
	opts: BearerTokenPluginCreatorOpt
): RequestPlugin => {
	const { token } = opts;
	console.log("token1111", token);
	return () => {
		console.log("token2222", token);
		return {
			onFullfilled: (config) => {
				console.log("config3333", config);
				config.headers.Authorization = concatBearerHeaderValue(
					typeof token === "function" ? token(config) : token
				);
				return config;
			},
			key: "bearerToken",
		};
	};
};
