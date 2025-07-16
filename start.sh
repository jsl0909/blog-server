#!/bin/bash

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 博客系统启动脚本${NC}"
echo "========================="
echo

# 安装根目录依赖
echo -e "${YELLOW}📦 安装依赖包...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 根目录依赖安装失败${NC}"
    exit 1
fi

# 安装后端依赖
echo
echo -e "${YELLOW}📦 安装后端依赖...${NC}"
cd blog-backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端依赖安装失败${NC}"
    exit 1
fi

# 安装前端依赖
echo
echo -e "${YELLOW}📦 安装前端依赖...${NC}"
cd ../blog-frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端依赖安装失败${NC}"
    exit 1
fi

cd ..

echo
echo -e "${GREEN}✅ 所有依赖安装完成！${NC}"
echo
echo -e "${BLUE}📖 使用说明：${NC}"
echo "1. 创建MySQL数据库 'blog_db'"
echo "2. 复制 blog-backend/.env.example 为 blog-backend/.env"
echo "3. 修改 .env 文件中的数据库连接信息"
echo "4. 运行数据库迁移和初始化数据"
echo "5. 启动项目"
echo
echo -e "${BLUE}🔧 数据库命令：${NC}"
echo "   cd blog-backend"
echo "   npm run prisma:migrate"
echo "   npm run prisma:seed"
echo
echo -e "${BLUE}🎯 启动命令：${NC}"
echo "   npm run dev"
echo
echo -e "${BLUE}📝 默认超级管理员账号：${NC}"
echo "   邮箱: admin@blog.com"
echo "   密码: admin123456"
echo
echo -e "${BLUE}🌐 访问地址：${NC}"
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:3000"
echo "   API文档: http://localhost:3000/api"
echo 