package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/services"
	"sl-server/utils/response"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
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

	var postRequest dto.PostRequestDto
	if err := c.ShouldBindJSON(&postRequest); err != nil {
		validateErrors, ok := err.(validator.ValidationErrors)
		if ok {
			config.Logger.Warn("创建文章参数验证失败", zap.Error(validateErrors))
			response.Error(c, http.StatusBadRequest, validateErrors.Error())
			return
		}
		config.Logger.Warn("创建文章数据绑定失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	postResponse, err := services.CreatePost(postRequest)
	if err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	config.Logger.Info("文章创建成功", zap.Uint("post_id", postResponse.ID), zap.String("title", postResponse.Title))
	response.Success(c, postResponse)
}
