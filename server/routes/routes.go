package routes

import (
	"sl-server/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	v1 := api.Group("/v1")
	{

		v1.POST("/register", handlers.Register)
		v1.POST("/login", handlers.Login)

		// 上传文件
		v1.POST("/uploads", handlers.UploadFile)

		// 文章相关
		v1.GET("/posts", handlers.GetPosts)
		v1.POST("/posts", handlers.CreatePost)
		v1.GET("/posts/:id", handlers.GetOnePost)
		v1.PUT("/posts/:id", handlers.UpdatePost)
		v1.DELETE("/posts/:id", handlers.DeletePost)

		// 分类相关
		v1.POST("/categories", handlers.CreateCategory)

	}

}
