package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string `json:"name" gorm:"not null"`
	Slug        string `json:"slug" gorm:"not null"`
	Description string `json:"description" gorm:"not null"`
	Posts       []Post `gorm:"foreignKey:CategoryID"`
}
