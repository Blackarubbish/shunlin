package main

import (
	"log"
	"sl-server/internal/config"
	"sl-server/internal/repository"
	"sl-server/internal/model"
	"sl-server/pkg/seeder"
	"sl-server/pkg/validate"
	"sl-server/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
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
	repository.ConnectDB()

	// 自动迁移数据库
	repository.DB.AutoMigrate(&model.User{}, &model.Category{}, &model.Post{}, &model.Media{})
	config.Logger.Info("数据库迁移完成")

	// 初始化数据
	if err := seeder.RunSeeder(repository.DB); err != nil {
		config.Logger.Fatal("初始化数据失败", zap.Error(err))
	}

	// 初始化验证器
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		validate.BindingValidator(v)
	}

	// 初始化路由
	r := gin.Default()

	// 静态文件服务，使用配置中的上传路径
	r.Static("/uploads", config.AppConfig.UploadPath)

	routes.RegisterRoutes(r)

	serverAddr := ":" + config.AppConfig.ServerPort
	config.Logger.Info("服务器启动", zap.String("port", config.AppConfig.ServerPort), zap.String("mode", config.AppConfig.GinMode))

	if err := r.Run(serverAddr); err != nil {
		config.Logger.Fatal("服务器启动失败", zap.Error(err))
	}
}
