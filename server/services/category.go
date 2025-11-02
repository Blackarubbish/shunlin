package services

import (
	"fmt"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"

	"gorm.io/gorm"
)

func CreateCategory(categoryRequest dto.CategoryRequestDto) (*dto.CategoryResponseDto, error) {
	category := models.Category{
		Name:        categoryRequest.Name,
		Description: categoryRequest.Description,
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("name = ?", category.Name).FirstOrCreate(&category).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("创建分类失败: %v", err)
	}

	return &dto.CategoryResponseDto{
		ID:   category.ID,
		Name: category.Name,
	}, nil
}

func GetOneByNameOrSlug(name string, slug string) (*models.Category, error) {
	var category models.Category
	if err := database.DB.Where("name = ? or slug = ?", name, slug).First(&category).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func GetCategories() ([]models.Category, error) {
	var categories []models.Category
	if err := database.DB.Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func UpdateCategory(id uint, categoryRequest dto.UpdateCategoryRequestDto) (*dto.CategoryResponseDto, error) {
	category := models.Category{
		Name:        categoryRequest.Name,
		Description: categoryRequest.Description,
		Slug:        categoryRequest.Slug,
	}
	if err := database.DB.Model(&models.Category{}).Where("id = ?", id).Updates(category).Error; err != nil {
		return nil, err
	}
	return &dto.CategoryResponseDto{
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
				return fmt.Errorf("分类不存在")
			}
			return err
		}

		// 检查是否有关联的文章
		var postCount int64
		if err := tx.Model(&models.Post{}).Where("category_id = ?", id).Count(&postCount).Error; err != nil {
			return err
		}

		if postCount > 0 {
			return fmt.Errorf("该分类下还有 %d 篇文章，无法删除", postCount)
		}

		// 执行软删除
		if err := tx.Delete(&category).Error; err != nil {
			return err
		}

		return nil
	})
}
