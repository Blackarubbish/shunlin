package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/database"
	"sl-server/models"
	"sl-server/pkgs/response"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var body models.User
	if err := c.ShouldBindJSON(&body); err != nil {
		config.Logger.Warn("用户注册数据绑定失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	config.Logger.Info("尝试注册新用户", zap.String("username", body.Username))

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		config.Logger.Error("密码哈希生成失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "密码处理失败")
		return
	}

	user := models.User{Username: body.Username, Password: string(hash)}
	if err := database.DB.Create(&user).Error; err != nil {
		config.Logger.Error("用户创建失败", zap.String("username", body.Username), zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "用户创建失败")
		return
	}

	config.Logger.Info("用户注册成功", zap.String("username", body.Username), zap.Uint("user_id", user.ID))
	response.Success(c, "user created")
}

func Login(c *gin.Context) {
	var body models.User
	if err := c.ShouldBindJSON(&body); err != nil {
		config.Logger.Warn("用户登录数据绑定失败", zap.Error(err))
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	config.Logger.Info("用户尝试登录", zap.String("username", body.Username))

	var user models.User
	if err := database.DB.Where("username = ?", body.Username).First(&user).Error; err != nil {
		config.Logger.Warn("用户查询失败", zap.String("username", body.Username), zap.Error(err))
		response.Error(c, http.StatusUnauthorized, "user not found")
		return
	}

	if user.ID == 0 {
		config.Logger.Warn("用户不存在", zap.String("username", body.Username))
		response.Error(c, http.StatusUnauthorized, "user not found")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		config.Logger.Warn("密码验证失败", zap.String("username", body.Username))
		response.Error(c, http.StatusUnauthorized, "wrong password")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(config.GetJWTSecret())
	if err != nil {
		config.Logger.Error("JWT token生成失败", zap.String("username", body.Username), zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "token generation failed")
		return
	}

	config.Logger.Info("用户登录成功", zap.String("username", body.Username))
	response.Success(c, gin.H{"token": tokenString})
}
