package models

import (
	"time"

	"gorm.io/gorm"
)

// BaseModel 替代 gorm.Model，自定义 JSON 序列化字段名为小写
type BaseModel struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
