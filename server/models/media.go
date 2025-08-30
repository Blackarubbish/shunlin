package models

import "gorm.io/gorm"

type Media struct {
	gorm.Model
	OriginalName string `json:"original_name" gorm:"not null"`          // 原始文件名
	Filename     string `json:"filename" gorm:"not null;unique"`        // 存储的文件名（重命名后）
	Filepath     string `json:"filepath" gorm:"not null"`               // 文件路径
	FileURL      string `json:"file_url" gorm:"not null"`               // 访问URL
	Filetype     string `json:"filetype" gorm:"not null;size:50"`       // 文件类型
	MimeType     string `json:"mime_type" gorm:"not null;size:100"`     // MIME类型
	Filesize     int64  `json:"filesize" gorm:"not null"`               // 文件大小（字节）
	Extension    string `json:"extension" gorm:"not null;size:10"`      // 文件扩展名
	UploadedBy   uint   `json:"uploaded_by" gorm:"not null"`            // 上传者ID
	Status       string `json:"status" gorm:"default:'active';size:20"` // 状态：active, deleted
	Description  string `json:"description"`                            // 文件描述
	Alt          string `json:"alt"`                                    // 图片alt文本
	Hash         string `json:"hash" gorm:"not null"`                   // 文件hash

	// 关联
	User User `gorm:"foreignKey:UploadedBy"`
}
