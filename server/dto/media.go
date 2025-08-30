package dto

import "sl-server/models"

type UploadResponseDto struct {
	ID           uint   `json:"id"`
	OriginalName string `json:"original_name"`
	Filename     string `json:"filename"`
	FileURL      string `json:"file_url"`
	Filetype     string `json:"filetype"`
	Filesize     int64  `json:"filesize"`
	Extension    string `json:"extension"`
	UploadedAt   string `json:"uploaded_at"`
}

type MediaQueryDto struct {
	Filetype   string `form:"filetype" binding:"omitempty,oneof=image video document audio"`
	Page       int    `form:"page" binding:"omitempty,min=1"`
	PageSize   int    `form:"pageSize" binding:"omitempty,min=1,max=100"`
	UploadedBy uint   `form:"uploadedBy" binding:"omitempty,min=1"`
}

func (q *MediaQueryDto) Normalize() {
	if q.Page <= 0 {
		q.Page = 1
	}
	if q.PageSize <= 0 {
		q.PageSize = 20
	}
}

type MediaListResponseDto struct {
	Items []models.Media `json:"items"`
	Total int            `json:"total"`
	Page  int            `json:"page"`
	Size  int            `json:"size"`
}

type BatchUploadResponseDto struct {
	SuccessCount int                 `json:"success_count"`
	ErrorCount   int                 `json:"error_count"`
	Results      []UploadResponseDto `json:"results"`
	Errors       []string            `json:"errors,omitempty"`
}
