package dto

import "sl-server/models"

type CreatePostRequestDto struct {
	Title      string `json:"title" binding:"required,min=1,max=200"`
	Content    string `json:"content" binding:"required"`
	Slug       string `json:"slug"`
	CategoryID uint   `json:"categoryID" binding:"required"`
}

type CreatePostResponseDto struct {
	ID      uint   `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Slug    string `json:"slug"`
}

type GetPostsQueryDto struct {
	Slug       string `form:"slug"`
	Title      string `form:"title"`
	CategoryID uint   `form:"categoryID" binding:"omitempty,min=1"`
	AuthorID   uint   `form:"authorID" binding:"omitempty,min=1"`
	PageNum    int    `form:"pageNum" binding:"omitempty,min=1"`
	PageSize   int    `form:"pageSize" binding:"omitempty,min=1,max=100"`
	Status     string `form:"status" binding:"omitempty,oneof=draft published"`
	SortOrder  string `form:"sortOrder" binding:"omitempty,oneof=asc desc"`
}

// 验证并设置默认值
func (q *GetPostsQueryDto) Normalize() {
	if q.PageNum <= 0 {
		q.PageNum = 1
	}
	if q.PageSize <= 0 {
		q.PageSize = 10
	}
	if q.SortOrder == "" {
		q.SortOrder = "desc"
	}
}

type GetPostsResponseDto struct {
	Items []models.Post `json:"items"`
	Total int           `json:"total"`
	Page  int           `json:"page"`
	Size  int           `json:"size"`
}

type UpdatePostRequestDto struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	Slug       string `json:"slug"`
	CategoryID uint   `json:"categoryID"`
	AuthorID   uint   `json:"authorID"`
	Status     string `json:"status"`
}
