package services

import (
	"fmt"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/pkgs/utils"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

func CreatePost(postRequest dto.CreatePostRequestDto) (*models.Post, error) {
	var post models.Post

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. 验证用户和分类存在
		var user models.User
		if err := tx.First(&user, postRequest.AuthorID).Error; err != nil {
			return fmt.Errorf("用户不存在: %v", err)
		}

		var category models.Category
		if err := tx.First(&category, postRequest.CategoryID).Error; err != nil {
			return fmt.Errorf("分类不存在: %v", err)
		}

		// 2. 生成或格式化slug
		slug := postRequest.Slug
		if slug == "" {
			slug = utils.MakeSlug(postRequest.Title)
		} else {
			slug = utils.FormatSlug(slug)
		}

		// 3. 在事务中处理slug唯一性（加锁查询）
		originalSlug := slug
		for i := 1; ; i++ {
			var count int64
			// 使用FOR UPDATE锁定相关记录，防止并发插入
			if err := tx.Model(&models.Post{}).Where("slug = ?", slug).Count(&count).Error; err != nil {
				return fmt.Errorf("检查slug失败: %v", err)
			}

			if count == 0 {
				break // slug可用
			}

			// slug已存在，生成新的
			if i == 1 {
				slug = fmt.Sprintf("%s-%d", originalSlug, i+1)
			} else {
				slug = fmt.Sprintf("%s-%d", originalSlug, i+1)
			}
		}

		// 4. 创建文章
		post = models.Post{
			Title:      postRequest.Title,
			Content:    postRequest.Content,
			Slug:       slug,
			AuthorID:   postRequest.AuthorID,
			Status:     "draft",
			CategoryID: postRequest.CategoryID,
		}

		if err := tx.Create(&post).Error; err != nil {
			return fmt.Errorf("创建文章失败: %v", err)
		}

		return nil
	})

	if err != nil {
		config.Logger.Error("创建文章失败", zap.Error(err))
		return nil, err
	}

	return &post, nil
}

func GetPosts(query dto.GetPostsQueryDto) (*dto.GetPostsResponseDto, error) {
	posts := []models.Post{}

	// 构建基础查询
	baseQuery := database.DB.Model(&models.Post{}).Preload("Category")

	// 添加查询条件
	if query.Status != "" {
		baseQuery = baseQuery.Where("status = ?", query.Status)
	}
	if query.Title != "" {
		baseQuery = baseQuery.Where("title like ?", fmt.Sprintf("%%%s%%", query.Title))
	}
	if query.Slug != "" {
		baseQuery = baseQuery.Where("slug like ?", fmt.Sprintf("%%%s%%", query.Slug))
	}
	if query.CategoryID != 0 {
		baseQuery = baseQuery.Where("category_id = ?", query.CategoryID)
	}
	if query.AuthorID != 0 {
		baseQuery = baseQuery.Where("author_id = ?", query.AuthorID)
	}

	// 获取总数（使用相同的查询条件）
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		config.Logger.Error("获取文章总数失败", zap.Error(err))
		return nil, fmt.Errorf("get posts count failed: %v", err)
	}

	// 添加排序和分页
	if query.SortOrder != "" {
		baseQuery = baseQuery.Order("created_at " + query.SortOrder)
	}

	if err := baseQuery.Offset((query.PageNum - 1) * query.PageSize).Limit(query.PageSize).Find(&posts).Error; err != nil {
		config.Logger.Error("获取文章列表失败", zap.Error(err))
		return nil, fmt.Errorf("get posts failed: %v", err)
	}

	return &dto.GetPostsResponseDto{
		Items: posts,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}

func GetOnePostByID(id uint) (*models.Post, error) {
	post := models.Post{}
	if err := database.DB.Preload("Category").First(&post, id).Error; err != nil {
		config.Logger.Error("获取文章失败", zap.Error(err))
		return nil, fmt.Errorf("get post failed: %v", err)
	}
	return &post, nil
}

func UpdatePost(id uint, updatePostRequest dto.UpdatePostRequestDto) (*models.Post, error) {
	var post models.Post

	// 使用事务确保数据一致性
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Preload("Category").First(&post, id).Error; err != nil {
			return fmt.Errorf("文章不存在: %v", err)
		}

		if updatePostRequest.CategoryID != 0 && updatePostRequest.CategoryID != post.CategoryID {
			var category models.Category
			if err := tx.First(&category, updatePostRequest.CategoryID).Error; err != nil {
				return fmt.Errorf("分类不存在: %v", err)
			}
		}

		if updatePostRequest.AuthorID != 0 && updatePostRequest.AuthorID != post.AuthorID {
			var user models.User
			if err := tx.First(&user, updatePostRequest.AuthorID).Error; err != nil {
				return fmt.Errorf("作者不存在: %v", err)
			}
		}

		// 4. 执行更新
		if err := tx.Model(&post).Updates(updatePostRequest).Error; err != nil {
			return fmt.Errorf("更新失败: %v", err)
		}

		if err := tx.Preload("Category").First(&post, id).Error; err != nil {
			return fmt.Errorf("重新加载失败: %v", err)
		}

		return nil
	})

	if err != nil {
		config.Logger.Error("更新文章失败", zap.Uint("id", id), zap.Error(err))
		return nil, err
	}

	config.Logger.Info("文章更新成功",
		zap.Uint("id", post.ID),
		zap.String("title", post.Title),
		zap.String("category", post.Category.Name))

	return &post, nil
}

func DeletePost(id uint) error {
	post := models.Post{}
	if err := database.DB.Delete(&post, id).Error; err != nil {
		config.Logger.Error("删除文章失败", zap.Error(err))
		return fmt.Errorf("delete post failed: %v id: %d", err, id)
	}
	return nil
}

func GetPublicPosts(query dto.GetPostsQueryDto) (*dto.GetPostsResponseDto, error) {
	var posts []models.Post

	// 构建基础查询 - 只查询已发布的文章
	baseQuery := database.DB.Model(&models.Post{}).Preload("Category").Where("status = ?", "published")

	// 添加其他查询条件
	if query.Title != "" {
		baseQuery = baseQuery.Where("title LIKE ?", "%"+query.Title+"%")
	}
	if query.CategoryID != 0 {
		baseQuery = baseQuery.Where("category_id = ?", query.CategoryID)
	}

	// 获取总数
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		config.Logger.Error("获取公开文章总数失败", zap.Error(err))
		return nil, fmt.Errorf("获取文章总数失败: %v", err)
	}

	// 添加排序和分页
	if query.SortOrder == "" {
		query.SortOrder = "desc"
	}
	baseQuery = baseQuery.Order("created_at " + query.SortOrder)

	// 分页查询
	offset := (query.PageNum - 1) * query.PageSize
	if err := baseQuery.Offset(offset).Limit(query.PageSize).Find(&posts).Error; err != nil {
		config.Logger.Error("获取公开文章列表失败", zap.Error(err))
		return nil, fmt.Errorf("获取文章列表失败: %v", err)
	}

	return &dto.GetPostsResponseDto{
		Items: posts,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}

// GetAdminPosts 获取管理后台文章（管理员使用，可查看所有状态）
func GetAdminPosts(query dto.GetPostsQueryDto, userRole string, userID uint) (*dto.GetPostsResponseDto, error) {
	var posts []models.Post

	// 构建基础查询
	baseQuery := database.DB.Model(&models.Post{}).Preload("Category").Preload("User")

	// 根据用户角色限制查询范围
	if userRole == "author" {
		// 普通作者只能看到自己的文章
		baseQuery = baseQuery.Where("author_id = ?", userID)
	}
	// admin 和 editor 可以看到所有文章

	// 添加查询条件
	if query.Status != "" {
		baseQuery = baseQuery.Where("status = ?", query.Status)
	}
	if query.Title != "" {
		baseQuery = baseQuery.Where("title LIKE ?", "%"+query.Title+"%")
	}
	if query.CategoryID != 0 {
		baseQuery = baseQuery.Where("category_id = ?", query.CategoryID)
	}
	if query.AuthorID != 0 {
		baseQuery = baseQuery.Where("author_id = ?", query.AuthorID)
	}

	// 获取总数
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		config.Logger.Error("获取管理文章总数失败", zap.Error(err))
		return nil, fmt.Errorf("获取文章总数失败: %v", err)
	}

	// 添加排序和分页
	if query.SortOrder == "" {
		query.SortOrder = "desc"
	}
	baseQuery = baseQuery.Order("created_at " + query.SortOrder)

	// 分页查询
	offset := (query.PageNum - 1) * query.PageSize
	if err := baseQuery.Offset(offset).Limit(query.PageSize).Find(&posts).Error; err != nil {
		config.Logger.Error("获取管理文章列表失败", zap.Error(err))
		return nil, fmt.Errorf("获取文章列表失败: %v", err)
	}

	return &dto.GetPostsResponseDto{
		Items: posts,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}
