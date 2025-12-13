# 媒体文件上传API使用示例

## API端点列表

### 1. 单文件上传
```bash
POST /api/v1/media/upload
```

### 2. 批量文件上传
```bash
POST /api/v1/media/batch-upload
```

### 3. 获取媒体列表
```bash
GET /api/v1/media/list
```

### 4. 获取媒体详情
```bash
GET /api/v1/media/:id
```

### 5. 更新媒体信息
```bash
PUT /api/v1/media/:id
```

### 6. 删除媒体
```bash
DELETE /api/v1/media/:id
```

## 使用示例

### 1. 单文件上传

```bash
curl -X POST \
  http://localhost:8080/api/v1/media/upload \
  -F "file=@/path/to/image.jpg"
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "original_name": "image.jpg",
    "filename": "a1b2c3d4e5f6.jpg",
    "file_url": "/uploads/image/2024/08/30/a1b2c3d4e5f6.jpg",
    "filetype": "image",
    "filesize": 1024000,
    "extension": ".jpg",
    "uploaded_at": "2024-08-30 12:00:00"
  }
}
```

### 2. 批量上传

```bash
curl -X POST \
  http://localhost:8080/api/v1/media/batch-upload \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.png" \
  -F "files=@/path/to/document.pdf"
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "success_count": 2,
    "error_count": 1,
    "results": [
      {
        "id": 2,
        "original_name": "image1.jpg",
        "filename": "b2c3d4e5f6g7.jpg",
        "file_url": "/uploads/image/2024/08/30/b2c3d4e5f6g7.jpg",
        "filetype": "image",
        "filesize": 2048000,
        "extension": ".jpg",
        "uploaded_at": "2024-08-30 12:01:00"
      },
      {
        "id": 3,
        "original_name": "image2.png",
        "filename": "c3d4e5f6g7h8.png",
        "file_url": "/uploads/image/2024/08/30/c3d4e5f6g7h8.png",
        "filetype": "image",
        "filesize": 1536000,
        "extension": ".png",
        "uploaded_at": "2024-08-30 12:01:01"
      }
    ],
    "errors": [
      "document.pdf: 文档文件大小不能超过 10 MB"
    ]
  }
}
```

### 3. 获取媒体列表

```bash
# 获取所有媒体
curl "http://localhost:8080/api/v1/media/list"

# 按类型筛选
curl "http://localhost:8080/api/v1/media/list?filetype=image"

# 分页查询
curl "http://localhost:8080/api/v1/media/list?page=1&pageSize=10"

# 组合查询
curl "http://localhost:8080/api/v1/media/list?filetype=image&page=1&pageSize=5"
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "original_name": "image.jpg",
        "filename": "a1b2c3d4e5f6.jpg",
        "filepath": "/uploads/image/2024/08/30/a1b2c3d4e5f6.jpg",
        "file_url": "/uploads/image/2024/08/30/a1b2c3d4e5f6.jpg",
        "filetype": "image",
        "mime_type": "image/jpeg",
        "filesize": 1024000,
        "extension": ".jpg",
        "uploaded_by": 1,
        "status": "active",
        "description": "",
        "alt": "",
        "created_at": "2024-08-30T12:00:00Z",
        "updated_at": "2024-08-30T12:00:00Z",
        "user": {
          "id": 1,
          "username": "admin"
        }
      }
    ],
    "total": 1,
    "page": 1,
    "size": 10
  }
}
```

### 4. 获取媒体详情

```bash
curl "http://localhost:8080/api/v1/media/1"
```

### 5. 更新媒体信息

```bash
curl -X PUT \
  http://localhost:8080/api/v1/media/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "这是一张美丽的风景图片",
    "alt": "风景图片"
  }'
```

### 6. 删除媒体

```bash
curl -X DELETE http://localhost:8080/api/v1/media/1
```

## JavaScript前端示例

### 单文件上传
```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/v1/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.code === 200) {
      console.log('上传成功:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
}

// 使用示例
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await uploadFile(file);
      console.log('文件URL:', result.file_url);
    } catch (error) {
      alert('上传失败: ' + error.message);
    }
  }
});
```

### 批量上传
```javascript
async function batchUpload(files) {
  const formData = new FormData();
  
  // 添加多个文件
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });
  
  try {
    const response = await fetch('/api/v1/media/batch-upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('批量上传失败:', error);
    throw error;
  }
}
```

### 获取媒体列表
```javascript
async function getMediaList(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/v1/media/list${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('获取媒体列表失败:', error);
    throw error;
  }
}

// 使用示例
getMediaList({ filetype: 'image', page: 1, pageSize: 10 })
  .then(data => {
    console.log('媒体列表:', data.items);
    console.log('总数:', data.total);
  });
```

## 文件类型支持

### 图片文件
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- 最大大小: 5MB

### 视频文件
- `.mp4`, `.avi`, `.mov`, `.wmv`, `.flv`, `.webm`
- 最大大小: 100MB

### 文档文件
- `.pdf`, `.doc`, `.docx`, `.txt`, `.md`
- 最大大小: 10MB

### 音频文件
- `.mp3`, `.wav`, `.flac`, `.aac`
- 最大大小: 20MB

## 错误处理

### 常见错误码
- `400`: 请求参数错误
- `404`: 媒体不存在
- `413`: 文件过大
- `415`: 不支持的文件类型
- `500`: 服务器内部错误

### 错误响应示例
```json
{
  "code": 400,
  "message": "不支持的文件类型: .exe",
  "data": null
}
```
