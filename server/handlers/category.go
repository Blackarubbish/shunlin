package handlers

import (
	"net/http"
	"sl-server/dto"
	"sl-server/pkgs/response"
	"sl-server/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var categoryRequest dto.CategoryRequestDto
	if err := c.ShouldBindJSON(&categoryRequest); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	categoryResponse, err := services.CreateCategory(categoryRequest)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	response.Success(c, categoryResponse)
}

func GetCategories(c *gin.Context) {
	categories, err := services.GetCategories()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, categories)
}

func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	var updateCategoryRequest dto.UpdateCategoryRequestDto
	if err := c.ShouldBindJSON(&updateCategoryRequest); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	categoryResponse, err := services.UpdateCategory(uint(idUint), updateCategoryRequest)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, categoryResponse)
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := services.DeleteCategory(uint(idUint)); err != nil {
		response.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(c, nil)
}
