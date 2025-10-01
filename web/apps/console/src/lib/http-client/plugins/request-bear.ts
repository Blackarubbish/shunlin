import type { RequestPlugin } from "..";

interface BearerTokenPluginCreatorOpt {
	token: string | (() => string);
}

export const bearerTokenPluginCreator = (
	opts: BearerTokenPluginCreatorOpt,
): RequestPlugin => {
	const { token } = opts;
	return () => {
		return {
			onFullfilled: (config) => {
				config.headers.Authorization = `Bearer ${typeof token === "function" ? token() : token}`;
				return config;
			},
		};
	};
};
