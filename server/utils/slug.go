package utils

import "github.com/gosimple/slug"

func MakeSlug(title string) string {
	return slug.Make(title)
}
