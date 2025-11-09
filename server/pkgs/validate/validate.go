package validate

import (
	"regexp"

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
