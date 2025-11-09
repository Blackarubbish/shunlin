package response

import "net/http"

type HttpError struct {
	HttpStatus int
	Code       int
	Message    string
	Detail     map[string]interface{}
}

func (e HttpError) Error() string {
	return e.Message
}

// 错误代码常量 - 统一管理代码范围
const (
	// 业务错误代码范围
	CodeCategoryBase = 10000 // 分类错误: 10001-10099
	CodePostBase     = 20000 // 文章错误: 20001-20099
	CodeMediaBase    = 30000 // 媒体错误: 30001-30099
	CodeUserBase     = 40000 // 用户错误: 40001-40099

	// 通用错误代码范围
	CodeCommonBase     = 100000 // 通用错误: 100001-100999
	CodeValidationBase = 200000 // 验证错误: 200001-200999
	CodeAuthBase       = 300000 // 认证错误: 300001-300999
	CodeBusinessBase   = 400000 // 业务逻辑错误: 400001-400999
	CodeExternalBase   = 500000 // 外部服务错误: 500001-500999
)

// 错误构建器 - 简化错误创建
type ErrorBuilder struct {
	httpStatus int
	code       int
	message    string
}

func NewError(httpStatus, code int, message string) *ErrorBuilder {
	return &ErrorBuilder{
		httpStatus: httpStatus,
		code:       code,
		message:    message,
	}
}

// WithDetail 添加详细信息
func (b *ErrorBuilder) WithDetail(detail map[string]interface{}) HttpError {
	return HttpError{
		HttpStatus: b.httpStatus,
		Code:       b.code,
		Message:    b.message,
		Detail:     detail,
	}
}

func (b *ErrorBuilder) WithCause(cause string) HttpError {
	return HttpError{
		HttpStatus: b.httpStatus,
		Code:       b.code,
		Message:    b.message,
		Detail:     map[string]interface{}{"cause": cause},
	}
}

// WithID 快速添加 ID 字段
func (b *ErrorBuilder) WithID(id interface{}) HttpError {
	return b.WithDetail(map[string]interface{}{"id": id})
}

// WithDetailKV 使用键值对添加详细信息
func (b *ErrorBuilder) WithDetailKV(key string, value interface{}) HttpError {
	return b.WithDetail(map[string]interface{}{key: value})
}

// Error 返回错误（无详细信息）
func (b *ErrorBuilder) Error() HttpError {
	return HttpError{
		HttpStatus: b.httpStatus,
		Code:       b.code,
		Message:    b.message,
		Detail:     nil,
	}
}

// 预定义错误 - 使用构建器模式
var (
	// 分类错误
	ErrCategoryNotFound      = NewError(http.StatusNotFound, CodeCategoryBase+1, "Category not found")
	ErrCategoryCreateFailed  = NewError(http.StatusInternalServerError, CodeCategoryBase+2, "Create category failed")
	ErrCategoryUpdateFailed  = NewError(http.StatusInternalServerError, CodeCategoryBase+3, "Update category failed")
	ErrCategoryDeleteFailed  = NewError(http.StatusInternalServerError, CodeCategoryBase+4, "Delete category failed")
	ErrCategoryHasPosts      = NewError(http.StatusConflict, CodeCategoryBase+5, "Category has posts, cannot delete")
	ErrCategorySlugNotUnique = NewError(http.StatusConflict, CodeCategoryBase+6, "Category slug not unique")

	// 文章错误
	ErrPostNotFound        = NewError(http.StatusNotFound, CodePostBase+1, "Post not found")
	ErrPostSlugNotUnique   = NewError(http.StatusConflict, CodePostBase+2, "Slug not unique")
	ErrCreatePostFailed    = NewError(http.StatusInternalServerError, CodePostBase+3, "Create post failed")
	ErrGetPostsFailed      = NewError(http.StatusInternalServerError, CodePostBase+4, "Get posts failed")
	ErrGetPostsCountFailed = NewError(http.StatusInternalServerError, CodePostBase+5, "Get posts count failed")
	ErrUpdatePostFailed    = NewError(http.StatusInternalServerError, CodePostBase+6, "Update post failed")
	ErrDeletePostFailed    = NewError(http.StatusInternalServerError, CodePostBase+7, "Delete post failed")

	// 媒体错误
	ErrMediaNotFound         = NewError(http.StatusNotFound, CodeMediaBase+1, "Media not found")
	ErrMediaUploadFailed     = NewError(http.StatusInternalServerError, CodeMediaBase+2, "Media upload failed")
	ErrMediaDeleteFailed     = NewError(http.StatusInternalServerError, CodeMediaBase+3, "Media delete failed")
	ErrMediaUpdateFailed     = NewError(http.StatusInternalServerError, CodeMediaBase+4, "Media update failed")
	ErrMediaGetListFailed    = NewError(http.StatusInternalServerError, CodeMediaBase+5, "Get media list failed")
	ErrMediaPermissionDenied = NewError(http.StatusForbidden, CodeMediaBase+6, "Permission denied")
	ErrMediaFileNotFound     = NewError(http.StatusBadRequest, CodeMediaBase+7, "File not found")
	ErrMediaInvalidID        = NewError(http.StatusBadRequest, CodeMediaBase+8, "Invalid media ID")
	ErrMediaBatchUploadLimit = NewError(http.StatusBadRequest, CodeMediaBase+9, "Batch upload limit exceeded")

	// 用户错误
	ErrUserNotFound      = NewError(http.StatusNotFound, CodeUserBase+1, "User not found")
	ErrUserCreateFailed  = NewError(http.StatusInternalServerError, CodeUserBase+2, "Create user failed")
	ErrUserUpdateFailed  = NewError(http.StatusInternalServerError, CodeUserBase+3, "Update user failed")
	ErrUserPasswordWrong = NewError(http.StatusBadRequest, CodeUserBase+4, "Password wrong")

	// 通用错误
	ErrInternal  = NewError(http.StatusInternalServerError, CodeCommonBase+1, "Internal server error")
	ErrNotFound  = NewError(http.StatusNotFound, CodeCommonBase+2, "Resource not found")
	ErrForbidden = NewError(http.StatusForbidden, CodeCommonBase+3, "Forbidden")

	// 验证错误
	ErrValidation = NewError(http.StatusBadRequest, CodeValidationBase+1, "Validation error")

	// 认证错误
	ErrUnauthorized           = NewError(http.StatusUnauthorized, CodeAuthBase+1, "Unauthorized")
	ErrTokenExpired           = NewError(http.StatusUnauthorized, CodeAuthBase+2, "Token expired")
	ErrTokenInvalid           = NewError(http.StatusUnauthorized, CodeAuthBase+3, "Token invalid")
	ErrInsufficientPermission = NewError(http.StatusForbidden, CodeAuthBase+4, "Insufficient permission")

	// 业务逻辑错误
	ErrUserOrPasswordWrong = NewError(http.StatusNotFound, CodeBusinessBase+1, "Username or password wrong")
	ErrUserExists          = NewError(http.StatusConflict, CodeBusinessBase+2, "User already exists")
	ErrAccountDisabled     = NewError(http.StatusForbidden, CodeBusinessBase+3, "Account disabled")

	// 外部服务错误
	ErrDatabaseError   = NewError(http.StatusInternalServerError, CodeExternalBase+1, "Database error")
	ErrRedisError      = NewError(http.StatusInternalServerError, CodeExternalBase+2, "Redis error")
	ErrThirdPartyError = NewError(http.StatusInternalServerError, CodeExternalBase+3, "Third party service error")
)
