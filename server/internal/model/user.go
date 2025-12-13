// models/user.go - 更新现有文件
package model

import (
	"sl-server/pkg/passwd"
	"time"

	"gorm.io/gorm"
)

type User struct {
	BaseModel
	Username     string     `json:"username" gorm:"unique;not null;size:50"`
	Password     string     `json:"-" gorm:"not null;size:255"`
	Email        string     `json:"email" gorm:"unique;size:100"`
	Status       string     `json:"status" gorm:"default:'active';size:20"` // active, inactive, banned
	LastLoginAt  *time.Time `json:"last_login_at" gorm:"null"`
	LoginCount   int        `json:"login_count" gorm:"default:0"`
	RefreshToken string     `json:"-" gorm:"size:500"`
	Role         string     `json:"role" gorm:"default:'guest';size:20"` // guest, user, admin
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
	// 只有当密码字段被修改时才重新加密
	if tx.Statement.Changed("Password") && u.Password != "" {
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

// 更新登录信息
func (u *User) UpdateLoginInfo(db *gorm.DB) error {
	now := time.Now()
	return db.Model(u).Updates(map[string]interface{}{
		"last_login_at": &now,
		"login_count":   gorm.Expr("login_count + 1"),
	}).Error
}

// 检查用户状态是否可以登录
func (u *User) CanLogin() bool {
	return u.Status == "active"
}
