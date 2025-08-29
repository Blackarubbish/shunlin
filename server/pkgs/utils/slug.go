package utils

import (
	"strings"

	"github.com/gosimple/slug"
)

func MakeSlug(title string) string {
	return FormatSlug(slug.Make(title))
}

func FormatSlug(slug string) string {
	const SpecialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?`~"
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, SpecialChars, "")
	return slug
}
