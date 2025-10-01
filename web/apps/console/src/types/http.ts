export interface JsonResponse<T> {
	code: number;
	data: T;
	message?: string;
}
