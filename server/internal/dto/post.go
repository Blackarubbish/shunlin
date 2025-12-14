package dto

import (
	"time"
)

type PostStatus int

const (
	PostStatusDraft PostStatus = iota
	PostStatusPublished
)

type PostCategoryInfo struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type CreatePostRequestDto struct {
	Title      string `json:"title" binding:"required,min=1,max=200"`
	Content    string `json:"content" binding:"required"`
	Slug       string `json:"slug"`
	CategoryID uint   `json:"categoryID" binding:"required"`
}

type CreatePostResponseDto struct {
	ID       uint             `json:"id"`
	Title    string           `json:"title"`
	Content  string           `json:"content"`
	Slug     string           `json:"slug"`
	AuthorID uint             `json:"authorID"`
	Category PostCategoryInfo `json:"category"`
}

type GetPostsQueryDto struct {
	Slug       string     `form:"slug"`
	Title      string     `form:"title"`
	CategoryID uint       `form:"categoryID" binding:"omitempty,min=1"`
	AuthorID   uint       `form:"authorID" binding:"omitempty,min=1"`
	PageNum    int        `form:"pageNum" binding:"omitempty,min=1"`
	PageSize   int        `form:"pageSize" binding:"omitempty,min=1,max=100"`
	Status     PostStatus `form:"status" binding:"omitempty,oneof=0 1"`
	SortOrder  string     `form:"sortOrder" binding:"omitempty,oneof=asc desc"`
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

// PostListItemDto 文章列表项（不包含完整内容）
type PostListItemDto struct {
	ID         uint             `json:"id"`
	CreatedAt  time.Time        `json:"createdAt"`
	UpdatedAt  time.Time        `json:"updatedAt"`
	Title      string           `json:"title"`
	Slug       string           `json:"slug"`
	Status     PostStatus       `json:"status"`
	AuthorID   uint             `json:"authorID"`
	CategoryID uint             `json:"categoryID"`
	Category   PostCategoryInfo `json:"category"`
	Tag        string           `json:"tag"`
}

type GetPostsResponseDto struct {
	Items []PostListItemDto `json:"items"`
	Total int               `json:"total"`
	Page  int               `json:"page"`
	Size  int               `json:"size"`
}

type UpdatePostRequestDto struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	Slug       string `json:"slug"`
	CategoryID uint   `json:"categoryID"`
	AuthorID   uint   `json:"authorID"`
	Status     int    `json:"status"` // 0=草稿 1=已发布
}

type GetOnePostResponseDto struct {
	ID         uint             `json:"id"`
	CreatedAt  time.Time        `json:"createdAt"`
	UpdatedAt  time.Time        `json:"updatedAt"`
	Title      string           `json:"title"`
	Slug       string           `json:"slug"`
	Status     PostStatus       `json:"status"`
	AuthorID   uint             `json:"authorID"`
	CategoryID uint             `json:"categoryID"`
	Category   PostCategoryInfo `json:"category"`
	Content    string           `json:"content"`
}

type UpdatePostResponseDto struct {
	ID         uint             `json:"id"`
	CreatedAt  time.Time        `json:"createdAt"`
	UpdatedAt  time.Time        `json:"updatedAt"`
	Title      string           `json:"title"`
	Slug       string           `json:"slug"`
	Status     PostStatus       `json:"status"`
	AuthorID   uint             `json:"authorID"`
	CategoryID uint             `json:"categoryID"`
	Category   PostCategoryInfo `json:"category"`
	Content    string           `json:"content"`
}
