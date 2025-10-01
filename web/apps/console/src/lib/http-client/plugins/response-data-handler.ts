import type { HttpError, ResponsePlugin } from "..";

export const responseDataHandlerPluginCreator = (): ResponsePlugin => {
	return () => {
		return {
			onFullfilled: (response) => {
				if (
					response.data &&
					response?.data?.code === 0 &&
					response.status === 200
				) {
					return response.data.data;
				}
				const err: HttpError = {
					code: response.data?.code || -1,
					statusCode: response.status || -1,
					detail: response.data?.message || "Unknown error",
					data: response.data,
				};
				throw err;
			},
		};
	};
};
