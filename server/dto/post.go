package dto

import "sl-server/models"

type PostRequestDto struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type PostResponseDto struct {
	ID      uint   `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func ToPostResponseDto(post models.Post) PostResponseDto {
	return PostResponseDto{
		ID:      post.ID,
		Title:   post.Title,
		Content: post.Content,
	}
}