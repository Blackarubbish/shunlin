package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

const (
	CODE_SUCCESS = 0
	CODE_ERROR   = 1
)

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{Code: CODE_SUCCESS, Message: "success", Data: data})
}

func Error(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{Code: code, Message: message})
}
