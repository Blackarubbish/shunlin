import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";

// 加密密钥 - 在生产环境中应该从环境变量获取
const SECRET_KEY =
	import.meta.env.VITE_ENCRYPT_KEY || "wow-you-can-really-dance-lsl-090";

/**
 * 使用AES加密数据
 * @param data 要加密的数据
 * @returns 加密后的字符串
 */
export const aesEncrypt = (
	data: string,
	key: string,
	iv: CryptoJS.lib.WordArray
) => {
	try {
		const encrypted = CryptoJS.AES.encrypt(data, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});
		return encrypted;
	} catch (error) {
		console.error("加密失败:", error);
		throw new Error("数据加密失败");
	}
};

/**
 * 使用AES解密数据
 * @param encryptedData 加密的数据
 * @returns 解密后的字符串
 */
export const aesDecrypt = (
	encryptedData: string,
	key: string,
	iv: CryptoJS.lib.WordArray
): string => {
	try {
		const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error("解密失败:", error);
		throw new Error("数据解密失败");
	}
};

/**
 * 生成密码哈希（用于服务端验证）
 * @param password 原始密码
 * @returns 哈希后的密码
 */
export const hashPassword = (password: string): string => {
	return CryptoJS.SHA256(password).toString();
};

/**
 * 生成随机盐值
 * @returns 随机盐值
 */
export const generateSalt = (): string => {
	return CryptoJS.lib.WordArray.random(16).toString();
};

/**
 * 使用盐值哈希密码
 * @param password 原始密码
 * @param salt 盐值
 * @returns 加盐哈希后的密码
 */
export const hashPasswordWithSalt = (
	password: string,
	salt: string
): string => {
	return CryptoJS.PBKDF2(password, salt, {
		keySize: 256 / 32,
		iterations: 10000,
	}).toString();
};

/**
 * 验证密码
 * @param password 原始密码
 * @param hashedPassword 哈希后的密码
 * @param salt 盐值
 * @returns 是否匹配
 */
export const verifyPassword = (
	password: string,
	hashedPassword: string,
	salt: string
): boolean => {
	const hashed = hashPasswordWithSalt(password, salt);
	return hashed === hashedPassword;
};

/**
 * 生成JWT token的签名
 * @param payload 载荷
 * @returns 签名字符串
 */
export const signToken = (payload: Record<string, unknown>): string => {
	return CryptoJS.HmacSHA256(JSON.stringify(payload), SECRET_KEY).toString();
};

export const base64Encrypt = (data: string): string => {
	return Base64.encode(data);
};

export const base64Decrypt = (data: string): string => {
	return Base64.decode(data);
};

export const encryptPassword = (
	password: string
): { encrypted: string; iv: string } => {
	const iv = CryptoJS.lib.WordArray.random(16);
	const encrypted = aesEncrypt(password, SECRET_KEY, iv);
	return {
		encrypted: encrypted.toString(),
		iv: iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64),
	};
};
