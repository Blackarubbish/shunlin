// middleware/role.go
package middleware

import (
	"net/http"
	"sl-server/database"
	"sl-server/models"

	"github.com/gin-gonic/gin"
)

// AdminRequired 管理员权限中间件
func AdminRequired() gin.HandlerFunc {
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

		// 检查是否为管理员
		if user.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "需要管理员权限"})
			return
		}

		c.Set("user_role", user.Role)
		c.Next()
	}
}

// EditorRequired 编辑权限中间件（管理员和编辑都可以）
func EditorRequired() gin.HandlerFunc {
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

		// 检查是否有编辑权限
		if user.Role != "admin" && user.Role != "editor" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "需要编辑权限"})
			return
		}

		c.Set("user_role", user.Role)
		c.Next()
	}
}
