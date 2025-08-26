package database

import (
	"log"
	"sl-server/config"

	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var dbPath string
	if config.AppConfig != nil {
		dbPath = config.AppConfig.DBPath
	} else {
		dbPath = "blog.db" // 默认值
	}

	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		if config.Logger != nil {
			config.Logger.Fatal("数据库连接失败", zap.String("db_path", dbPath), zap.Error(err))
		} else {
			log.Fatal("failed to connect database")
		}
	}

	if config.Logger != nil {
		config.Logger.Info("数据库连接成功", zap.String("db_path", dbPath))
	}
}
