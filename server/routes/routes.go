// routes/routes.go - 更新现有文件
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
		// 公开的认证接口
		auth := v1.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.POST("/refresh", handlers.RefreshToken)
		}
		// 博客接口, 公开
		// _ := v1.Group("/blog")
		{
			// todo: 博客接口

		}

		// 管理后台接口
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthRequired())
		{
			// 用户相关
			user := admin.Group("/user")
			{
				user.GET("/profile", handlers.GetProfile)
				user.POST("/change-password", handlers.ChangePassword)
				user.POST("/logout", handlers.Logout)
			}

			// 媒体文件
			media := admin.Group("/media")
			{
				media.POST("/upload", handlers.UploadFile)
				// media.POST("/batch-upload", handlers.BatchUploadFiles)
				media.GET("/list", handlers.GetMediaList)
				media.GET("/:id", handlers.GetMediaByID)
				media.PUT("/:id", handlers.UpdateMediaInfo)
				media.DELETE("/:id", handlers.DeleteMedia)
			}

			// 文章
			posts := admin.Group("/posts")
			{
				posts.GET("", handlers.GetPosts)
				posts.POST("", handlers.CreatePost)
				posts.GET("/:id", handlers.GetOnePost)
				posts.PUT("/:id", handlers.UpdatePost)
				posts.DELETE("/:id", handlers.DeletePost)
			}

			// 分类
			categories := admin.Group("/categories")
			{
				categories.POST("", handlers.CreateCategory)
				categories.GET("", handlers.GetCategories)
				categories.GET("/:id", handlers.GetCategoryByID)
				categories.PATCH("/:id", handlers.UpdateCategory)
				categories.DELETE("/:id", handlers.DeleteCategory)
			}
		}
	}
}
