package seeder

import (
	"sl-server/config"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/services"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

const (
	AdminUsername = "admin"
	AdminPassword = "admin@123##ji-ni-tai-mei!"
)

func RunSeeder(db *gorm.DB) error {
	config.Logger.Info("开始初始化数据...")
	if err := SeedUser(db); err != nil {
		return err
	}

	if err := SeedCategory(db); err != nil {
		return err
	}

	config.Logger.Info("初始化数据完成🤩🤩🤩")

	return nil
}

func SeedUser(db *gorm.DB) error {
	user := models.User{
		Username: AdminUsername,
		Password: AdminPassword,
		Role:     "admin",
	}

	if err := db.First(&models.User{}, "username = ?", AdminUsername).Error; err == nil {
		config.Logger.Info("用户已存在", zap.String("username", AdminUsername))
		return nil
	}

	if err := db.Create(&user).Error; err != nil {
		return err
	}

	config.Logger.Info("初始化用户成功", zap.String("username", AdminUsername))

	return nil
}

func SeedCategory(db *gorm.DB) error {

	services.CreateCategory(dto.CategoryRequestDto{
		Name:        "默认分类",
		Slug:        "default",
		Description: "默认分类",
	})

	config.Logger.Info("初始化分类成功")

	return nil
}
