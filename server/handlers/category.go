package handlers

import (
	"net/http"
	"sl-server/dto"
	"sl-server/services"
	"sl-server/pkgs/response"

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

