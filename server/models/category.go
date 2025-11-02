package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description"`
	Slug        string `json:"slug" gorm:"not null;unique;size:200;default:''"`
}
