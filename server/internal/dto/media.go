package dto

type UploadResponseDto struct {
	ID           uint   `json:"id"`
	OriginalName string `json:"originalName"`
	Filename     string `json:"filename"`
	FileURL      string `json:"fileURL"`
	Filetype     string `json:"filetype"`
	Filesize     int64  `json:"filesize"`
	Extension    string `json:"extension"`
	UploadedAt   string `json:"uploadedAt"`
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

type MediaItemDto struct {
	ID           uint   `json:"id"`
	OriginalName string `json:"originalName"`
	Filename     string `json:"filename"`
	FileURL      string `json:"fileURL"`
	Filetype     string `json:"filetype"`
	Filesize     int64  `json:"filesize"`
	Extension    string `json:"extension"`
	UploadedAt   string `json:"uploadedAt"`
}

type MediaListResponseDto struct {
	Items []MediaItemDto `json:"items"`
	Total int            `json:"total"`
	Page  int            `json:"page"`
	Size  int            `json:"size"`
}

type BatchUploadResponseDto struct {
	SuccessCount int                 `json:"successCount"`
	ErrorCount   int                 `json:"errorCount"`
	Results      []UploadResponseDto `json:"results"`
	Errors       []string            `json:"errors,omitempty"`
}
