<template>
  <div class="posts">
    <div class="content-wrapper">
      <div class="posts-header">
        <h1>文章列表</h1>
        <p>分享技术心得，记录成长历程</p>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="filters">
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
          @click="goToPost(post.id)"
        >
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.publishedAt) }}</span>
            <span class="post-category">{{ post.category?.name }}</span>
          </div>
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
            <span class="post-likes">❤️ {{ post.likeCount }}</span>
            <span class="read-more">阅读全文 →</span>
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

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const posts = ref<BlogPost[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)

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

const goToPage = (page: number) => {
  currentPage.value = page
  loadPosts()
}

// 监听路由参数变化
watch(() => route.query, () => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
  loadPosts()
}, { immediate: false })

onMounted(() => {
  // 从路由参数初始化
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
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
  text-align: center;
  margin-bottom: 40px;
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
  margin: 0 auto;
}

.filters {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
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
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .posts {
    padding: 20px 15px;
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