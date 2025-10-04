import { BEARER } from "@/consts";

export const concatBearerHeaderValue = (value: string) => {
	return `${BEARER} ${value}`;
};
