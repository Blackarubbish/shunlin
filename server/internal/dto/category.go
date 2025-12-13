package dto

import (
	"time"
)

type CreateCategoryRequestDto struct {
	Name        string `json:"name" binding:"required,min=1,max=200"`
	Slug        string `json:"slug" binding:"required,slug"`
	Description string `json:"description" binding:"omitempty,min=1,max=300"`
}

type UpdateCategoryRequestDto struct {
	Name        string `json:"name" binding:"min=1,max=200"`
	Slug        string `json:"slug" binding:"min=1,max=200"`
	Description string `json:"description" binding:"min=1,max=300"`
}

type GetOneCategoryResponseDto struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CategoryItem struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	PostCount   int       `json:"postCount"`
}

type GetCategoriesResponseDto struct {
	Items    []CategoryItem `json:"items"`
	Total    int            `json:"total"`
	Page     int            `json:"page"`
	PageSize int            `json:"pageSize"`
}

type GetCategoriesQueryDto struct {
	Page      int    `json:"page" binding:"omitempty,min=1"`
	PageSize  int    `json:"pageSize" binding:"omitempty,min=1,max=100"`
	Name      string `json:"name" binding:"omitempty,min=1,max=200"`
	Slug      string `json:"slug" binding:"omitempty,slug"`
	SortOrder string `json:"sortOrder" binding:"omitempty,oneof=asc desc"` // asc, desc 按创建时间排序
}

type CreateCategoryResponseDto struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type UpdateCategoryResponseDto struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}
