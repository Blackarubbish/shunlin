package dto

import "sl-server/models"

type CategoryRequestDto struct {
	Name        string `json:"name" binding:"required,min=1,max=200"`
	Slug        string `json:"slug" binding:"required,slug"`
	Description string `json:"description" binding:"required,min=1,max=300"`
}

type UpdateCategoryRequestDto struct {
	Name        string `json:"name" binding:"min=1,max=200"`
	Slug        string `json:"slug" binding:"min=1,max=200"`
	Description string `json:"description" binding:"min=1,max=300"`
}

type GetCategoriesResponseDto struct {
	Items []models.Category `json:"items"`
	Total int               `json:"total"`
	Page  int               `json:"page"`
	Size  int               `json:"size"`
}

type GetCategoriesQueryDto struct {
	Page int    `json:"page" binding:"omitempty,min=1"`
	Size int    `json:"size" binding:"omitempty,min=1,max=100"`
	Name string `json:"name" binding:"omitempty,min=1,max=200"`
	Slug string `json:"slug" binding:"omitempty,slug"`
}

type CategoryResponseDto struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}
