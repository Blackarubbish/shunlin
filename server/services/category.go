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
