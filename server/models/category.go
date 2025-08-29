package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string `json:"name" gorm:"not null"`
	Slug        string `json:"slug" gorm:"not null;uniqueIndex"`
	Description string `json:"description"`
	Posts       []Post `gorm:"foreignKey:CategoryID"`
	Status      string `json:"status" gorm:"default:'draft';not null;size:20"`
}
