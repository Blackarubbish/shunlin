package routes

import (
	"sl-server/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	v1 := api.Group("/v1")
	{
		// 用户认证相关
		v1.POST("/register", handlers.Register)
		v1.POST("/login", handlers.Login)

		// 媒体文件相关
		media := v1.Group("/media")
		{
			media.POST("/upload", handlers.UploadFile)             // 单文件上传
			media.POST("/batch-upload", handlers.BatchUploadFiles) // 批量上传
			media.GET("/list", handlers.GetMediaList)              // 获取媒体列表
			media.GET("/:id", handlers.GetMediaByID)               // 获取媒体详情
			media.PUT("/:id", handlers.UpdateMediaInfo)            // 更新媒体信息
			media.DELETE("/:id", handlers.DeleteMedia)             // 删除媒体
		}

		// 兼容旧的上传接口
		v1.POST("/uploads", handlers.UploadFile)

		// 文章相关
		posts := v1.Group("/posts")
		{
			posts.GET("", handlers.GetPosts)          // 获取文章列表
			posts.POST("", handlers.CreatePost)       // 创建文章
			posts.GET("/:id", handlers.GetOnePost)    // 获取单篇文章
			posts.PUT("/:id", handlers.UpdatePost)    // 更新文章
			posts.DELETE("/:id", handlers.DeletePost) // 删除文章
		}

		// 分类相关
		categories := v1.Group("/categories")
		{
			categories.POST("", handlers.CreateCategory) // 创建分类
			categories.GET("", handlers.GetCategories)   // 获取分类列表
		}
	}
}
