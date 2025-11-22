package models

// 文章表（主入口）
type Post struct {
	BaseModel
	Title      string   `json:"title" gorm:"not null;size:100"`
	Content    string   `json:"content" gorm:"not null"`
	AuthorID   uint     `json:"author_id" gorm:"not null"`
	Slug       string   `json:"slug" gorm:"not null;unique;size:200"`
	Status     int      `json:"status" gorm:"default:0;not null;type:int;comment:'状态: 0=草稿 1=已发布'"`
	CategoryID uint     `json:"category_id" gorm:"not null"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`
	Tag        string   `json:"tag" gorm:"type:json"`
}

// 文章状态常量
const (
	PostStatusDraft     = 0 // 草稿
	PostStatusPublished = 1 // 已发布
	PostStatusArchived  = 2 // 已归档
)
