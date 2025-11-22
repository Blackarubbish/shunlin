package models

type Category struct {
	BaseModel
	Name        string `json:"name" gorm:"not null"`
	Description string `json:"description"`
	Slug        string `json:"slug" gorm:"not null;unique;size:200;default:''"`
}
