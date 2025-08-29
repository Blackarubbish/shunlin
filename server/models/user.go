package models

import (
	"sl-server/pkgs/passwd"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null;size:50"`
	Password string `gorm:"not null;size:255" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.Password != "" {
		u.Password, err = passwd.HashPassword(u.Password)
		if err != nil {
			return err
		}
	}
	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
	if u.Password != "" {
		u.Password, err = passwd.HashPassword(u.Password)
		if err != nil {
			return err
		}
	}
	return nil
}

func (u *User) CheckPassword(password string) bool {
	return passwd.CheckPassword(u.Password, password)
}
