package services

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/pkgs/upload"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

// UploadFile 上传单个文件
func UploadFile(fileHeader *multipart.FileHeader, userID uint) (*dto.UploadResponseDto, error) {
	var media models.Media

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. 验证文件类型
		filetype, err := upload.ValidateFileType(fileHeader.Filename)
		if err != nil {
			return err
		}

		// 2. 验证文件大小
		if err := upload.ValidateFileSize(fileHeader.Size, filetype); err != nil {
			return err
		}

		// 3. 生成唯一文件名
		uniqueFilename := upload.GenerateUniqueFilename(fileHeader.Filename)

		// 4. 生成文件路径
		fullPath, relativePath := upload.GenerateFilePath(
			config.AppConfig.UploadPath,
			uniqueFilename,
			filetype,
		)

		// 5. 保存文件
		if err := upload.SaveFile(fileHeader, fullPath); err != nil {
			config.Logger.Error("文件保存失败", zap.Error(err))
			return fmt.Errorf("文件保存失败: %v", err)
		}

		// 6. 生成访问URL
		fileURL := fmt.Sprintf("/uploads/%s/%s", relativePath, uniqueFilename)

		// 7. 获取文件扩展名和MIME类型
		extension := filepath.Ext(fileHeader.Filename)
		mimeType := fileHeader.Header.Get("Content-Type")
		if mimeType == "" {
			mimeType = upload.GetMimeType(extension)
		}

		// 8. 保存到数据库
		media = models.Media{
			OriginalName: fileHeader.Filename,
			Filename:     uniqueFilename,
			Filepath:     fullPath,
			FileURL:      fileURL,
			Filetype:     filetype,
			MimeType:     mimeType,
			Filesize:     fileHeader.Size,
			Extension:    extension,
			UploadedBy:   userID,
			Status:       "active",
		}

		if err := tx.Create(&media).Error; err != nil {
			config.Logger.Error("媒体记录保存失败", zap.Error(err))
			// 删除文件
			os.Remove(fullPath)
			return fmt.Errorf("媒体记录保存失败: %v", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	config.Logger.Info("文件上传成功",
		zap.String("filename", media.Filename),
		zap.String("original", media.OriginalName),
		zap.Int64("size", media.Filesize),
		zap.Uint("user_id", userID))

	return &dto.UploadResponseDto{
		ID:           media.ID,
		OriginalName: media.OriginalName,
		Filename:     media.Filename,
		FileURL:      media.FileURL,
		Filetype:     media.Filetype,
		Filesize:     media.Filesize,
		Extension:    media.Extension,
		UploadedAt:   media.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// GetMediaList 获取媒体列表
func GetMediaList(query dto.MediaQueryDto) (*dto.MediaListResponseDto, error) {
	var mediaList []models.Media
	db := database.DB.Preload("User")

	// 添加查询条件
	if query.Filetype != "" {
		db = db.Where("filetype = ?", query.Filetype)
	}
	if query.UploadedBy != 0 {
		db = db.Where("uploaded_by = ?", query.UploadedBy)
	}

	// 只查询活跃状态的文件
	db = db.Where("status = ?", "active")

	// 获取总数
	var total int64
	if err := db.Model(&models.Media{}).Count(&total).Error; err != nil {
		config.Logger.Error("获取媒体总数失败", zap.Error(err))
		return nil, fmt.Errorf("获取媒体总数失败: %v", err)
	}

	// 分页查询
	offset := (query.Page - 1) * query.PageSize
	if err := db.Order("created_at DESC").Offset(offset).Limit(query.PageSize).Find(&mediaList).Error; err != nil {
		config.Logger.Error("获取媒体列表失败", zap.Error(err))
		return nil, fmt.Errorf("获取媒体列表失败: %v", err)
	}

	config.Logger.Info("获取媒体列表成功",
		zap.Int("total", int(total)),
		zap.Int("count", len(mediaList)),
		zap.Int("page", query.Page))

	return &dto.MediaListResponseDto{
		Items: mediaList,
		Total: int(total),
		Page:  query.Page,
		Size:  query.PageSize,
	}, nil
}

// GetMediaByID 根据ID获取媒体信息
func GetMediaByID(id uint) (*models.Media, error) {
	var media models.Media
	if err := database.DB.Preload("User").Where("status = ?", "active").First(&media, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("媒体不存在")
		}
		config.Logger.Error("获取媒体失败", zap.Uint("id", id), zap.Error(err))
		return nil, fmt.Errorf("获取媒体失败: %v", err)
	}
	return &media, nil
}

// DeleteMedia 删除媒体（软删除）
func DeleteMedia(id uint, userID uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var media models.Media

		// 查询媒体记录
		if err := tx.First(&media, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("媒体不存在")
			}
			return fmt.Errorf("查询媒体失败: %v", err)
		}

		// 检查权限（只能删除自己上传的文件）
		if media.UploadedBy != userID {
			return fmt.Errorf("无权限删除此文件")
		}

		// 检查文件状态
		if media.Status == "deleted" {
			return fmt.Errorf("文件已被删除")
		}

		// 软删除（更新状态）
		if err := tx.Model(&media).Update("status", "deleted").Error; err != nil {
			return fmt.Errorf("删除媒体失败: %v", err)
		}

		config.Logger.Info("媒体删除成功",
			zap.Uint("id", id),
			zap.String("filename", media.Filename),
			zap.Uint("user_id", userID))

		return nil
	})
}

// BatchUpload 批量上传文件
func BatchUpload(files []*multipart.FileHeader, userID uint) (*dto.BatchUploadResponseDto, error) {
	if len(files) == 0 {
		return nil, fmt.Errorf("请选择要上传的文件")
	}

	// 限制批量上传数量
	if len(files) > 10 {
		return nil, fmt.Errorf("一次最多上传10个文件")
	}

	var results []dto.UploadResponseDto
	var errors []string

	for _, fileHeader := range files {
		result, err := UploadFile(fileHeader, userID)
		if err != nil {
			errorMsg := fmt.Sprintf("%s: %s", fileHeader.Filename, err.Error())
			errors = append(errors, errorMsg)
			config.Logger.Warn("批量上传中的文件失败",
				zap.String("filename", fileHeader.Filename),
				zap.Error(err))
			continue
		}
		results = append(results, *result)
	}

	config.Logger.Info("批量上传完成",
		zap.Int("total", len(files)),
		zap.Int("success", len(results)),
		zap.Int("failed", len(errors)))

	return &dto.BatchUploadResponseDto{
		SuccessCount: len(results),
		ErrorCount:   len(errors),
		Results:      results,
		Errors:       errors,
	}, nil
}

// UpdateMediaInfo 更新媒体信息
func UpdateMediaInfo(id uint, userID uint, description, alt string) (*models.Media, error) {
	var media models.Media

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 查询媒体记录
		if err := tx.First(&media, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return fmt.Errorf("文件不存在")
			}
			return fmt.Errorf("查询文件失败: %v", err)
		}

		// config.Logger.Info("更新媒体信息", zap.Uint("id", id), zap.String("filename", media.Filename))

		// 检查权限
		if media.UploadedBy != userID {
			return fmt.Errorf("无权限修改此文件, 文件上传者: %d, 当前用户: %d", media.UploadedBy, userID)
		}

		// 检查状态
		if media.Status == "deleted" {
			return fmt.Errorf("文件不存在")
		}

		// 更新信息
		updates := map[string]interface{}{}
		if description != "" {
			updates["description"] = description
		}
		if alt != "" {
			updates["alt"] = alt
		}

		if len(updates) > 0 {
			if err := tx.Model(&media).Updates(updates).Error; err != nil {
				return fmt.Errorf("更新文件信息失败: %v", err)
			}
		}

		// 重新加载数据
		if err := tx.Preload("User").First(&media, id).Error; err != nil {
			return fmt.Errorf("重新加载文件信息失败: %v", err)
		}

		return nil
	})

	if err != nil {
		config.Logger.Error("更新文件信息失败", zap.Uint("id", id), zap.Error(err))
		return nil, err
	}

	config.Logger.Info("文件信息更新成功",
		zap.Uint("id", id),
		zap.String("filename", media.Filename))

	return &media, nil
}
