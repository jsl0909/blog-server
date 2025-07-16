<template>
  <div class="posts">
    <div class="content-wrapper">
      <div class="posts-header">
        <h1>文章列表</h1>
        <p>分享技术心得，记录成长历程</p>
      </div>
      
      <div class="posts-grid">
        <article 
          v-for="post in posts" 
          :key="post.id" 
          class="post-card"
          @click="goToPost(post.id)"
        >
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.createdAt) }}</span>
            <span class="post-category">{{ post.category }}</span>
          </div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <span class="post-views">{{ post.views }} 次阅读</span>
            <span class="read-more">阅读全文 →</span>
          </div>
        </article>
      </div>
      
      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <button class="load-more-btn" @click="loadMore" :disabled="loading">
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const hasMore = ref(true)

const posts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '深入了解 Vue 3 Composition API 的设计理念和最佳实践，掌握现代前端开发技巧。本文将从基础概念开始，逐步深入到高级用法...',
    category: '前端开发',
    views: 1234,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'TypeScript 进阶技巧总结',
    excerpt: '从基础到进阶，全面掌握 TypeScript 的类型系统和高级特性，提升代码质量。包括泛型、条件类型、映射类型等高级概念...',
    category: '技术分享',
    views: 856,
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: 3,
    title: 'NestJS 微服务架构实践',
    excerpt: '构建高性能、可扩展的后端服务，探索企业级应用开发的最佳实践方案。从单体应用到微服务的演进过程...',
    category: '后端开发',
    views: 967,
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: 4,
    title: 'MySQL 性能优化策略',
    excerpt: '从索引设计到查询优化，全方位提升数据库性能，解决高并发场景下的挑战。包括慢查询分析、索引优化等实用技巧...',
    category: '数据库',
    views: 723,
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: 5,
    title: '前端工程化最佳实践',
    excerpt: '构建现代化的前端开发工作流，提升团队协作效率。从代码规范到自动化部署的完整解决方案...',
    category: '工程化',
    views: 612,
    createdAt: '2024-01-05T11:20:00Z'
  },
  {
    id: 6,
    title: 'React Hooks 实战指南',
    excerpt: '深入理解 React Hooks 的原理和使用场景，打造高质量的 React 应用。从基础 Hook 到自定义 Hook 的实现...',
    category: '前端开发',
    views: 890,
    createdAt: '2024-01-03T13:30:00Z'
  }
])

const formatDate = (dateString: string) => {
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

const loadMore = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    hasMore.value = false // 演示没有更多数据
  }, 1000)
}

onMounted(() => {
  // 页面加载时的初始化逻辑
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
  margin-bottom: 60px;
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
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-views {
  font-size: 14px;
  color: #999;
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

.load-more {
  text-align: center;
}

.load-more-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #f0f0f0;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #333;
  color: #fff;
  border-color: #333;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .posts {
    padding: 20px 15px;
  }
  
  .posts-header {
    margin-bottom: 40px;
  }
  
  .posts-header h1 {
    font-size: 2rem;
  }
  
  .posts-header p {
    font-size: 1rem;
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
}
</style> 