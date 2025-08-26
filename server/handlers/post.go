package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/database"
	"sl-server/models"
	"sl-server/utils/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func GetPosts(c *gin.Context) {
	config.Logger.Info("获取文章列表请求")

	var posts []models.Post
	if err := database.DB.Find(&posts).Error; err != nil {
		config.Logger.Error("获取文章列表失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "获取文章失败")
		return
	}

	config.Logger.Info("成功获取文章列表", zap.Int("count", len(posts)))
	response.Success(c, posts)
}

func CreatePost(c *gin.Context) {
	config.Logger.Info("创建文章请求")

	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		config.Logger.Warn("创建文章数据绑定失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := database.DB.Create(&post).Error; err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "创建文章失败")
		return
	}

	config.Logger.Info("文章创建成功", zap.Uint("post_id", post.ID), zap.String("title", post.Title))
	response.Success(c, post)
}
