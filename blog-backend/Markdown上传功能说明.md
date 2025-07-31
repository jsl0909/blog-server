# Markdown文件上传功能说明

## 功能概述

本功能允许用户上传Markdown文件，系统会自动解析文件内容并创建博客文章。支持YAML front matter来设置文章的元数据。

## 功能特性

### 1. 文件格式支持
- 支持 `.md` 文件扩展名
- 支持 `text/markdown` MIME类型
- 文件大小限制：10MB

### 2. 自动内容解析
- 自动提取文章标题
- 自动生成文章摘要
- 支持YAML front matter元数据
- 保留原始Markdown格式

### 3. 智能标签和分类管理
- 自动创建不存在的标签
- 自动创建不存在的分类
- 支持标签数组格式

### 4. 权限控制
- 仅管理员和作者可以上传
- 需要JWT认证
- 支持角色权限验证

## API接口

### 上传Markdown文件
```
POST /upload/markdown
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**请求参数：**
- `file`: Markdown文件
- `userId`: 用户ID

**响应格式：**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "文章标题",
      "content": "文章内容",
      "summary": "文章摘要",
      "status": "DRAFT",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "originalFile": {
      "originalname": "example.md",
      "filename": "1234567890-example.md",
      "size": 1024
    }
  }
}
```

## YAML Front Matter 格式

在Markdown文件开头可以添加YAML格式的元数据：

```yaml
---
title: 文章标题
summary: 文章摘要
tags: [标签1, 标签2, 标签3]
category: 分类名称
status: published
coverImage: /path/to/image.jpg
publishedAt: 2024-01-15
---
```

### 支持的字段

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| title | string | 文章标题 | 第一个#标题或文件名 |
| summary | string | 文章摘要 | 自动提取前几行 |
| tags | array | 标签列表 | [] |
| category | string | 分类名称 | null |
| status | string | 发布状态 | draft |
| coverImage | string | 封面图片 | null |
| publishedAt | date | 发布时间 | null |

### 状态值说明
- `draft`: 草稿状态
- `published`: 已发布

## 使用示例

### 1. 基本Markdown文件
```markdown
# 我的第一篇文章

这是文章内容...

## 二级标题

更多内容...
```

### 2. 带YAML Front Matter的文件
```markdown
---
title: 技术分享：Vue.js 3 新特性
summary: 详细介绍Vue.js 3的新特性和使用方法
tags: [Vue.js, 前端, 技术分享]
category: 前端开发
status: published
---

# 技术分享：Vue.js 3 新特性

Vue.js 3带来了许多激动人心的新特性...

## Composition API

Composition API是Vue 3最重要的新特性之一...
```

## 前端使用

### 1. 上传组件
```vue
<template>
  <MarkdownUploader 
    @success="handleUploadSuccess"
    @error="handleUploadError"
  />
</template>

<script setup>
import MarkdownUploader from '@/components/MarkdownUploader.vue'

const handleUploadSuccess = (post) => {
  console.log('上传成功:', post)
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
}
</script>
```

### 2. API调用
```javascript
import { uploadAPI } from '@/api/upload'

const uploadMarkdown = async (file, userId) => {
  try {
    const result = await uploadAPI.uploadMarkdown(file, userId)
    if (result.success) {
      console.log('文章创建成功:', result.data.post)
    }
  } catch (error) {
    console.error('上传失败:', error)
  }
}
```

## 错误处理

### 常见错误
1. **文件格式错误**: 只支持.md文件
2. **文件过大**: 超过10MB限制
3. **权限不足**: 需要管理员或作者权限
4. **YAML格式错误**: front matter格式不正确
5. **数据库错误**: 创建文章失败

### 错误响应格式
```json
{
  "success": false,
  "error": "错误描述信息"
}
```

## 配置说明

### 后端配置
- 文件上传目录: `./uploads`
- 文件大小限制: 10MB
- 支持的文件类型: `.md`, `text/markdown`

### 前端配置
- 上传组件路径: `@/components/MarkdownUploader.vue`
- API接口: `/upload/markdown`
- 页面路由: `/admin/posts/upload-markdown`

## 注意事项

1. **文件编码**: 确保Markdown文件使用UTF-8编码
2. **图片路径**: 图片链接需要是完整URL或相对路径
3. **YAML格式**: front matter必须放在文件开头，用`---`包围
4. **权限控制**: 只有管理员和作者可以上传文件
5. **文件存储**: 原文件会保存在服务器，文章内容存储到数据库

## 开发说明

### 后端文件结构
```
src/upload/
├── upload.controller.ts    # 控制器
├── upload.service.ts       # 服务层
└── upload.module.ts        # 模块定义
```

### 前端文件结构
```
src/
├── components/
│   └── MarkdownUploader.vue    # 上传组件
├── views/admin/
│   └── MarkdownUpload.vue      # 上传页面
└── api/
    └── upload.ts               # API接口
```

## 测试

### 测试文件
- `test-markdown-upload.md`: 基本功能测试
- `example-post.md`: 完整功能示例

### 测试步骤
1. 启动后端服务
2. 启动前端服务
3. 登录管理员账户
4. 访问 `/admin/posts/upload-markdown`
5. 上传测试文件
6. 验证文章创建结果

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 支持基本Markdown文件上传
- 支持YAML front matter解析
- 支持自动标签和分类创建
- 支持权限控制 