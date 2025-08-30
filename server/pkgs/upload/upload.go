package upload

import (
	"crypto/md5"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// 文件类型配置
var (
	// 允许的文件类型
	AllowedImageTypes = []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
	AllowedVideoTypes = []string{".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"}
	AllowedDocTypes   = []string{".pdf", ".doc", ".docx", ".txt", ".md"}
	AllowedAudioTypes = []string{".mp3", ".wav", ".flac", ".aac"}

	// 文件大小限制（字节）
	MaxImageSize = int64(5 * 1024 * 1024)   // 5MB
	MaxVideoSize = int64(100 * 1024 * 1024) // 100MB
	MaxDocSize   = int64(10 * 1024 * 1024)  // 10MB
	MaxAudioSize = int64(20 * 1024 * 1024)  // 20MB
)

type FileInfo struct {
	OriginalName string
	Filename     string
	Filepath     string
	FileURL      string
	Extension    string
	Filetype     string
	MimeType     string
	Filesize     int64
}

func ValidateFileType(filename string) (string, error) {
	ext := strings.ToLower(filepath.Ext(filename))

	// 检查图片
	for _, allowedExt := range AllowedImageTypes {
		if ext == allowedExt {
			return "image", nil
		}
	}

	// 检查视频
	for _, allowedExt := range AllowedVideoTypes {
		if ext == allowedExt {
			return "video", nil
		}
	}

	// 检查文档
	for _, allowedExt := range AllowedDocTypes {
		if ext == allowedExt {
			return "document", nil
		}
	}

	// 检查音频
	for _, allowedExt := range AllowedAudioTypes {
		if ext == allowedExt {
			return "audio", nil
		}
	}

	return "", fmt.Errorf("不支持的文件类型: %s", ext)
}

func ValidateFileSize(filesize int64, filetype string) error {
	switch filetype {
	case "image":
		if filesize > MaxImageSize {
			return fmt.Errorf("图片文件大小不能超过 %d MB", MaxImageSize/(1024*1024))
		}
	case "video":
		if filesize > MaxVideoSize {
			return fmt.Errorf("视频文件大小不能超过 %d MB", MaxVideoSize/(1024*1024))
		}
	case "document":
		if filesize > MaxDocSize {
			return fmt.Errorf("文档文件大小不能超过 %d MB", MaxDocSize/(1024*1024))
		}
	case "audio":
		if filesize > MaxAudioSize {
			return fmt.Errorf("音频文件大小不能超过 %d MB", MaxAudioSize/(1024*1024))
		}
	}
	return nil
}

func GenerateUniqueFilename(originalName string) string {
	ext := filepath.Ext(originalName)
	nameWithoutExt := strings.TrimSuffix(originalName, ext)

	// 使用时间戳 + MD5 生成唯一文件名
	timestamp := time.Now().Unix()
	hash := md5.Sum([]byte(fmt.Sprintf("%s_%d", nameWithoutExt, timestamp)))

	return fmt.Sprintf("%x%s", hash, ext)
}

func EnsureDir(dirPath string) error {
	return os.MkdirAll(dirPath, 0755)
}

// SaveFile 保存文件
func SaveFile(file *multipart.FileHeader, savePath string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// 确保目录存在
	if err := EnsureDir(filepath.Dir(savePath)); err != nil {
		return err
	}

	dst, err := os.Create(savePath)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	return err
}

// GenerateFilePath 按日期组织文件路径
func GenerateFilePath(uploadPath, filename, filetype string) (string, string) {
	now := time.Now()
	dateDir := fmt.Sprintf("%d/%02d/%02d", now.Year(), now.Month(), now.Day())

	// 按类型分目录
	typeDir := filepath.Join(filetype, dateDir)
	fullDir := filepath.Join(uploadPath, typeDir)
	fullPath := filepath.Join(fullDir, filename)

	return fullPath, typeDir
}

// GetMimeType 根据文件扩展名获取MIME类型
func GetMimeType(extension string) string {
	mimeTypes := map[string]string{
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".png":  "image/png",
		".gif":  "image/gif",
		".webp": "image/webp",
		".svg":  "image/svg+xml",
		".mp4":  "video/mp4",
		".avi":  "video/x-msvideo",
		".mov":  "video/quicktime",
		".wmv":  "video/x-ms-wmv",
		".flv":  "video/x-flv",
		".webm": "video/webm",
		".pdf":  "application/pdf",
		".doc":  "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".txt":  "text/plain",
		".md":   "text/markdown",
		".mp3":  "audio/mpeg",
		".wav":  "audio/wav",
		".flac": "audio/flac",
		".aac":  "audio/aac",
	}

	if mimeType, exists := mimeTypes[strings.ToLower(extension)]; exists {
		return mimeType
	}
	return "application/octet-stream"
}
