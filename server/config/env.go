package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

// Config 应用配置结构
type Config struct {
	// 服务器配置
	ServerPort string
	GinMode    string

	// 数据库配置
	DBPath string

	// JWT配置
	JWTSecret string

	// 日志配置
	LogLevel string

	// 文件上传配置
	UploadPath string
}

var AppConfig *Config

// LoadConfig 加载环境变量配置
func LoadConfig() error {
	// 尝试加载 .env 文件（如果存在）
	if err := godotenv.Load(); err != nil {
		// .env 文件不存在是正常的，比如在生产环境中
		if Logger != nil {
			Logger.Info("未找到.env文件，使用系统环境变量", zap.Error(err))
		}
	}

	AppConfig = &Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		GinMode:    getEnv("GIN_MODE", "debug"),
		DBPath:     getEnv("DB_PATH", "blog.db"),
		JWTSecret:  getEnv("JWT_SECRET", "mysecretkey_please_change_in_production"),
		LogLevel:   getEnv("LOG_LEVEL", "info"),
		UploadPath: getEnv("UPLOAD_PATH", "./uploads"),
	}

	if Logger != nil {
		Logger.Info("配置加载完成",
			zap.String("server_port", AppConfig.ServerPort),
			zap.String("gin_mode", AppConfig.GinMode),
			zap.String("db_path", AppConfig.DBPath),
			zap.String("log_level", AppConfig.LogLevel),
			zap.String("upload_path", AppConfig.UploadPath),
		)
	}

	return nil
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt 获取环境变量并转换为整数
func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// getEnvAsBool 获取环境变量并转换为布尔值
func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
