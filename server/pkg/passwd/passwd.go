package passwd

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"io"

	"golang.org/x/crypto/bcrypt"
)

// 加密密码
func HashPassword(password string) (string, error) {
	// 使用默认cost（10），在安全性和性能之间平衡
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("密码加密失败: %v", err)
	}
	return string(hashedBytes), nil
}

// 验证密码
func CheckPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// 验证密码强度（可选）
func ValidatePasswordStrength(password string) error {
	if len(password) < 6 {
		return fmt.Errorf("密码长度至少6位")
	}
	if len(password) > 100 {
		return fmt.Errorf("密码长度不能超过100位")
	}
	// 可以添加更多规则：数字、大小写、特殊字符等
	return nil
}

// AES加密数据
// 与前端CryptoJS.AES.encrypt兼容（使用CBC模式）
func AESEncrypt(data, key string) (string, error) {
	// 创建AES密钥（确保长度为16, 24, 或32字节）
	keyBytes := []byte(key)
	if len(keyBytes) < 32 {
		// 填充密钥到32字节
		paddedKey := make([]byte, 32)
		copy(paddedKey, keyBytes)
		keyBytes = paddedKey
	} else if len(keyBytes) > 32 {
		keyBytes = keyBytes[:32]
	}

	// 创建AES cipher
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", fmt.Errorf("创建AES cipher失败: %v", err)
	}

	// PKCS7填充
	plaintext := []byte(data)
	padding := aes.BlockSize - len(plaintext)%aes.BlockSize
	padtext := make([]byte, len(plaintext)+padding)
	copy(padtext, plaintext)
	for i := len(plaintext); i < len(padtext); i++ {
		padtext[i] = byte(padding)
	}

	// 生成随机IV
	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("生成IV失败: %v", err)
	}

	// 使用CBC模式加密
	mode := cipher.NewCBCEncrypter(block, iv)
	ciphertext := make([]byte, len(padtext))
	mode.CryptBlocks(ciphertext, padtext)

	// 将IV和密文组合，然后进行base64编码
	result := append(iv, ciphertext...)
	return base64.StdEncoding.EncodeToString(result), nil
}

// AES解密数据
// 与前端CryptoJS.AES.decrypt兼容（使用CBC模式）
func AESDecrypt(encryptedData, key, iv string) (string, error) {
	// base64 解码
	data := []byte(encryptedData)

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	plain := make([]byte, len(data))
	mode.CryptBlocks(plain, data)

	// 去掉 PKCS7 填充
	padding := int(plain[len(plain)-1])
	plain = plain[:len(plain)-padding]

	return string(plain), nil
}

func Base64Encode(data string) string {
	return base64.StdEncoding.EncodeToString([]byte(data))
}

func Base64Decode(data string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return "", err
	}
	return string(decoded), nil
}

func DecreptPassword(encryptedData, key, iv string) (string, error) {
	encryptedData, err := Base64Decode(encryptedData)
	if err != nil {
		return "", err
	}
	return AESDecrypt(string(encryptedData), key, iv)
}

// 前端的hash逻辑
func FeHashPassword(password string) string {
	hash := sha256.Sum256([]byte(password)) // 计算 SHA-256
	return hex.EncodeToString(hash[:])      // 转换为16进制字符串
}
