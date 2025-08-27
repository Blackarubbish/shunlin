package dto

type PostRequestDto struct {
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content" binding:"required"`
	Slug       string `json:"slug"`
	CategoryID uint   `json:"category_id" binding:"required"`
}

type PostResponseDto struct {
	ID      uint   `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}
