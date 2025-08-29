package services

import (
	"fmt"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/pkgs/utils"

	"go.uber.org/zap"
)

func CreatePost(postRequest dto.CreatePostRequestDto) (*models.Post, error) {
	// 创建 Post 模型实例
	post := models.Post{
		Title:      postRequest.Title,
		Content:    postRequest.Content,
		Slug:       postRequest.Slug,
		AuthorID:   postRequest.AuthorID,
		Status:     "draft",
		CategoryID: postRequest.CategoryID,
	}

	if err := database.DB.First(&models.User{}, post.AuthorID).Error; err != nil {
		config.Logger.Error("用户不存在", zap.Error(err))
		return nil, fmt.Errorf("user not found: %d %v", post.AuthorID, err)
	}

	if err := database.DB.First(&models.Category{}, post.CategoryID).Error; err != nil {
		config.Logger.Error("分类不存在", zap.Error(err))
		return nil, fmt.Errorf("category not found: %d %v", post.CategoryID, err)
	}

	if post.Slug == "" {
		// 生成 slug
		post.Slug = utils.MakeSlug(post.Title)

		posts := []models.Post{}
		err := database.DB.Where("slug like ?", fmt.Sprintf("%s%%", post.Slug)).Find(&posts).Error
		if err != nil {
			config.Logger.Error("查询文章失败", zap.Error(err))
			return nil, fmt.Errorf("query posts failed: %v", err)
		}

		if len(posts) > 0 {
			post.Slug = fmt.Sprintf("%s-%d", post.Slug, len(posts)+1)
		}
	} else {
		post.Slug = utils.FormatSlug(post.Slug)
	}

	if err := database.DB.Create(&post).Error; err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		return nil, fmt.Errorf("create post failed: %v", err)
	}

	return &post, nil
}

func GetPosts(query dto.GetPostsQueryDto) (*dto.GetPostsResponseDto, error) {
	posts := []models.Post{}
	db := database.DB.Preload("Category")

	if query.Status != "" {
		db = db.Where("status = ?", query.Status)
	}

	if query.Title != "" {
		db = db.Where("title like ?", fmt.Sprintf("%%%s%%", query.Title))
	}

	if query.Slug != "" {
		db = db.Where("slug like ?", fmt.Sprintf("%%%s%%", query.Slug))
	}

	if query.CategoryID != 0 {
		db = db.Where("category_id = ?", query.CategoryID)
	}

	if query.AuthorID != 0 {
		db = db.Where("author_id = ?", query.AuthorID)
	}

	if query.SortOrder != "" {
		db = db.Order("created_at " + query.SortOrder)
	}

	if err := db.Offset((query.PageNum - 1) * query.PageSize).Limit(query.PageSize).Find(&posts).Error; err != nil {
		config.Logger.Error("获取文章列表失败", zap.Error(err))
		return nil, fmt.Errorf("get posts failed: %v", err)
	}

	var total int64
	db.Model(&models.Post{}).Count(&total)

	return &dto.GetPostsResponseDto{
		Items: posts,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}

func GetOnePost(id uint) (*models.Post, error) {
	post := models.Post{}
	if err := database.DB.Preload("Category").First(&post, id).Error; err != nil {
		config.Logger.Error("获取文章失败", zap.Error(err))
		return nil, fmt.Errorf("get post failed: %v", err)
	}
	return &post, nil
}

func UpdatePost(id uint, updatePostRequest dto.UpdatePostRequestDto) (*models.Post, error) {
	post := models.Post{}
	if err := database.DB.First(&post, id).Error; err != nil {
		config.Logger.Error("获取文章失败", zap.Error(err))
		return nil, fmt.Errorf("get post failed: %v", err)
	}

	if err := database.DB.Model(&post).Updates(updatePostRequest).Error; err != nil {
		config.Logger.Error("更新文章失败", zap.Error(err))
		return nil, fmt.Errorf("update post failed: %v", err)
	}

	return &post, nil
}

func DeletePost(id uint) error {
	if err := database.DB.Delete(&models.Post{}, id).Error; err != nil {
		config.Logger.Error("删除文章失败", zap.Error(err))
		return fmt.Errorf("delete post failed: %v", err)
	}
	return nil
}
