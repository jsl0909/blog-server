@echo off
chcp 65001 >nul
echo 🚀 博客系统启动脚本
echo =========================
echo.

echo 📦 安装依赖包...
call npm install
if errorlevel 1 (
    echo ❌ 根目录依赖安装失败
    pause
    exit /b 1
)

echo.
echo 📦 安装后端依赖...
cd blog-backend
call npm install
if errorlevel 1 (
    echo ❌ 后端依赖安装失败
    pause
    exit /b 1
)

echo.
echo 📦 安装前端依赖...
cd ..\blog-frontend
call npm install
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ 所有依赖安装完成！
echo.
echo 📖 使用说明：
echo 1. 创建MySQL数据库 'blog_db'
echo 2. 复制 blog-backend/.env.example 为 blog-backend/.env
echo 3. 修改 .env 文件中的数据库连接信息
echo 4. 运行数据库迁移和初始化数据
echo 5. 启动项目
echo.
echo 🔧 数据库命令：
echo    cd blog-backend
echo    npm run prisma:migrate
echo    npm run prisma:seed
echo.
echo 🎯 启动命令：
echo    npm run dev
echo.
echo 📝 默认超级管理员账号：
echo    邮箱: admin@blog.com
echo    密码: admin123456
echo.
echo 🌐 访问地址：
echo    前端: http://localhost:5173
echo    后端: http://localhost:3000
echo    API文档: http://localhost:3000/api
echo.
pause 