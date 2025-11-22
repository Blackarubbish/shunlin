package services

import (
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	resp "sl-server/pkgs/response"

	"sl-server/pkgs/utils"

	"gorm.io/gorm"
)

func CreateCategory(categoryRequest dto.CreateCategoryRequestDto) (*dto.CreateCategoryResponseDto, error) {
	category := models.Category{
		Name:        categoryRequest.Name,
		Description: categoryRequest.Description,
	}

	// 检查slug
	if categoryRequest.Slug != "" {
		category.Slug = utils.FormatSlug(categoryRequest.Slug)
	} else {
		category.Slug = utils.MakeSlug(categoryRequest.Name)
	}

	if err := database.DB.Where("slug = ?", category.Slug).First(&models.Category{}).Error; err == nil {
		return nil, resp.ErrCategorySlugNotUnique.WithDetail(map[string]interface{}{"slug": category.Slug})
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("slug = ?", category.Slug).FirstOrCreate(&category).Error; err != nil {
			return resp.ErrCategoryCreateFailed.WithCause(err.Error())
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &dto.CreateCategoryResponseDto{
		ID:   category.ID,
		Name: category.Name,
		Slug: category.Slug,
	}, nil
}

func GetOneByNameOrSlug(name string, slug string) (*models.Category, error) {
	var category models.Category
	if err := database.DB.Where("name = ? or slug = ?", name, slug).First(&category).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, resp.ErrCategoryNotFound.Error()
		}
		return nil, resp.ErrInternal.WithCause(err.Error())
	}
	return &category, nil
}

func GetCategories(query dto.GetCategoriesQueryDto) (*dto.GetCategoriesResponseDto, error) {
	var categories []models.Category

	// 构建基础查询
	baseQuery := database.DB.Model(&models.Category{})

	// 添加筛选条件
	if query.Name != "" {
		baseQuery = baseQuery.Where("name LIKE ?", "%"+query.Name+"%")
	}
	if query.Slug != "" {
		baseQuery = baseQuery.Where("slug = ?", query.Slug)
	}

	// 获取总数（在分页前）
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, resp.ErrInternal.WithCause(err.Error())
	}

	// 设置默认值
	if query.Page <= 0 {
		query.Page = 1
	}
	if query.PageSize <= 0 {
		query.PageSize = 10
	}
	if query.SortOrder == "" {
		query.SortOrder = "desc"
	}

	// 添加排序
	baseQuery = baseQuery.Order("created_at " + query.SortOrder)

	// 分页查询
	offset := (query.Page - 1) * query.PageSize
	if err := baseQuery.Offset(offset).Limit(query.PageSize).Find(&categories).Error; err != nil {
		return nil, resp.ErrInternal.WithCause(err.Error())
	}

	return &dto.GetCategoriesResponseDto{
		Items:    categories,
		Total:    int(total),
		Page:     query.Page,
		PageSize: query.PageSize,
	}, nil
}

func UpdateCategory(id uint, categoryRequest dto.UpdateCategoryRequestDto) (*dto.UpdateCategoryResponseDto, error) {
	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, resp.ErrCategoryNotFound.WithID(id)
		}
		return nil, resp.ErrInternal.WithCause(err.Error())
	}

	category.Name = categoryRequest.Name
	category.Description = categoryRequest.Description
	category.Slug = categoryRequest.Slug

	if err := database.DB.Save(&category).Error; err != nil {
		return nil, resp.ErrCategoryUpdateFailed.WithCause(err.Error())
	}

	return &dto.UpdateCategoryResponseDto{
		ID:   category.ID,
		Name: category.Name,
	}, nil
}

// DeleteCategory 删除分类（软删除）
func DeleteCategory(id uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		var category models.Category

		// 检查分类是否存在
		if err := tx.First(&category, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return resp.ErrCategoryNotFound.WithID(id)
			}
			return resp.ErrInternal.WithCause(err.Error())
		}

		// 检查是否有关联的文章
		var postCount int64
		if err := tx.Model(&models.Post{}).Where("category_id = ?", id).Count(&postCount).Error; err != nil {
			return resp.ErrInternal.WithCause(err.Error())
		}

		if postCount > 0 {
			return resp.ErrCategoryHasPosts.WithDetail(map[string]interface{}{
				"id":        id,
				"postCount": postCount,
			})
		}

		// 执行软删除
		if err := tx.Delete(&category).Error; err != nil {
			return resp.ErrCategoryDeleteFailed.WithCause(err.Error())
		}

		return nil
	})
}

// GetCategoryByID 根据ID获取单个分类
func GetCategoryByID(id uint) (*dto.GetOneCategoryResponseDto, error) {
	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, resp.ErrCategoryNotFound.WithID(id)
		}
		return nil, resp.ErrInternal.WithCause(err.Error())
	}
	return &dto.GetOneCategoryResponseDto{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
	}, nil
}
