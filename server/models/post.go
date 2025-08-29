package models

import (
	"gorm.io/gorm"
)

// 文章表（主入口）
type Post struct {
	gorm.Model
	Title      string   `json:"title" gorm:"not null;size:100"`
	Content    string   `json:"content" gorm:"not null"`
	AuthorID   uint     `json:"author_id" gorm:"not null"`
	Slug       string   `json:"slug" gorm:"not null;unique;size:200"`
	Status     string   `json:"status" gorm:"default:'draft';not null;size:20"`
	CategoryID uint     `json:"category_id" gorm:"not null"`
	Category   Category `gorm:"foreignKey:CategoryID"`
	Tag        string   `json:"tag" gorm:"type:json"`
}
