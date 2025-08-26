package main

import (
	"log"
	"sl-server/config"
	"sl-server/database"
	"sl-server/handlers"
	"sl-server/middleware"
	"sl-server/models"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 加载环境变量配置
	if err := config.LoadConfig(); err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化日志
	if err := config.InitLogger(); err != nil {
		log.Fatalf("初始化日志失败: %v", err)
	}
	defer config.Cleanup()

	config.Logger.Info("应用启动中...")

	// 设置Gin模式
	gin.SetMode(config.AppConfig.GinMode)

	// 连接数据库
	database.ConnectDB()

	// 自动迁移数据库
	database.DB.AutoMigrate(&models.User{}, &models.Post{})
	config.Logger.Info("数据库迁移完成")

	r := gin.Default()

	// 静态文件服务，使用配置中的上传路径
	r.Static("/uploads", config.AppConfig.UploadPath)

	// Auth
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	// Posts
	r.GET("/posts", handlers.GetPosts)
	r.POST("/posts", middleware.AuthRequired(), handlers.CreatePost)

	// Upload
	r.POST("/upload", middleware.AuthRequired(), handlers.UploadFile)

	serverAddr := ":" + config.AppConfig.ServerPort
	config.Logger.Info("服务器启动", zap.String("port", config.AppConfig.ServerPort), zap.String("mode", config.AppConfig.GinMode))

	if err := r.Run(serverAddr); err != nil {
		config.Logger.Fatal("服务器启动失败", zap.Error(err))
	}
}
