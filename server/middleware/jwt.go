// middleware/jwt.go - 更新现有文件
package middleware

import (
	"net/http"
	"sl-server/consts"
	"sl-server/database"
	"sl-server/models"
	"sl-server/services"
	"strings"

	"github.com/gin-gonic/gin"
)

var jwtService = services.NewJWTService()

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, consts.AuthorizationPrefix) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "缺少访问令牌"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := jwtService.ValidateAccessToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "无效的访问令牌"})
			return
		}

		// 将用户信息存储到上下文中
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}

// 可选的中间件：检查用户状态
func CheckUserStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
			return
		}

		var user models.User
		if err := database.DB.First(&user, userID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "用户不存在"})
			return
		}

		if !user.CanLogin() {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "账户已被禁用"})
			return
		}

		c.Next()
	}
}
