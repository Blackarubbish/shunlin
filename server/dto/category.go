package dto

type CategoryRequestDto struct {
	Name        string `json:"name" binding:"required,min=1,max=200"`
	Slug        string `json:"slug"`
	Description string `json:"description" binding:"required,min=1,max=300"`
}

type CategoryResponseDto struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}
