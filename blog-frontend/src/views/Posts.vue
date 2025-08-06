<template>
  <div class="posts">
    <div class="content-wrapper">
      <div class="posts-header">
        <div class="header-content">
          <div class="header-text">
            <h1 v-if="selectedCategory">{{ selectedCategory.name }}</h1>
            <h1 v-else>文章列表</h1>
            <p v-if="selectedCategory">{{ selectedCategory.name }} 分类下的文章</p>
            <p v-else>分享技术心得，记录成长历程</p>
          </div>
          <!-- 写文章按钮 -->
          <div class="write-article-btn" v-if="authStore.isAuthenticated">
            <router-link to="/edit" class="write-btn">
              <el-icon><EditPen /></el-icon>
              <span>写文章</span>
            </router-link>
          </div>
        </div>
        
        <!-- 分类筛选提示 -->
        <div v-if="selectedCategory" class="category-filter">
          <span class="filter-label">当前筛选：</span>
          <span class="filter-value">{{ selectedCategory.name }}</span>
          <button class="clear-filter-btn" @click="clearCategoryFilter">
            清除筛选
          </button>
        </div>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="filters">
        <div class="filter-tabs">
          <button 
            class="filter-tab" 
            :class="{ active: !showMyPosts }"
            @click="showMyPosts = false"
          >
            全部文章
          </button>
          <button 
            v-if="authStore.isAuthenticated"
            class="filter-tab" 
            :class="{ active: showMyPosts }"
            @click="showMyPosts = true"
          >
            我的文章
          </button>
        </div>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索文章..." 
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch">搜索</button>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <!-- 文章列表 -->
      <div v-else class="posts-grid">
        <article 
          v-for="post in posts" 
          :key="post.id" 
          class="post-card"
        >
          <div class="post-meta">
            <div class="post-meta-left">
              <span class="post-date">{{ formatDate(post.publishedAt) }}</span>
              <span class="post-category">{{ post.category?.name }}</span>
              <!-- 文章状态标识 -->
              <span 
                v-if="post.status !== 'PUBLISHED'" 
                class="post-status"
                :class="post.status.toLowerCase()"
              >
                {{ getStatusText(post.status) }}
              </span>
            </div>
            <div class="post-meta-right">
              <!-- 作者信息 -->
              <div v-if="post.author" class="post-author">
                <span class="author-label">作者：</span>
                <span class="author-name">{{ post.author.nickname || post.author.username }}</span>
              </div>
              <!-- 编辑按钮 - 只有作者或管理员才能看到 -->
              <button 
                v-if="canEditPost(post)" 
                class="edit-post-btn"
                @click.stop="editPost(post.id)"
                title="编辑文章"
              >
                <el-icon><EditPen /></el-icon>
              </button>
            </div>
          </div>
          <div class="post-content" @click="goToPost(post.id)">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-tags" v-if="post.tags?.length">
              <span 
                v-for="tag in post.tags" 
                :key="tag.id" 
                class="tag"
                :style="{ backgroundColor: tag.color }"
              >
                {{ tag.name }}
              </span>
            </div>
            <div class="post-footer">
              <span class="post-views">{{ post.viewCount }} 次阅读</span>
              <button 
                class="like-btn"
                :class="{ 'liked': post.isLiked }"
                @click.stop="toggleLike(post)"
                :disabled="!authStore.isAuthenticated"
                :title="authStore.isAuthenticated ? '点赞' : '请登录后点赞'"
              >
                <span class="like-icon">{{ post.isLiked ? '❤️' : '🤍' }}</span>
                <span class="like-count">{{ post.likeCount }}</span>
              </button>
              <span class="read-more">阅读全文 →</span>
            </div>
          </div>
        </article>
      </div>
      
      <!-- 空状态 -->
      <div v-if="!loading && posts.length === 0" class="empty-state">
        <p>暂无文章</p>
      </div>
      
      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage <= 1" 
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button 
          :disabled="currentPage >= totalPages" 
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { blogApi } from '@/api'
import type { BlogPost } from '@/types/api'
import { useAuthStore } from '@/stores/auth'
import { EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const selectedCategory = ref<{ id: number; name: string } | null>(null)
const showMyPosts = ref(false)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToPost = (id: number) => {
  router.push(`/posts/${id}`)
}

// 检查是否可以编辑文章
const canEditPost = (post: BlogPost) => {
  if (!authStore.isAuthenticated) return false
  
  // 管理员可以编辑所有文章
  if (authStore.isAdmin) return true
  
  // 作者可以编辑自己的文章
  return post.author?.id === authStore.user?.id
}

// 编辑文章
const editPost = (id: number) => {
  router.push(`/edit/${id}`)
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'ARCHIVED': '已归档'
  }
  return statusMap[status] || status
}

const loadPosts = async () => {
  try {
    loading.value = true
    const params: any = {
      page: currentPage.value,
      limit: 10
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (selectedCategory.value) {
      params.category = selectedCategory.value.id
    }
    
    // 如果显示我的文章，添加相关参数
    if (showMyPosts.value && authStore.isAuthenticated) {
      params.userId = authStore.user?.id
      params.myPosts = 'true'
    }
    
    const data = await blogApi.getPosts(params)
    posts.value = data.posts || []
    totalPages.value = data.totalPages || 1
    total.value = data.total || 0
  } catch (error) {
    console.error('获取文章列表失败:', error)
    // 显示错误提示
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadPosts()
}

// 监听筛选条件变化
watch(showMyPosts, () => {
  currentPage.value = 1
  loadPosts()
})

const goToPage = (page: number) => {
  currentPage.value = page
  loadPosts()
}

const clearCategoryFilter = () => {
  selectedCategory.value = null
  currentPage.value = 1
  // 清除URL参数
  router.push({
    path: '/posts',
    query: {
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(currentPage.value > 1 && { page: currentPage.value.toString() })
    }
  })
}

// 监听路由参数变化
watch(() => route.query, () => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
  if (route.query.category && route.query.categoryName) {
    selectedCategory.value = {
      id: Number(route.query.category),
      name: route.query.categoryName as string
    }
  } else {
    selectedCategory.value = null
  }
  
  // 处理我的文章参数
  if (route.query.myPosts === 'true') {
    showMyPosts.value = true
  }
  
  loadPosts()
}, { immediate: false })

// 点赞功能
const toggleLike = async (post: BlogPost) => {
  if (!authStore.isAuthenticated) {
    ElMessage.warning('请先登录后再点赞')
    return
  }
  
  try {
    // 模拟点赞操作
    post.isLiked = !post.isLiked
    post.likeCount += post.isLiked ? 1 : -1
    
    // 这里可以调用实际的API
    // await blogApi.likePost(post.id)
    
    ElMessage.success(post.isLiked ? '点赞成功' : '取消点赞')
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

onMounted(() => {
  // 从路由参数初始化
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
  if (route.query.category && route.query.categoryName) {
    selectedCategory.value = {
      id: Number(route.query.category),
      name: route.query.categoryName as string
    }
  }
  
  // 处理我的文章参数
  if (route.query.myPosts === 'true') {
    showMyPosts.value = true
  }
  
  loadPosts()
})
</script>

<style scoped>
.posts {
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
}

.posts-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.header-text {
  text-align: left;
  flex: 1;
}

.posts-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.posts-header p {
  font-size: 1.125rem;
  color: #666;
  max-width: 500px;
  margin: 0;
}

.write-article-btn {
  flex-shrink: 0;
}

.write-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.filter-label {
  font-size: 0.875rem;
  color: #666;
}

.filter-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-filter-btn {
  margin-left: auto;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filter-btn:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
  color: #409eff;
}

.write-btn {
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.write-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  color: white;
}

.filters {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.filter-tab {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  color: #495057;
  background: rgba(0, 0, 0, 0.05);
}

.filter-tab.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.search-box {
  display: flex;
  gap: 12px;
  max-width: 400px;
  width: 100%;
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.search-box button {
  padding: 12px 24px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-box button:hover {
  background: #555;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 60px;
}

.post-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.post-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: #e0e0e0;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
}

.post-meta-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.post-meta-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.author-label {
  color: #999;
}

.author-name {
  color: #333;
  font-weight: 500;
}

.post-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-status.draft {
  background: #fff3cd;
  color: #856404;
}

.post-status.archived {
  background: #f8d7da;
  color: #721c24;
}

.edit-post-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(-2px);
}

.post-card:hover .edit-post-btn {
  opacity: 1;
  transform: translateY(0);
}

.edit-post-btn:hover {
  background: #0056b3;
  transform: translateY(0) scale(1.05);
}

.post-date {
  font-size: 14px;
  color: #999;
}

.post-category {
  background: #f8f9fa;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-views, .post-likes {
  font-size: 14px;
  color: #999;
}

.post-likes {
  margin-left: 16px;
}

.read-more {
  font-size: 14px;
  color: #ff69b4;
  font-weight: 500;
  transition: color 0.2s ease;
}

.post-card:hover .read-more {
  color: #ff1493;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination button {
  padding: 10px 20px;
  background: #f8f9fa;
  color: #666;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  background: #333;
  color: #fff;
  border-color: #333;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* 点赞按钮样式 */
.like-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
}

.like-btn:hover:not(:disabled) {
  background: #fff5f5;
  border-color: #ff6b6b;
  color: #ff6b6b;
  transform: translateY(-1px);
}

.like-btn.liked {
  background: #fff5f5;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.like-icon {
  font-size: 16px;
}

.like-count {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .posts {
    padding: 20px 15px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-text {
    text-align: center;
  }
  
  .posts-header {
    margin-bottom: 30px;
  }
  
  .posts-header h1 {
    font-size: 2rem;
  }
  
  .posts-header p {
    font-size: 1rem;
  }
  
  .write-btn {
    width: 100%;
    justify-content: center;
  }
  
  .filters {
    margin-bottom: 30px;
  }
  
  .posts-grid {
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .post-card {
    padding: 24px;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .post-excerpt {
    font-size: 0.95rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .post-card {
    padding: 20px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-box {
    flex-direction: column;
  }
}
</style>