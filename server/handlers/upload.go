package handlers

import (
	"net/http"
	"path/filepath"
	"sl-server/config"
	"sl-server/utils/response"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func UploadFile(c *gin.Context) {
	config.Logger.Info("文件上传请求")

	file, err := c.FormFile("file")
	if err != nil {
		config.Logger.Warn("文件上传失败，未找到文件", zap.Error(err))
		response.Error(c, http.StatusBadRequest, "no file")
		return
	}

	config.Logger.Info("开始处理文件上传", zap.String("filename", file.Filename), zap.Int64("size", file.Size))

	path := filepath.Join(config.AppConfig.UploadPath, file.Filename)
	if err := c.SaveUploadedFile(file, path); err != nil {
		config.Logger.Error("文件保存失败", zap.String("filename", file.Filename), zap.String("path", path), zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "failed to save file")
		return
	}

	config.Logger.Info("文件上传成功", zap.String("filename", file.Filename), zap.String("path", path))
	response.Success(c, gin.H{"url": "/uploads/" + file.Filename})
}
