// handlers/auth.go - 更新现有文件
package handlers

import (
	"net/http"
	"sl-server/config"
	"sl-server/database"
	"sl-server/dto"
	"sl-server/models"
	"sl-server/pkgs/response"
	"sl-server/services"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

var jwtService = services.NewJWTService()

// 用户注册
func Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		config.Logger.Warn("用户注册数据绑定失败", zap.Error(err))
		response.ErrorWithDetail(c, response.ErrValidation, err.Error())
		return
	}

	config.Logger.Info("尝试注册新用户", zap.String("username", req.Username))

	// 检查用户名是否已存在
	var existingUser models.User
	if err := database.DB.Where("username = ? OR email = ?", req.Username, req.Email).First(&existingUser).Error; err == nil {
		config.Logger.Warn("用户名或邮箱已存在", zap.String("username", req.Username))
		response.ErrorWithDetail(c, response.ErrUserExists)
		return
	}

	// 创建新用户
	user := models.User{
		Username: req.Username,
		Password: req.Password, // 会在BeforeCreate中自动加密
		Email:    req.Email,
		Status:   "active",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		config.Logger.Error("用户创建失败", zap.String("username", req.Username), zap.Error(err))
		response.ErrorWithDetail(c, response.ErrDatabaseError, "用户创建失败")
		return
	}

	config.Logger.Info("用户注册成功", zap.String("username", req.Username), zap.Uint("user_id", user.ID))

	userInfo := dto.UserInfo{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Status:   user.Status,
	}

	response.Success(c, gin.H{"user": userInfo})
}

// 用户登录
func Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		config.Logger.Warn("用户登录数据绑定失败", zap.Error(err))
		response.ErrorWithDetail(c, response.ErrValidation, err.Error())
		return
	}

	config.Logger.Info("用户尝试登录", zap.String("username", req.Username))

	// 查找用户
	var user models.User
	if err := database.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
		config.Logger.Warn("用户查询失败", zap.String("username", req.Username), zap.Error(err))
		response.ErrorWithDetail(c, response.ErrUserOrPasswordWrong, err.Error())
		return
	}

	// 检查用户状态
	if !user.CanLogin() {
		config.Logger.Warn("用户账户被禁用", zap.String("username", req.Username), zap.String("status", user.Status))
		response.ErrorWithDetail(c, response.ErrForbidden)
		return
	}

	// 验证密码
	if !user.CheckPassword(req.Password) {
		config.Logger.Warn("密码验证失败", zap.String("username", req.Username))
		response.ErrorWithDetail(c, response.ErrUserOrPasswordWrong)
		return
	}

	// 生成令牌对
	tokenPair, err := jwtService.GenerateTokenPair(&user)
	if err != nil {
		config.Logger.Error("JWT token生成失败", zap.String("username", req.Username), zap.Error(err))
		response.ErrorWithDetail(c, response.ErrInternal, err.Error())
		return
	}

	// 更新登录信息
	if err := user.UpdateLoginInfo(database.DB); err != nil {
		config.Logger.Warn("更新登录信息失败", zap.Error(err))
	}

	config.Logger.Info("用户登录成功", zap.String("username", req.Username))

	loginResponse := dto.LoginResponse{
		Token:        tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresAt:    tokenPair.ExpiresAt,
		User: dto.UserInfo{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
			Status:   user.Status,
		},
	}

	response.Success(c, loginResponse)
}

// 刷新令牌
func RefreshToken(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	tokenPair, err := jwtService.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		config.Logger.Warn("刷新令牌失败", zap.Error(err))
		response.Error(c, http.StatusUnauthorized, "无效的刷新令牌")
		return
	}

	response.Success(c, tokenPair)
}

// 登出
func Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	if err := jwtService.RevokeRefreshToken(userID.(uint)); err != nil {
		config.Logger.Error("撤销刷新令牌失败", zap.Error(err))
	}

	config.Logger.Info("用户登出", zap.Uint("user_id", userID.(uint)))
	response.Success(c, "登出成功")
}

// 修改密码
func ChangePassword(c *gin.Context) {
	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		response.Error(c, http.StatusNotFound, "用户不存在")
		return
	}

	// 验证旧密码
	if !user.CheckPassword(req.OldPassword) {
		response.Error(c, http.StatusBadRequest, "旧密码错误")
		return
	}

	// 更新密码
	user.Password = req.NewPassword
	if err := database.DB.Save(&user).Error; err != nil {
		config.Logger.Error("密码更新失败", zap.Error(err))
		response.Error(c, http.StatusInternalServerError, "密码更新失败")
		return
	}

	// 撤销所有刷新令牌，强制重新登录
	jwtService.RevokeRefreshToken(user.ID)

	config.Logger.Info("用户修改密码成功", zap.Uint("user_id", user.ID))
	response.Success(c, "密码修改成功，请重新登录")
}

// 获取当前用户信息
func GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		response.Error(c, http.StatusNotFound, "用户不存在")
		return
	}

	userInfo := dto.UserInfo{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		Status:   user.Status,
	}

	response.Success(c, userInfo)
}
