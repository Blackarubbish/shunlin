// services/jwt.go
package service

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sl-server/internal/config"
	"sl-server/internal/repository"
	"sl-server/internal/model"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct{}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
}

type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func NewJWTService() *JWTService {
	return &JWTService{}
}

// 生成访问令牌和刷新令牌
func (s *JWTService) GenerateTokenPair(user *model.User) (*TokenPair, error) {
	// 生成访问令牌 (短期有效，如1小时)
	accessTokenExpiry := time.Now().Add(time.Hour * 1)
	accessClaims := &Claims{
		UserID:   user.ID,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessTokenExpiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "sl-server",
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(config.GetJWTSecret())
	if err != nil {
		return nil, err
	}

	// 生成刷新令牌 (长期有效，如7天)
	refreshToken, err := s.generateRefreshToken()
	if err != nil {
		return nil, err
	}

	// 保存刷新令牌到数据库
	if err := s.saveRefreshToken(user.ID, refreshToken); err != nil {
		return nil, err
	}

	return &TokenPair{
		AccessToken:  accessTokenString,
		RefreshToken: refreshToken,
		ExpiresAt:    accessTokenExpiry.Unix(),
	}, nil
}

// 验证访问令牌
func (s *JWTService) ValidateAccessToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return config.GetJWTSecret(), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// 刷新访问令牌
func (s *JWTService) RefreshAccessToken(refreshToken string) (*TokenPair, error) {
	var user model.User
	if err := repository.DB.Where("refresh_token = ?", refreshToken).First(&user).Error; err != nil {
		return nil, errors.New("invalid refresh token")
	}

	if !user.CanLogin() {
		return nil, errors.New("user account is not active")
	}

	return s.GenerateTokenPair(&user)
}

// 撤销刷新令牌
func (s *JWTService) RevokeRefreshToken(userID uint) error {
	return repository.DB.Model(&model.User{}).Where("id = ?", userID).Update("refresh_token", "").Error
}

// 生成随机刷新令牌
func (s *JWTService) generateRefreshToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// 保存刷新令牌到数据库
func (s *JWTService) saveRefreshToken(userID uint, refreshToken string) error {
	return repository.DB.Model(&model.User{}).Where("id = ?", userID).Update("refresh_token", refreshToken).Error
}
