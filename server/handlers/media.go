package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/dto"
	"sl-server/pkgs/response"
	"sl-server/services"
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
		response.Error(c, http.StatusBadRequest, "请选择要上传的文件")
		return
	}

	// 2. 获取用户ID（从JWT或session中获取）
	// 这里暂时硬编码，实际应该从认证中间件获取
	userID := uint(1) // TODO: 从认证中间件获取真实用户ID

	// 3. 调用服务层处理上传
	result, err := services.UploadFile(fileHeader, userID)
	if err != nil {
		config.Logger.Error("文件上传失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	config.Logger.Info("文件上传成功",
		zap.String("filename", result.Filename),
		zap.Uint("id", result.ID))

	response.Success(c, result)
}

// BatchUploadFiles 批量文件上传
func BatchUploadFiles(c *gin.Context) {
	config.Logger.Info("批量文件上传请求")

	form, err := c.MultipartForm()
	if err != nil {
		config.Logger.Warn("解析表单失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, "解析表单失败")
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		response.Error(c, http.StatusBadRequest, "请选择要上传的文件")
		return
	}

	userID := uint(1) // TODO: 从认证中间件获取

	result, err := services.BatchUpload(files, userID)
	if err != nil {
		config.Logger.Error("批量上传失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	config.Logger.Info("批量上传完成",
		zap.Int("success", result.SuccessCount),
		zap.Int("error", result.ErrorCount))

	response.Success(c, result)
}

// GetMediaList 获取媒体列表
func GetMediaList(c *gin.Context) {
	var query dto.MediaQueryDto
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	query.Normalize()

	result, err := services.GetMediaList(query)
	if err != nil {
		config.Logger.Error("获取媒体列表失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, result)
}

// GetMediaByID 根据ID获取媒体信息
func GetMediaByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的媒体ID")
		return
	}

	media, err := services.GetMediaByID(uint(id))
	if err != nil {
		config.Logger.Error("获取媒体信息失败", zap.Error(err))
		response.Error(c, http.StatusNotFound, err.Error())
		return
	}

	response.Success(c, media)
}

// DeleteMedia 删除媒体
func DeleteMedia(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的媒体ID")
		return
	}

	// TODO: 从认证中间件获取用户ID
	userID := uint(1)

	if err := services.DeleteMedia(uint(id), userID); err != nil {
		config.Logger.Error("删除媒体失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, gin.H{"message": "删除成功"})
}

// UpdateMediaInfo 更新媒体信息
func UpdateMediaInfo(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的媒体ID")
		return
	}

	var req struct {
		Description string `json:"description"`
		Alt         string `json:"alt"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "参数错误")
		return
	}

	userID := uint(1) // TODO: 从认证中间件获取

	media, err := services.UpdateMediaInfo(uint(id), userID, req.Description, req.Alt)
	if err != nil {
		config.Logger.Error("更新媒体信息失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, media)
}
