package seeder

import (
	"sl-server/config"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/pkgs/passwd"
	"sl-server/services"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

const (
	AdminUsername = "admin"
	AdminPassword = "admin@123##ji-ni-tai-mei!"

	TestUsername = "shunlin.li@qq.com"
	TestPassword = "ji-ni-tai-mei!-hhh!"
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
	// 使用事务处理用户创建逻辑 - 手动检查存在性（更安全）
	err := db.Transaction(func(tx *gorm.DB) error {
		// 检查并创建admin用户
		var existingAdmin models.User
		err := tx.Where("username = ?", AdminUsername).First(&existingAdmin).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				// 用户不存在，创建新用户
				adminUser := models.User{
					Username: AdminUsername,
					Password: passwd.FeHashPassword(AdminPassword),
					Role:     "admin",
					Email:    "admin@example.com",
				}
				if err := tx.Create(&adminUser).Error; err != nil {
					config.Logger.Error("创建admin用户失败", zap.Error(err))
					return err
				}
				config.Logger.Info("创建admin用户成功", zap.String("username", AdminUsername))
			} else {
				// 数据库查询错误
				config.Logger.Error("查询admin用户失败", zap.Error(err))
				return err
			}
		} else {
			// 用户已存在
			config.Logger.Info("admin用户已存在，跳过创建", zap.String("username", AdminUsername))
		}

		// 检查并创建test用户
		var existingTest models.User
		err = tx.Where("username = ?", TestUsername).First(&existingTest).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				// 用户不存在，创建新用户
				testUser := models.User{
					Username: TestUsername,
					Password: passwd.FeHashPassword(TestPassword),
					Role:     "admin",
					Email:    "test@example.com",
				}
				if err := tx.Create(&testUser).Error; err != nil {
					config.Logger.Error("创建test用户失败", zap.Error(err))
					return err
				}
				config.Logger.Info("创建test用户成功", zap.String("username", TestUsername))
			} else {
				// 数据库查询错误
				config.Logger.Error("查询test用户失败", zap.Error(err))
				return err
			}
		} else {
			// 用户已存在
			config.Logger.Info("test用户已存在，跳过创建", zap.String("username", TestUsername))
		}

		return nil
	})

	if err != nil {
		config.Logger.Error("用户创建事务失败", zap.Error(err))
		return err
	}

	config.Logger.Info("所有用户创建成功")
	return nil
}

func SeedCategory(db *gorm.DB) error {

	services.CreateCategory(dto.CreateCategoryRequestDto{
		Name:        "默认分类",
		Slug:        "default",
		Description: "默认分类",
	})

	config.Logger.Info("初始化分类成功")

	return nil
}
