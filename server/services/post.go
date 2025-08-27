package services

import (
	"fmt"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"

	"github.com/gosimple/slug"
	"go.uber.org/zap"
)

func CreatePost(postRequest dto.PostRequestDto) (*dto.PostResponseDto, error) {
	// 创建 Post 模型实例
	post := models.Post{
		Title:      postRequest.Title,
		Content:    postRequest.Content,
		Slug:       postRequest.Slug,
		Author:     "default", // 可以从用户上下文中获取
		Status:     "draft",
		CategoryID: postRequest.CategoryID,
	}

	if err := database.DB.First(&models.Category{}, post.CategoryID).Error; err != nil {
		config.Logger.Error("分类不存在", zap.Error(err))
		return nil, fmt.Errorf("category not found: %d %v", post.CategoryID, err)
	}

	if post.Slug == "" {
		// 生成 slug
		post.Slug = slug.Make(post.Title)
		// 检查 slug 是否唯一,如果存在则添加后缀
		suffix := 1
		for {
			if err := database.DB.Where("slug like ?", fmt.Sprintf("%s%%", post.Slug)).First(&models.Post{}).Error; err != nil {
				break
			}
			post.Slug = fmt.Sprintf("%s-%d", post.Slug, suffix)
			suffix++
		}
	}

	if err := database.DB.Create(&post).Error; err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		return nil, fmt.Errorf("create post failed: %v", err)
	}

	// 创建响应 DTO
	postResponse := dto.PostResponseDto{
		ID:      post.ID,
		Title:   post.Title,
		Content: post.Content,
	}

	return &postResponse, nil
}
