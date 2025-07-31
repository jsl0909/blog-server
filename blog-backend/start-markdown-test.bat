@echo off
echo ========================================
echo Markdown上传功能测试脚本
echo ========================================
echo.

echo 1. 检查Node.js环境...
node --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo.
echo 2. 安装依赖...
npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 3. 生成Prisma客户端...
npm run prisma:generate
if %errorlevel% neq 0 (
    echo 错误: Prisma客户端生成失败
    pause
    exit /b 1
)

echo.
echo 4. 启动开发服务器...
echo 服务器将在 http://localhost:3000 启动
echo 前端地址: http://localhost:5173
echo.
echo 测试步骤:
echo 1. 打开浏览器访问 http://localhost:5173
echo 2. 登录管理员账户
echo 3. 访问 "上传Markdown" 页面
echo 4. 上传 test-markdown-upload.md 文件
echo 5. 检查文章是否创建成功
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm run start:dev 