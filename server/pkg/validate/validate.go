package validate

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

// 验证通用slug
func ValidateCommonSlug(fl validator.FieldLevel) bool {
	slug := fl.Field().String()
	// 最短2个字符，最长200个字符，只能包含小写字母和数字，只能包含-
	if len(slug) < 2 || len(slug) > 200 {
		return false
	}
	matched, _ := regexp.MatchString(`^[a-z0-9]+(?:-[a-z0-9]+)*$`, slug)
	return matched
}

func BindingValidator(validate *validator.Validate) *validator.Validate {
	validate.RegisterValidation("slug", ValidateCommonSlug)
	return validate
}

// FormatValidationError formats validation errors into readable messages
func FormatValidationError(err error) map[string]string {
	errors := make(map[string]string)

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		errors["error"] = err.Error()
		return errors
	}

	for _, e := range validationErrors {
		field := e.Field()
		tag := e.Tag()
		param := e.Param()

		switch tag {
		case "required":
			errors[field] = fmt.Sprintf("%s is required", field)
		case "min":
			errors[field] = fmt.Sprintf("%s must be at least %s characters", field, param)
		case "max":
			errors[field] = fmt.Sprintf("%s must be at most %s characters", field, param)
		case "email":
			errors[field] = fmt.Sprintf("%s must be a valid email", field)
		case "url":
			errors[field] = fmt.Sprintf("%s must be a valid URL", field)
		case "slug":
			errors[field] = fmt.Sprintf("%s must contain only lowercase letters, numbers and hyphens (2-200 chars)", field)
		case "oneof":
			errors[field] = fmt.Sprintf("%s must be one of: %s", field, param)
		case "gte":
			errors[field] = fmt.Sprintf("%s must be >= %s", field, param)
		case "lte":
			errors[field] = fmt.Sprintf("%s must be <= %s", field, param)
		case "gt":
			errors[field] = fmt.Sprintf("%s must be > %s", field, param)
		case "lt":
			errors[field] = fmt.Sprintf("%s must be < %s", field, param)
		default:
			errors[field] = fmt.Sprintf("%s failed on '%s' validation", field, tag)
		}
	}

	return errors
}

// FormatValidationErrorString formats validation errors into a single string
func FormatValidationErrorString(err error) string {
	errors := FormatValidationError(err)
	var messages []string
	for _, msg := range errors {
		messages = append(messages, msg)
	}
	return strings.Join(messages, "; ")
}
