// routes/routes.go - 更新现有文件
package routes

import (
	"net/http"
	"sl-server/internal/handler"
	"sl-server/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	v1 := api.Group("/v1")
	{
		// 公开的认证接口
		auth := v1.Group("/auth")
		{
			auth.POST("/register", handler.Register)
			auth.POST("/login", handler.Login)
			auth.POST("/refresh", handler.RefreshToken)
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
				user.GET("/profile", handler.GetProfile)
				user.POST("/change-password", handler.ChangePassword)
				user.POST("/logout", handler.Logout)
			}

			// 媒体文件
			media := admin.Group("/media")
			{
				media.POST("/upload", handler.UploadFile)
				// media.POST("/batch-upload", handler.BatchUploadFiles)
				media.GET("/list", handler.GetMediaList)
				media.GET("/:id", handler.GetMediaByID)
				media.PUT("/:id", handler.UpdateMediaInfo)
				media.DELETE("/:id", handler.DeleteMedia)
			}

			// 文章
			posts := admin.Group("/posts")
			{
				posts.GET("", handler.GetPosts)
				posts.POST("", handler.CreatePost)
				posts.GET("/:id", handler.GetOnePost)
				posts.PUT("/:id", handler.UpdatePost)
				posts.DELETE("/:id", handler.DeletePost)
			}

			// 分类
			categories := admin.Group("/categories")
			{
				categories.POST("", handler.CreateCategory)
				categories.GET("", handler.GetCategories)
				categories.GET("/:id", handler.GetCategoryByID)
				categories.PATCH("/:id", handler.UpdateCategory)
				categories.DELETE("/:id", handler.DeleteCategory)
			}
		}
	}
	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	})
}
