package config

// GetJWTSecret 获取JWT密钥
func GetJWTSecret() []byte {
	if AppConfig != nil {
		return []byte(AppConfig.JWTSecret)
	}
	// 如果配置未加载，返回默认值
	return []byte("mysecretkey")
}
