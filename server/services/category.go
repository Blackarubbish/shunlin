package services

import (
	"fmt"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"

	"github.com/gosimple/slug"
)

func CreateCategory(categoryRequest dto.CategoryRequestDto) (*dto.CategoryResponseDto, error) {
	category := models.Category{
		Name:        categoryRequest.Name,
		Slug:        categoryRequest.Slug,
		Description: categoryRequest.Description,
	}

	if category.Slug == "" {
		category.Slug = slug.Make(category.Name)
		suffix := 1
		for {
			if err := database.DB.Where("slug like ?", fmt.Sprintf("%s%%", category.Slug)).First(&models.Category{}).Error; err != nil {
				break
			}
			category.Slug = fmt.Sprintf("%s-%d", category.Slug, suffix)
			suffix++
		}
	}

	if err := database.DB.Where("name = ?", category.Name).FirstOrCreate(&category).Error; err != nil {
		return nil, err
	}

	return &dto.CategoryResponseDto{
		ID:   category.ID,
		Name: category.Name,
		Slug: category.Slug,
	}, nil
}

func GetOneByNameOrSlug(name string, slug string) (*models.Category, error) {
	var category models.Category
	if err := database.DB.Where("name = ? or slug = ?", name, slug).First(&category).Error; err != nil {
		return nil, err
	}
	return &category, nil
}
