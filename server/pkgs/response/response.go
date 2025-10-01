package response

import (
	"net/http"
	"strings"

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

type HttpError struct {
	HttpStatus int
	Code       int
	Message    string
	Detail     string
}

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{Code: CODE_SUCCESS, Message: "success", Data: data})
}

func Error(c *gin.Context, code int, message string) {
	var status int
	if code >= 1000 && code < 2000 {
		status = http.StatusBadRequest
	} else if code >= 2000 && code < 3000 {
		status = http.StatusUnauthorized
	} else if code >= 3000 && code < 4000 {
		status = http.StatusForbidden
	} else if code >= 4000 && code < 5000 {
		status = http.StatusInternalServerError
	} else if code >= 5000 && code < 6000 {
		status = http.StatusServiceUnavailable
	} else {
		status = http.StatusOK
	}
	c.JSON(status, HttpError{HttpStatus: status, Code: code, Message: message})
}

func ErrorWithDetail(c *gin.Context, err HttpError, detail ...string) {
	err.Detail = strings.Join(detail, ", ")
	c.JSON(err.HttpStatus, err)
}

var (

	// 1xxx - 通用错误
	ErrInternal  = HttpError{HttpStatus: http.StatusInternalServerError, Code: 1001, Message: "内部服务器错误"}
	ErrNotFound  = HttpError{HttpStatus: http.StatusNotFound, Code: 1002, Message: "资源不存在"}
	ErrForbidden = HttpError{HttpStatus: http.StatusForbidden, Code: 1003, Message: "权限不足"}

	// 2xxx - 请求参数错误
	ErrValidation = HttpError{HttpStatus: http.StatusBadRequest, Code: 2000, Message: "参数校验错误"}

	// 3xxx - 认证授权错误
	ErrUnauthorized           = HttpError{HttpStatus: http.StatusUnauthorized, Code: 3000, Message: "未认证"}
	ErrTokenExpired           = HttpError{HttpStatus: http.StatusUnauthorized, Code: 3001, Message: "Token过期"}
	ErrTokenInvalid           = HttpError{HttpStatus: http.StatusUnauthorized, Code: 3002, Message: "Token无效"}
	ErrInsufficientPermission = HttpError{HttpStatus: http.StatusForbidden, Code: 3003, Message: "权限不足"}

	// 4xxx - 业务逻辑错误
	ErrUserOrPasswordWrong = HttpError{HttpStatus: http.StatusNotFound, Code: 4001, Message: "用户名或密码错误"}
	ErrUserExists          = HttpError{HttpStatus: http.StatusConflict, Code: 4002, Message: "用户已存在"}
	ErrAccountDisabled     = HttpError{HttpStatus: http.StatusForbidden, Code: 4003, Message: "账户被禁用"}

	// 5xxx - 外部服务错误
	ErrDatabaseError   = HttpError{HttpStatus: http.StatusInternalServerError, Code: 5001, Message: "数据库错误"}
	ErrRedisError      = HttpError{HttpStatus: http.StatusInternalServerError, Code: 5002, Message: "Redis错误"}
	ErrThirdPartyError = HttpError{HttpStatus: http.StatusInternalServerError, Code: 5003, Message: "第三方服务错误"}
)
