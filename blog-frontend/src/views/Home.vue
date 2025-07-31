<template>
  <div class="home">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="welcome-title">欢迎来到 {{ blogTitle }}</h1>
        <p class="welcome-subtitle">分享技术心得，记录成长历程</p>
        <div class="banner-actions">
          <router-link to="/posts" class="primary-btn">
            <el-icon><Document /></el-icon>
            浏览文章
          </router-link>
          <router-link to="/edit" class="secondary-btn" v-if="authStore.isAuthenticated">
            <el-icon><EditPen /></el-icon>
            写文章
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 个人信息卡片 -->
      <div class="profile-section">
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar">
              <img src="/avatar.png" alt="Kent Liao" @error="handleImageError" />
              <div class="avatar-placeholder" v-show="imageError">KL</div>
            </div>
          </div>

          <div class="info-section">
            <h2 class="name">Kent Liao</h2>
            <p class="bio">
              I'm an software engineer who constantly seeks out innovative solutions to 
              everyday problems.
            </p>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-number" v-if="!loading.stats">{{ stats.totalPosts }}</span>
                <el-skeleton-item v-else variant="text" style="width: 40px; height: 24px;" />
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" v-if="!loading.stats">{{ stats.totalViews }}</span>
                <el-skeleton-item v-else variant="text" style="width: 40px; height: 24px;" />
                <span class="stat-label">阅读</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" v-if="!loading.stats">{{ stats.totalLikes }}</span>
                <el-skeleton-item v-else variant="text" style="width: 40px; height: 24px;" />
                <span class="stat-label">点赞</span>
              </div>
            </div>
          </div>

          <div class="social-section">
            <a href="https://github.com" class="social-icon" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="mailto:contact@example.com" class="social-icon" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636C.732 21.002 0 20.27 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.454-6.269h.91c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
            </a>
            <a href="/rss" class="social-icon" title="RSS">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
              </svg>
            </a>
            <a href="mailto:contact@example.com" class="social-icon" title="Contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 最新文章推荐 -->
      <div class="latest-posts-section">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <router-link to="/posts" class="view-all-link">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="posts-grid" v-if="!loading.posts && latestPosts.length > 0">
          <div 
            v-for="post in latestPosts" 
            :key="post.id" 
            class="post-card"
            @click="goToPost(post.id)"
          >
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.publishedAt) }}</span>
              <span class="post-category">{{ post.category?.name }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <span class="post-views">{{ post.viewCount }} 次阅读</span>
              <span class="post-likes">❤️ {{ post.likeCount }}</span>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div class="posts-grid" v-else-if="loading.posts">
          <div v-for="i in 3" :key="i" class="post-card">
            <el-skeleton :rows="3" animated />
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <el-empty description="暂无文章" />
        </div>
      </div>

      <!-- 热门分类 -->
      <div class="categories-section">
        <div class="section-header">
          <h2 class="section-title">热门分类</h2>
          <router-link to="/categories" class="view-all-link">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        
        <div class="categories-grid" v-if="!loading.categories && popularCategories.length > 0">
          <div 
            v-for="category in popularCategories" 
            :key="category.id"
            class="category-card clickable"
            @click="goToCategoryPosts(category.id, category.name)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-info">
              <h3 class="category-name">{{ category.name }}</h3>
              <span class="category-count">{{ category.postCount }} 篇文章</span>
            </div>
            <div class="category-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div class="categories-grid" v-else-if="loading.categories">
          <div v-for="i in 4" :key="i" class="category-card">
            <el-skeleton :rows="2" animated />
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <el-empty description="暂无分类" />
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions-section" v-if="authStore.isAuthenticated">
        <h2 class="section-title">快速操作</h2>
        <div class="actions-grid">
          <router-link to="/edit" class="action-card primary">
            <el-icon class="action-icon"><EditPen /></el-icon>
            <h3>写文章</h3>
            <p>开始创作新的技术文章</p>
          </router-link>
          <router-link to="/admin" class="action-card" v-if="authStore.isAdmin">
            <el-icon class="action-icon"><Setting /></el-icon>
            <h3>管理后台</h3>
            <p>管理文章、分类和用户</p>
          </router-link>
          <router-link to="/profile" class="action-card">
            <el-icon class="action-icon"><User /></el-icon>
            <h3>个人日志</h3>
            <p>记录日常思考和感悟</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { blogApi } from '@/api'
import type { BlogPost } from '@/types/api'
import { Document, EditPen, ArrowRight, Setting, User } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const imageError = ref(false)

// 计算博客标题
const blogTitle = computed(() => {
  if (authStore.isAuthenticated && authStore.user) {
    const displayName = authStore.user.nickname || authStore.user.username
    return `${displayName}'s Blog`
  }
  return "Kent's Blog"
})

// 加载状态
const loading = ref({
  stats: false,
  posts: false,
  categories: false
})

// 统计数据
const stats = ref({
  totalPosts: 0,
  totalViews: 0,
  totalLikes: 0
})

// 最新文章
const latestPosts = ref<BlogPost[]>([])

// 热门分类
const popularCategories = ref<Array<{
  id: number
  name: string
  icon: string
  postCount: number
}>>([])

// 分类图标映射
const categoryIcons: Record<string, string> = {
  '前端开发': '🎨',
  '后端技术': '⚙️',
  '移动开发': '📱',
  '技术思考': '💭',
  '数据库': '🗄️',
  '云计算': '☁️',
  '人工智能': '🤖',
  '区块链': '🔗',
  '网络安全': '🔒',
  'DevOps': '🚀',
  '设计模式': '🏗️',
  '算法': '📊',
  '工具': '🛠️',
  '教程': '📚',
  '经验分享': '💡'
}

const handleImageError = () => {
  imageError.value = true
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const goToPost = (id: number) => {
  router.push(`/posts/${id}`)
}

const goToCategoryPosts = (categoryId: number, categoryName: string) => {
  router.push({
    path: '/posts',
    query: { 
      category: categoryId.toString(),
      categoryName: categoryName
    }
  })
}

const loadStats = async () => {
  loading.value.stats = true
  try {
    const siteStats = await blogApi.getSiteStats()
    stats.value = {
      totalPosts: siteStats.postCount,
      totalViews: siteStats.totalViews,
      totalLikes: siteStats.totalViews // 暂时用总浏览量代替，后端需要添加点赞统计
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 如果API失败，使用默认值
    stats.value = {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0
    }
  } finally {
    loading.value.stats = false
  }
}

const loadLatestPosts = async () => {
  loading.value.posts = true
  try {
    const posts = await blogApi.getLatestPosts(3)
    latestPosts.value = posts
  } catch (error) {
    console.error('加载最新文章失败:', error)
    latestPosts.value = []
  } finally {
    loading.value.posts = false
  }
}

const loadPopularCategories = async () => {
  loading.value.categories = true
  try {
    const categories = await blogApi.getCategories()
    // 按文章数量排序，取前4个
    const sortedCategories = categories
      .filter(cat => cat.postCount && cat.postCount > 0)
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, 4)
    
    popularCategories.value = sortedCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: categoryIcons[cat.name] || '📁',
      postCount: cat.postCount || 0
    }))
  } catch (error) {
    console.error('加载热门分类失败:', error)
    popularCategories.value = []
  } finally {
    loading.value.categories = false
  }
}

onMounted(() => {
  loadStats()
  loadLatestPosts()
  loadPopularCategories()
})
</script>

<style scoped>
.home {
  min-height: calc(100vh - 80px);
  padding: 0;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.welcome-subtitle {
  font-size: 1.25rem;
  margin-bottom: 32px;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.primary-btn {
  background: white;
  color: #667eea;
}

.primary-btn:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  color: #667eea;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  color: white;
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 个人信息卡片 */
.profile-section {
  margin-bottom: 60px;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.avatar-section {
  margin-bottom: 24px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #f5f5f5;
  position: absolute;
  top: 0;
  left: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  position: absolute;
  top: 0;
  left: 0;
}

.info-section {
  margin-bottom: 24px;
}

.name {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.bio {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  max-width: 400px;
  margin: 0 auto 20px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.social-section {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f8f9fa;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.social-icon:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 内容区域通用样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  color: #5a6fd8;
  transform: translateX(2px);
}

/* 最新文章 */
.latest-posts-section {
  margin-bottom: 60px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #999;
}

.post-category {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #999;
}

/* 热门分类 */
.categories-section {
  margin-bottom: 60px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.category-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.category-card.clickable {
  cursor: pointer;
}

.category-card.clickable:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  background: #f8f9fa;
}

.category-arrow {
  margin-left: auto;
  color: #909399;
  transition: all 0.3s ease;
}

.category-card.clickable:hover .category-arrow {
  color: #409eff;
  transform: translateX(4px);
}

.category-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.category-count {
  font-size: 0.875rem;
  color: #666;
}

/* 快速操作 */
.quick-actions-section {
  margin-bottom: 60px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.action-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.action-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.action-card.primary:hover {
  transform: translateY(-4px) scale(1.02);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #667eea;
}

.action-card.primary .action-icon {
  color: white;
}

.action-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.action-card p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.action-card.primary p {
  color: rgba(255, 255, 255, 0.8);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px dashed #dee2e6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .banner-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .main-content {
    padding: 0 15px;
  }
  
  .profile-card {
    padding: 30px 20px;
  }
  
  .stats {
    gap: 20px;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .welcome-banner {
    padding: 40px 15px;
  }
  
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .profile-card {
    padding: 20px 15px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .name {
    font-size: 1.5rem;
  }
  
  .stats {
    gap: 16px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
}
</style> 