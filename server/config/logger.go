package config

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Logger *zap.Logger

// InitLogger 初始化zap日志
func InitLogger() error {
	// 创建编码配置
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.TimeKey = "timestamp"
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder

	// 创建核心配置
	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderConfig), // JSON 格式
		zapcore.AddSync(os.Stdout),           // 输出到标准输出
		zapcore.InfoLevel,                    // 日志级别
	)

	// 创建logger
	Logger = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))

	return nil
}

// Cleanup 清理日志资源
func Cleanup() {
	if Logger != nil {
		Logger.Sync()
	}
}
