# 博客全栈项目

基于 NestJS + Prisma + MySQL + Vue + ElementUI 构建的现代化博客系统。

## 📚 项目特性

- 🚀 **后端**: NestJS + Prisma + MySQL
- 🎨 **前端**: Vue 3 + ElementPlus + TypeScript
- 🔐 **认证**: JWT + 角色权限管理
- 👑 **超级管理员**: 完整的系统管理功能
- 📝 **富文本编辑**: Markdown 编辑器
- 🏷️ **分类标签**: 完善的内容分类系统
- 💬 **评论系统**: 多级评论回复
- 📱 **响应式**: PC + 移动端适配

## 🏗️ 项目结构

```
blog-fullstack/
├── blog-backend/          # NestJS 后端
├── blog-frontend/         # Vue 前端
├── package.json          # 根目录包管理
└── README.md            # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- MySQL >= 8.0
- npm 或 yarn

### 安装依赖
```bash
npm run install:all
```

### 配置数据库
1. 创建 MySQL 数据库
2. 复制 `blog-backend/.env.example` 为 `blog-backend/.env`
3. 配置数据库连接信息

### 启动项目
```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:backend   # 后端: http://localhost:3000
npm run dev:frontend  # 前端: http://localhost:5173
```

### 构建项目
```bash
npm run build
```

## 🔑 默认账号

**超级管理员账号**
- 邮箱: `admin@blog.com`
- 密码: `admin123456`

## 📖 功能模块

### 用户系统
- ✅ 用户注册/登录
- ✅ JWT认证
- ✅ 角色权限管理
- ✅ 个人资料管理

### 文章管理
- ✅ Markdown编辑器
- ✅ 草稿/发布状态
- ✅ 分类标签
- ✅ 文章搜索

### 评论系统
- ✅ 多级评论
- ✅ 评论点赞
- ✅ 评论管理

### 超级管理员
- ✅ 系统配置
- ✅ 用户管理
- ✅ 内容管理
- ✅ 数据统计
- ✅ 操作日志

## 🛠️ 技术栈

### 后端
- **框架**: NestJS
- **数据库**: MySQL + Prisma ORM
- **认证**: JWT + Passport
- **文档**: Swagger
- **验证**: class-validator

### 前端
- **框架**: Vue 3 + TypeScript
- **UI库**: ElementPlus
- **路由**: Vue Router
- **状态管理**: Pinia
- **构建工具**: Vite
- **编辑器**: MD Editor

## 📝 开发说明

### API 文档
启动后端后访问: http://localhost:3000/api

### 代码规范
- ESLint + Prettier
- TypeScript 严格模式
- Git Hooks 检查

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## �� 许可证

MIT License 