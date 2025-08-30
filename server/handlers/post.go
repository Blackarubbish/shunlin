package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/dto"
	"sl-server/pkgs/response"
	"sl-server/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

func GetPosts(c *gin.Context) {

	var query dto.GetPostsQueryDto
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	query.Normalize()

	config.Logger.Info("获取文章列表请求", zap.Any("query", query))

	data, err := services.GetPosts(query)

	if err != nil {
		config.Logger.Error("获取文章列表失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	config.Logger.Info("成功获取文章列表", zap.Int("count", len(data.Items)))
	response.Success(c, data)
}

func CreatePost(c *gin.Context) {
	config.Logger.Info("创建文章请求")

	var postRequest dto.CreatePostRequestDto
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

	post, err := services.CreatePost(postRequest)
	if err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	config.Logger.Info("文章创建成功", zap.Uint("post_id", post.ID), zap.String("title", post.Title))
	response.Success(c, post)
}

func GetOnePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	post, err := services.GetOnePostByID(uint(idUint))
	if err != nil {
		config.Logger.Error("获取文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, post)
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	var updatePostRequest dto.UpdatePostRequestDto
	if err := c.ShouldBindJSON(&updatePostRequest); err != nil {
		validateErrors, ok := err.(validator.ValidationErrors)
		if ok {
			config.Logger.Warn("更新文章参数验证失败", zap.Error(validateErrors))
			response.Error(c, http.StatusBadRequest, validateErrors.Error())
			return
		}
		config.Logger.Warn("更新文章数据绑定失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	post, err := services.UpdatePost(uint(idUint), updatePostRequest)
	if err != nil {
		config.Logger.Error("更新文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, post)
}

func DeletePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	err = services.DeletePost(uint(idUint))
	if err != nil {
		config.Logger.Error("删除文章失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, nil)
}
