package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Title   string `json:"title" gorm:"not null"`
	Content string `json:"content" gorm:"not null"`
	Author  string `json:"author" gorm:"not null"`
}