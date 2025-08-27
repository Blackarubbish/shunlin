package models

import (
	"gorm.io/gorm"
)

// 文章表（主入口）
type Post struct {
	gorm.Model
	Title      string   `json:"title" gorm:"not null"`
	Content    string   `json:"content" gorm:"not null"`
	Author     string   `json:"author" gorm:"not null"`
	Slug       string   `json:"slug" gorm:"not null;unique"`
	Status     string   `json:"status" gorm:"default:'draft';not null"`
	CategoryID uint     `json:"category_id" gorm:"not null"`
	Category   Category `gorm:"foreignKey:CategoryID"`
}
