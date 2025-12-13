package handler

import (
	"sl-server/internal/config"
	"sl-server/internal/dto"
	"sl-server/pkg/response"
	"sl-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// UploadFile 单文件上传
func UploadFile(c *gin.Context) {
	config.Logger.Info("文件上传请求")

	// 1. 获取上传的文件
	fileHeader, err := c.FormFile("file")
	if err != nil {
		config.Logger.Warn("未找到上传文件", zap.Error(err))
		response.Error(c, response.ErrMediaFileNotFound.Error())
		return
	}

	// 3. 调用服务层处理上传
	result, err := service.UploadFile(c, fileHeader)
	if err != nil {
		config.Logger.Error("文件上传失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	config.Logger.Info("文件上传成功",
		zap.String("filename", result.Filename),
		zap.Uint("id", result.ID))

	response.Success(c, result)
}

// BatchUploadFiles 批量文件上传
// func BatchUploadFiles(c *gin.Context) {
// 	config.Logger.Info("批量文件上传请求")

// 	form, err := c.MultipartForm()
// 	if err != nil {
// 		config.Logger.Warn("解析表单失败", zap.Error(err))
// 		response.Error(c, response.ErrValidation.WithCause(err.Error()))
// 		return
// 	}

// 	files := form.File["files"]
// 	if len(files) == 0 {
// 		response.Error(c, response.ErrMediaFileNotFound.Error())
// 		return
// 	}

// 	userID := uint(1) // TODO: 从认证中间件获取

// 	result, err := service.BatchUpload(files, userID)
// 	if err != nil {
// 		config.Logger.Error("批量上传失败", zap.Error(err))
// 		response.Error(c, err)
// 		return
// 	}

// 	config.Logger.Info("批量上传完成",
// 		zap.Int("success", result.SuccessCount),
// 		zap.Int("error", result.ErrorCount))

// 	response.Success(c, result)
// }

// GetMediaList 获取媒体列表
func GetMediaList(c *gin.Context) {
	var query dto.MediaQueryDto
	if err := c.ShouldBindQuery(&query); err != nil {
		config.Logger.Warn("get media list validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}

	query.Normalize()

	result, err := service.GetMediaList(query)
	if err != nil {
		config.Logger.Error("获取媒体列表失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	response.Success(c, result)
}

// GetMediaByID 根据ID获取媒体信息
func GetMediaByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		config.Logger.Warn("get media by id validation failed", zap.Error(err))
		response.Error(c, response.ErrMediaInvalidID.WithCause(err.Error()))
		return
	}

	media, err := service.GetMediaByID(uint(id))
	if err != nil {
		config.Logger.Error("获取媒体信息失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	response.Success(c, media)
}

// DeleteMedia 删除媒体
func DeleteMedia(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		config.Logger.Warn("delete media validation failed", zap.Error(err))
		response.Error(c, response.ErrMediaInvalidID.WithCause(err.Error()))
		return
	}

	// TODO: 从认证中间件获取用户ID
	userID := uint(1)

	if err := service.DeleteMedia(uint(id), userID); err != nil {
		config.Logger.Error("删除媒体失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	response.Success(c, gin.H{"message": "删除成功"})
}

// UpdateMediaInfo 更新媒体信息
func UpdateMediaInfo(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		config.Logger.Warn("update media validation failed", zap.Error(err))
		response.Error(c, response.ErrMediaInvalidID.WithCause(err.Error()))
		return
	}

	var req struct {
		Description string `json:"description"`
		Alt         string `json:"alt"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		config.Logger.Warn("update media data binding failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}

	userID := uint(1) // TODO: 从认证中间件获取

	media, err := service.UpdateMediaInfo(uint(id), userID, req.Description, req.Alt)
	if err != nil {
		config.Logger.Error("更新媒体信息失败", zap.Error(err))
		response.Error(c, err)
		return
	}

	response.Success(c, media)
}
