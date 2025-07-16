"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('开始初始化数据...');
    const roles = [
        { id: 1, name: 'super_admin', description: '超级管理员' },
        { id: 2, name: 'admin', description: '管理员' },
        { id: 3, name: 'editor', description: '编辑' },
        { id: 4, name: 'user', description: '普通用户' },
    ];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: {},
            create: role,
        });
    }
    console.log('角色数据初始化完成');
    const permissions = [
        { name: 'system:config', resource: 'system', action: 'config', description: '系统配置管理' },
        { name: 'system:log', resource: 'system', action: 'log', description: '系统日志查看' },
        { name: 'user:create', resource: 'user', action: 'create', description: '创建用户' },
        { name: 'user:read', resource: 'user', action: 'read', description: '查看用户' },
        { name: 'user:update', resource: 'user', action: 'update', description: '更新用户' },
        { name: 'user:delete', resource: 'user', action: 'delete', description: '删除用户' },
        { name: 'post:create', resource: 'post', action: 'create', description: '创建文章' },
        { name: 'post:read', resource: 'post', action: 'read', description: '查看文章' },
        { name: 'post:update', resource: 'post', action: 'update', description: '更新文章' },
        { name: 'post:delete', resource: 'post', action: 'delete', description: '删除文章' },
        { name: 'comment:create', resource: 'comment', action: 'create', description: '创建评论' },
        { name: 'comment:read', resource: 'comment', action: 'read', description: '查看评论' },
        { name: 'comment:update', resource: 'comment', action: 'update', description: '更新评论' },
        { name: 'comment:delete', resource: 'comment', action: 'delete', description: '删除评论' },
    ];
    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: { name: permission.name },
            update: {},
            create: permission,
        });
    }
    console.log('权限数据初始化完成');
    const superAdminRole = await prisma.role.findUnique({ where: { name: 'super_admin' } });
    const allPermissions = await prisma.permission.findMany();
    for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: permission.id,
            },
        });
    }
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    await prisma.user.upsert({
        where: { email: 'admin@blog.com' },
        update: {},
        create: {
            email: 'admin@blog.com',
            username: 'admin',
            password: hashedPassword,
            nickname: '超级管理员',
            roleId: 1,
        },
    });
    console.log('超级管理员账号创建完成');
    const categories = [
        { name: '技术分享', description: '技术相关文章' },
        { name: '生活随笔', description: '生活感悟和随笔' },
        { name: '学习笔记', description: '学习过程中的笔记' },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
    console.log('默认分类创建完成');
    const tags = [
        { name: 'JavaScript', color: '#f7df1e' },
        { name: 'TypeScript', color: '#3178c6' },
        { name: 'Vue', color: '#4fc08d' },
        { name: 'React', color: '#61dafb' },
        { name: 'Node.js', color: '#339933' },
        { name: 'MySQL', color: '#4479a1' },
    ];
    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { name: tag.name },
            update: {},
            create: tag,
        });
    }
    console.log('默认标签创建完成');
    const configs = [
        { key: 'site_name', value: '我的博客', description: '网站名称' },
        { key: 'site_description', value: '一个基于NestJS和Vue的博客系统', description: '网站描述' },
        { key: 'site_keywords', value: '博客,技术,分享', description: '网站关键词' },
        { key: 'posts_per_page', value: '10', description: '每页文章数量' },
    ];
    for (const config of configs) {
        await prisma.systemConfig.upsert({
            where: { key: config.key },
            update: {},
            create: config,
        });
    }
    console.log('系统配置初始化完成');
    console.log('数据初始化完成！');
    console.log('超级管理员账号：admin@blog.com');
    console.log('密码：admin123456');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map