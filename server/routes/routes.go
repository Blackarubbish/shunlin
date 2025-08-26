package routes

import (
	"sl-server/handlers"
	"sl-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	v1 := api.Group("/v1")
	{

		v1.POST("/register", handlers.Register)
		v1.POST("/login", handlers.Login)

		// 上传文件
		v1.POST("/uploads", middleware.AuthRequired(), handlers.UploadFile)

		// 文章相关
		v1.GET("/posts", middleware.AuthRequired(), handlers.GetPosts)
		v1.POST("/posts", handlers.CreatePost)

	}

}
