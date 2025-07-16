# 博客后端系统

## 📖 项目介绍

这是一个基于 NestJS + Prisma + MySQL 的现代化博客后端系统，提供完整的博客功能 API。

## 🛠 技术栈

- **框架**: NestJS 10
- **数据库**: MySQL + Prisma ORM
- **认证**: JWT + Passport
- **API文档**: Swagger/OpenAPI
- **语言**: TypeScript
- **工具**: ESLint, Prettier

## 🚀 功能特性

### 核心功能
- ✅ 用户认证与授权 (JWT)
- ✅ 文章管理 (CRUD)
- ✅ 分类管理
- ✅ 标签管理
- ✅ 评论系统
- ✅ 点赞功能
- ✅ 文件上传
- ✅ 搜索功能
- ✅ 权限控制

### 博客前端API
- ✅ 公开文章列表
- ✅ 文章详情页
- ✅ 分类和标签展示
- ✅ 搜索和筛选
- ✅ 评论系统
- ✅ 点赞功能
- ✅ 站点统计

## 📁 项目结构

```
src/
├── auth/           # 认证模块
├── users/          # 用户管理
├── posts/          # 文章管理
├── categories/     # 分类管理
├── tags/           # 标签管理
├── comments/       # 评论管理
├── blog/           # 博客前端API
├── admin/          # 管理后台
├── upload/         # 文件上传
├── prisma/         # 数据库配置
└── main.ts         # 应用入口
```

## 🔧 环境配置

### 1. 安装依赖
```bash
npm install
```

### 2. 环境变量
创建 `.env` 文件：
```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/blog_db"

# JWT密钥
JWT_SECRET="your-secret-key"

# 服务器配置
PORT=3000
```

### 3. 数据库初始化
```bash
# 生成Prisma客户端
npx prisma generate

# 执行数据库迁移
npx prisma db push

# 初始化数据
npx prisma db seed
```

## 📚 API接口文档

### 博客前端API (`/api/blog`)

#### 文章相关
- `GET /api/blog/posts` - 获取文章列表
- `GET /api/blog/posts/:id` - 获取文章详情
- `GET /api/blog/posts/recommended` - 推荐文章
- `GET /api/blog/posts/latest` - 最新文章
- `POST /api/blog/posts/:id/like` - 点赞文章

#### 分类标签
- `GET /api/blog/categories` - 获取分类列表
- `GET /api/blog/tags` - 获取标签列表
- `GET /api/blog/tags/popular` - 热门标签

#### 评论系统
- `GET /api/blog/posts/:id/comments` - 获取评论
- `POST /api/blog/posts/:id/comments` - 添加评论

#### 其他功能
- `GET /api/blog/search` - 搜索文章
- `GET /api/blog/stats` - 站点统计
- `GET /api/blog/archive` - 文章归档

### 管理后台API (`/api`)

#### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

#### 文章管理
- `GET /api/posts` - 获取所有文章
- `POST /api/posts` - 创建文章
- `PATCH /api/posts/:id` - 更新文章
- `DELETE /api/posts/:id` - 删除文章

#### 分类管理
- `GET /api/categories` - 获取分类
- `POST /api/categories` - 创建分类
- `PATCH /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

#### 标签管理
- `GET /api/tags` - 获取标签
- `POST /api/tags` - 创建标签
- `PATCH /api/tags/:id` - 更新标签
- `DELETE /api/tags/:id` - 删除标签

## 🎯 快速开始

### 开发模式
```bash
npm run start:dev
```

### 生产模式
```bash
npm run build
npm run start:prod
```

### 数据库管理
```bash
# 查看数据库
npx prisma studio

# 重置数据库
npx prisma db push --force-reset
npx prisma db seed
```

## 📊 默认数据

系统初始化时会创建以下数据：

### 用户角色
- 超级管理员: `admin@blog.com` / `admin123456`
- 作者: `author@blog.com` / `admin123456`

### 示例数据
- 4篇技术文章
- 5个分类
- 10个标签
- 若干评论

## 🔐 权限说明

### 角色权限
- **super_admin**: 系统最高权限
- **admin**: 管理员权限
- **author**: 作者权限
- **user**: 普通用户权限

### API权限
- 公开接口: 无需认证
- 用户接口: 需要JWT认证
- 管理接口: 需要管理员权限

## 🚀 部署说明

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### 生产环境配置
- 配置反向代理 (Nginx)
- 设置环境变量
- 配置SSL证书
- 设置数据库连接池

## 📋 开发计划

- [ ] Redis缓存支持
- [ ] 邮件通知系统
- [ ] 图片压缩优化
- [ ] API限流增强
- [ ] 日志系统完善
- [ ] 单元测试覆盖

## 📞 联系方式

如有问题，请提交 Issue 或联系开发者。

---

**版本**: v1.0.0  
**更新时间**: 2024年1月  
**开发者**: Kent Liao 