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
)

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{Code: CODE_SUCCESS, Message: "success", Data: data})
}

func Error(c *gin.Context, err error) {
	if customErr, ok := err.(HttpError); ok {
		c.JSON(customErr.HttpStatus, Response{Code: customErr.Code, Message: customErr.Message, Data: customErr.Detail})
	} else {
		c.JSON(http.StatusInternalServerError, Response{Code: 1001, Message: "Internal server error", Data: err.Error()})
	}
}
