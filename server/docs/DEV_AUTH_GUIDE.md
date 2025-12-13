# 开发环境跳过登录认证指南

## 功能说明

在开发环境中，频繁的登录操作会降低开发效率。现在你可以通过设置环境变量来跳过登录认证。

## 使用方法

### 1. 创建或编辑 .env 文件

在项目根目录创建 `.env` 文件（如果还没有的话），或者复制 `.env.example`：

```bash
cp .env.example .env
```

### 2. 设置 SKIP_AUTH 环境变量

在 `.env` 文件中添加或修改以下配置：

```env
SKIP_AUTH=true
```

### 3. 重启服务器

保存 `.env` 文件后，重启你的服务器：

```bash
make run
# 或者
go run main.go
```

## 工作原理

当 `SKIP_AUTH=true` 时：

1. 所有受 `AuthRequired()` 中间件保护的接口将不再验证 JWT token
2. 系统会自动注入一个默认的测试用户到请求上下文中：
   - `user_id`: 1
   - `username`: "dev_user"
3. 你可以直接访问需要认证的接口，无需携带 Authorization header

## 注意事项

⚠️ **重要提醒**：

1. **仅用于开发环境**：生产环境必须设置 `SKIP_AUTH=false` 或不设置该环境变量
2. **确保用户存在**：默认使用的 user_id 是 1，请确保数据库中存在 ID 为 1 的用户
3. **安全性**：此功能会完全绕过认证，请勿在生产环境使用

## 示例

### 启用跳过认证

```env
SKIP_AUTH=true
```

启动服务器后，你会看到日志输出：

```
skip_auth: true
```

当访问受保护的接口时（如 `/api/v1/admin/user/profile`），会看到：

```
跳过认证校验（开发模式）
```

### 禁用跳过认证（默认）

```env
SKIP_AUTH=false
```

或者直接注释掉或删除该配置，系统将使用正常的 JWT 认证流程。

## 如何切换回正常认证

只需要在 `.env` 文件中设置：

```env
SKIP_AUTH=false
```

或者直接删除该配置项，然后重启服务器即可。

## 影响范围

跳过认证会影响所有使用了 `middleware.AuthRequired()` 的路由，包括但不限于：

- `/api/v1/admin/user/*` - 用户相关接口
- `/api/v1/admin/media/*` - 媒体文件接口  
- `/api/v1/admin/posts/*` - 文章接口
- `/api/v1/admin/categories/*` - 分类接口

## 疑难排查

### 问题：设置了 SKIP_AUTH=true 但还是要求登录

**解决方案**：
1. 检查 `.env` 文件是否在项目根目录
2. 确认配置格式正确（没有多余的空格）
3. 重启服务器
4. 查看启动日志，确认 `skip_auth: true` 已加载

### 问题：接口返回用户不存在

**解决方案**：
确保数据库中存在 ID 为 1 的用户。可以通过注册接口创建一个用户，或者修改 `middleware/jwt.go` 中默认注入的 user_id。

