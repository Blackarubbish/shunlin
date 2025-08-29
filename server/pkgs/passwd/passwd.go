package passwd

import (
	"fmt"

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
