const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // 检查文章数量
    const postCount = await prisma.post.count();
    console.log('Total posts:', postCount);
    
    // 检查已发布的文章
    const publishedPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, status: true, publishedAt: true }
    });
    console.log('Published posts:', publishedPosts.length);
    console.log('Published posts details:', publishedPosts);
    
    // 检查分类
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    console.log('Categories:', categories);
    
    // 检查用户
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true }
    });
    console.log('Users:', users);
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 