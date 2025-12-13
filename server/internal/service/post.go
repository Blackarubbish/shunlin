package service

import (
	"fmt"
	"sl-server/internal/config"
	"sl-server/internal/repository"
	"sl-server/internal/dto"
	"sl-server/internal/model"
	resp "sl-server/pkg/response"
	"sl-server/pkg/utils"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func CreatePost(c *gin.Context, postRequest dto.CreatePostRequestDto) (*dto.CreatePostResponseDto, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return nil, resp.ErrInternal.WithCause("user_id not found")
	}

	var post model.Post

	err := repository.DB.Transaction(func(tx *gorm.DB) error {
		// 1. 验证用户和分类存在
		var user model.User
		if err := tx.First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return resp.ErrUserNotFound.WithID(userID)
			}
			return resp.ErrInternal.WithCause(err.Error())
		}

		var category model.Category
		if err := tx.First(&category, postRequest.CategoryID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return resp.ErrCategoryNotFound.WithID(postRequest.CategoryID)
			}
			return resp.ErrInternal.WithCause(err.Error())
		}
		// 2. 生成或格式化slug
		slug := postRequest.Slug
		if slug == "" {
			slug = utils.MakeSlug(postRequest.Title)
		} else {
			slug = utils.FormatSlug(slug)
		}

		// 3. 检查slug是否唯一
		if err := tx.Where("slug = ?", slug).First(&model.Post{}).Error; err == nil {
			return resp.ErrPostSlugNotUnique.WithDetail(map[string]interface{}{"slug": slug})
		}

		// 4. 创建文章
		post = model.Post{
			Title:      postRequest.Title,
			Content:    postRequest.Content,
			Slug:       slug,
			AuthorID:   uint(userID.(uint)),
			Status:     model.PostStatusDraft,
			CategoryID: uint(postRequest.CategoryID),
		}

		if err := tx.Create(&post).Error; err != nil {
			return resp.ErrCreatePostFailed.WithCause(err.Error())
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &dto.CreatePostResponseDto{
		ID:       post.ID,
		Title:    post.Title,
		Content:  post.Content,
		Slug:     post.Slug,
		AuthorID: post.AuthorID,
		Category: post.Category,
	}, nil
}

func GetPosts(query dto.GetPostsQueryDto) (*dto.GetPostsResponseDto, error) {
	var posts []model.Post

	// 构建基础查询 - 排除 content 字段以提高性能
	baseQuery := repository.DB.Model(&model.Post{}).Preload("Category")

	// 添加查询条件
	if query.Status != 0 {
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
		config.Logger.Error("get posts count failed", zap.Error(err))
		return nil, resp.ErrGetPostsCountFailed.WithCause(err.Error())
	}

	// 添加排序和分页
	if query.SortOrder != "" {
		baseQuery = baseQuery.Order("created_at " + query.SortOrder)
	}

	if err := baseQuery.Offset((query.PageNum - 1) * query.PageSize).Limit(query.PageSize).Find(&posts).Error; err != nil {
		config.Logger.Error("get posts data failed", zap.Error(err))
		return nil, resp.ErrGetPostsFailed.WithCause(err.Error())
	}

	// 转换为 DTO
	items := make([]dto.PostListItemDto, len(posts))
	for i, post := range posts {
		items[i] = dto.PostListItemDto{
			ID:         post.ID,
			CreatedAt:  post.CreatedAt,
			UpdatedAt:  post.UpdatedAt,
			Title:      post.Title,
			Slug:       post.Slug,
			Status:     post.Status,
			AuthorID:   post.AuthorID,
			CategoryID: post.CategoryID,
			Category:   post.Category,
			Tag:        post.Tag,
		}
	}

	return &dto.GetPostsResponseDto{
		Items: items,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}

func GetOnePostByID(id uint) (*dto.GetOnePostResponseDto, error) {
	post := model.Post{}
	if err := repository.DB.Preload("Category").First(&post, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, resp.ErrPostNotFound.WithID(id)
		}
		config.Logger.Error("获取文章失败", zap.Error(err))
		return nil, resp.ErrInternal.WithCause(err.Error())
	}
	return &dto.GetOnePostResponseDto{
		ID:         post.ID,
		CreatedAt:  post.CreatedAt,
		UpdatedAt:  post.UpdatedAt,
		Title:      post.Title,
		Slug:       post.Slug,
		Status:     post.Status,
		AuthorID:   post.AuthorID,
		CategoryID: post.CategoryID,
		Category:   post.Category,
		Content:    post.Content,
	}, nil
}

func UpdatePost(id uint, updatePostRequest dto.UpdatePostRequestDto) (*dto.UpdatePostResponseDto, error) {
	var post model.Post

	// 使用事务确保数据一致性
	err := repository.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Preload("Category").First(&post, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return resp.ErrPostNotFound.WithID(id)
			}
			return resp.ErrInternal.WithCause(err.Error())
		}

		if updatePostRequest.CategoryID != 0 && updatePostRequest.CategoryID != post.CategoryID {
			var category model.Category
			if err := tx.First(&category, updatePostRequest.CategoryID).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					return resp.ErrCategoryNotFound.WithID(updatePostRequest.CategoryID)
				}
				return resp.ErrInternal.WithCause(err.Error())
			}
		}

		if updatePostRequest.AuthorID != 0 && updatePostRequest.AuthorID != post.AuthorID {
			var user model.User
			if err := tx.First(&user, updatePostRequest.AuthorID).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					return resp.ErrUserNotFound.WithID(updatePostRequest.AuthorID)
				}
				return resp.ErrInternal.WithCause(err.Error())
			}
		}

		// 4. 执行更新
		if err := tx.Model(&post).Updates(updatePostRequest).Error; err != nil {
			return resp.ErrUpdatePostFailed.WithCause(err.Error())
		}

		if err := tx.Preload("Category").First(&post, id).Error; err != nil {
			return resp.ErrInternal.WithCause(err.Error())
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

	return &dto.UpdatePostResponseDto{
		ID:         post.ID,
		CreatedAt:  post.CreatedAt,
		UpdatedAt:  post.UpdatedAt,
		Title:      post.Title,
		Slug:       post.Slug,
		Status:     post.Status,
		AuthorID:   post.AuthorID,
		CategoryID: post.CategoryID,
		Category:   post.Category,
		Content:    post.Content,
	}, nil
}

func DeletePost(id uint) error {
	post := model.Post{}
	if err := repository.DB.First(&post, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return resp.ErrPostNotFound.WithID(id)
		}
		config.Logger.Error("查询文章失败", zap.Error(err))
		return resp.ErrInternal.WithCause(err.Error())
	}

	if err := repository.DB.Delete(&post, id).Error; err != nil {
		config.Logger.Error("删除文章失败", zap.Error(err))
		return resp.ErrDeletePostFailed.WithCause(err.Error())
	}
	return nil
}

func GetPublicPosts(query dto.GetPostsQueryDto) (*dto.GetPostsResponseDto, error) {
	var posts []model.Post

	// 构建基础查询 - 只查询已发布的文章，排除 content 字段
	baseQuery := repository.DB.Model(&model.Post{}).
		Select("id", "created_at", "updated_at", "deleted_at", "title", "slug", "status", "author_id", "category_id", "tag").
		Preload("Category").
		Where("status = ?", model.PostStatusPublished)

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
		return nil, resp.ErrGetPostsCountFailed.WithCause(err.Error())
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
		return nil, resp.ErrGetPostsFailed.WithCause(err.Error())
	}

	// 转换为 DTO
	items := make([]dto.PostListItemDto, len(posts))
	for i, post := range posts {
		items[i] = dto.PostListItemDto{
			ID:         post.ID,
			CreatedAt:  post.CreatedAt,
			UpdatedAt:  post.UpdatedAt,
			Title:      post.Title,
			Slug:       post.Slug,
			Status:     post.Status,
			AuthorID:   post.AuthorID,
			CategoryID: post.CategoryID,
			Category:   post.Category,
			Tag:        post.Tag,
		}
	}

	return &dto.GetPostsResponseDto{
		Items: items,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}

// GetAdminPosts 获取管理后台文章（管理员使用，可查看所有状态）
func GetAdminPosts(query dto.GetPostsQueryDto, userRole string, userID uint) (*dto.GetPostsResponseDto, error) {
	var posts []model.Post

	// 构建基础查询 - 排除 content 字段
	baseQuery := repository.DB.Model(&model.Post{}).
		Select("id", "created_at", "updated_at", "deleted_at", "title", "slug", "status", "author_id", "category_id", "tag").
		Preload("Category")

	// 根据用户角色限制查询范围
	if userRole == "author" {
		// 普通作者只能看到自己的文章
		baseQuery = baseQuery.Where("author_id = ?", userID)
	}
	// admin 和 editor 可以看到所有文章

	// 添加查询条件
	if query.Status != 0 {
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
		return nil, resp.ErrGetPostsCountFailed.WithCause(err.Error())
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
		return nil, resp.ErrGetPostsFailed.WithCause(err.Error())
	}

	// 转换为 DTO
	items := make([]dto.PostListItemDto, len(posts))
	for i, post := range posts {
		items[i] = dto.PostListItemDto{
			ID:         post.ID,
			CreatedAt:  post.CreatedAt,
			UpdatedAt:  post.UpdatedAt,
			Title:      post.Title,
			Slug:       post.Slug,
			Status:     post.Status,
			AuthorID:   post.AuthorID,
			CategoryID: post.CategoryID,
			Category:   post.Category,
			Tag:        post.Tag,
		}
	}

	return &dto.GetPostsResponseDto{
		Items: items,
		Total: int(total),
		Page:  query.PageNum,
		Size:  query.PageSize,
	}, nil
}
