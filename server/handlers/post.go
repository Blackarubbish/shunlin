package handlers

import (
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
		config.Logger.Warn("get posts validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}

	query.Normalize()

	config.Logger.Info("get posts request", zap.Any("query", query))

	data, err := services.GetPosts(query)

	if err != nil {
		config.Logger.Error("get posts failed", zap.Error(err))
		response.Error(c, err)
		return
	}
	config.Logger.Info("get posts success", zap.Any("data", data))
	response.Success(c, data)
}

func CreatePost(c *gin.Context) {
	config.Logger.Info("create post request")

	var postRequest dto.CreatePostRequestDto
	if err := c.ShouldBindJSON(&postRequest); err != nil {
		validateErrors, ok := err.(validator.ValidationErrors)
		if ok {
			config.Logger.Warn("create post validation failed", zap.Error(validateErrors))
			response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": validateErrors.Error()}))
			return
		}
		config.Logger.Warn("create post data binding failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": err.Error()}))
		return
	}

	post, err := services.CreatePost(c, postRequest)
	if err != nil {
		config.Logger.Error("create post failed", zap.Error(err))
		response.Error(c, err)
		return
	}

	config.Logger.Info("create post success", zap.Uint("post_id", post.ID), zap.String("title", post.Title))
	response.Success(c, post)
}

func GetOnePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("get post validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	post, err := services.GetOnePostByID(uint(idUint))
	if err != nil {
		config.Logger.Error("获取文章失败", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, post)
}

func UpdatePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("update post validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	var updatePostRequest dto.UpdatePostRequestDto
	if err := c.ShouldBindJSON(&updatePostRequest); err != nil {
		validateErrors, ok := err.(validator.ValidationErrors)
		if ok {
			config.Logger.Warn("更新文章参数验证失败", zap.Error(validateErrors))
			response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": validateErrors.Error()}))
			return
		}
		config.Logger.Warn("更新文章数据绑定失败", zap.Error(err))
		response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": err.Error()}))
		return
	}
	post, err := services.UpdatePost(uint(idUint), updatePostRequest)
	if err != nil {
		config.Logger.Error("更新文章失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	response.Success(c, post)
}

func DeletePost(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("delete post validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	err = services.DeletePost(uint(idUint))
	if err != nil {
		config.Logger.Error("删除文章失败", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, nil)
}
