import type { HttpError, ResponsePlugin } from "..";

export const isHttpError = (error: any): error is HttpError => {
	return (
		error.code !== undefined &&
		error.statusCode !== undefined &&
		error.detail !== undefined
	);
};

interface ErrorHandlerPluginCreatorOpt {
	onError?: (error: HttpError) => void;
}
export const errorHandlerPluginCreator = (
	opts: ErrorHandlerPluginCreatorOpt = {},
): ResponsePlugin => {
	const { onError } = opts;
	return () => {
		return {
			onRejected: (error): Promise<HttpError> => {
				const errorObject: HttpError = {
					code: -1,
					statusCode: error.response?.status || -1,
					detail: "",
				};
				const responseData = error.response?.data;
				if (!responseData) {
					errorObject.detail = "Unknown error";
					onError?.(errorObject);
					return Promise.reject(errorObject);
				}
				errorObject.data = responseData;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				errorObject.detail = (responseData as any)?.message || "Unknown error";
				onError?.(errorObject);
				return Promise.reject(errorObject);
			},
			key: "responseError",
		};
	};
};
