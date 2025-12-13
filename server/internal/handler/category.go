package handler

import (
	"sl-server/internal/config"
	"sl-server/internal/dto"
	"sl-server/pkg/response"
	"sl-server/pkg/validate"
	"sl-server/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

func CreateCategory(c *gin.Context) {
	var categoryRequest dto.CreateCategoryRequestDto
	if err := c.ShouldBindJSON(&categoryRequest); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			config.Logger.Warn("create category validation failed", zap.Error(err))
			response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": validate.FormatValidationError(err)}))
			return
		}
		config.Logger.Warn("create category data binding failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}

	categoryResponse, err := service.CreateCategory(categoryRequest)
	if err != nil {
		config.Logger.Error("create category failed", zap.Error(err))
		response.Error(c, err)
		return
	}

	config.Logger.Info("category created successfully", zap.Uint("id", categoryResponse.ID))
	response.Success(c, categoryResponse)
}

func GetCategories(c *gin.Context) {
	var query dto.GetCategoriesQueryDto
	if err := c.ShouldBindQuery(&query); err != nil {
		config.Logger.Warn("get categories validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	categories, err := service.GetCategories(query)
	if err != nil {
		config.Logger.Error("get categories failed", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, categories)
}

func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("update category validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	var updateCategoryRequest dto.UpdateCategoryRequestDto
	if err := c.ShouldBindJSON(&updateCategoryRequest); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			config.Logger.Warn("update category validation failed", zap.Error(err))
			response.Error(c, response.ErrValidation.WithDetail(map[string]interface{}{"cause": validate.FormatValidationError(err)}))
			return
		}
		config.Logger.Warn("update category data binding failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	categoryResponse, err := service.UpdateCategory(uint(idUint), updateCategoryRequest)
	if err != nil {
		config.Logger.Error("update category failed", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, categoryResponse)
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("delete category validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	if err := service.DeleteCategory(uint(idUint)); err != nil {
		config.Logger.Error("delete category failed", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, nil)
}

func GetCategoryByID(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		config.Logger.Warn("get category by id validation failed", zap.Error(err))
		response.Error(c, response.ErrValidation.WithCause(err.Error()))
		return
	}
	category, err := service.GetCategoryByID(uint(idUint))
	if err != nil {
		config.Logger.Error("get category by id failed", zap.Error(err))
		response.Error(c, err)
		return
	}
	response.Success(c, category)
}
