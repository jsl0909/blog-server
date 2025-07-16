<template>
  <div class="post-detail">
    <div class="content-wrapper">
      <!-- 文章头部 -->
      <header class="post-header">
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          <span class="post-category">{{ post.category }}</span>
          <span class="post-views">{{ post.views }} 次阅读</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-excerpt">{{ post.excerpt }}</p>
      </header>

      <!-- 文章内容 -->
      <article class="post-content">
        <div v-html="post.content"></div>
      </article>

      <!-- 文章标签 -->
      <div class="post-tags" v-if="post.tags.length">
        <h3>标签</h3>
        <div class="tags-list">
          <span 
            v-for="tag in post.tags" 
            :key="tag" 
            class="tag"
            @click="goToTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="post-navigation">
        <button class="nav-btn" @click="goBack">
          ← 返回文章列表
        </button>
        <div class="nav-actions">
          <button class="action-btn" @click="toggleLike">
            {{ post.liked ? '❤️' : '🤍' }} {{ post.likes }}
          </button>
          <button class="action-btn" @click="sharePost">
            📤 分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const post = ref({
  id: 1,
  title: 'Vue 3 Composition API 深度解析',
  excerpt: '深入了解 Vue 3 Composition API 的设计理念和最佳实践，掌握现代前端开发技巧。',
  content: `
    <h2>什么是 Composition API？</h2>
    <p>Composition API 是 Vue 3 中引入的全新特性，它提供了一种更灵活的方式来组织组件逻辑。与传统的 Options API 相比，Composition API 具有以下优势：</p>
    
    <ul>
      <li><strong>更好的逻辑复用</strong>：通过组合函数实现逻辑的高度复用</li>
      <li><strong>更好的类型推导</strong>：更好地支持 TypeScript</li>
      <li><strong>更灵活的代码组织</strong>：按功能而非选项类型组织代码</li>
    </ul>

    <h2>基础用法</h2>
    <pre><code>import { ref, reactive, computed, watch } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({ name: 'Vue 3' })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 监听器
    watch(count, (newVal, oldVal) => {
      console.log(\`count changed from \${oldVal} to \${newVal}\`)
    })
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}</code></pre>

    <h2>组合函数 (Composables)</h2>
    <p>组合函数是利用 Composition API 来封装和复用有状态逻辑的函数。它们是 Vue 3 中实现逻辑复用的主要方式。</p>
    
    <pre><code>// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}</code></pre>

    <h2>最佳实践</h2>
    <ol>
      <li><strong>使用 ref 和 reactive</strong>：根据数据类型选择合适的响应式API</li>
      <li><strong>逻辑分组</strong>：将相关的逻辑放在一起，而不是按照选项类型分散</li>
      <li><strong>提取组合函数</strong>：将可复用的逻辑提取到独立的组合函数中</li>
      <li><strong>类型安全</strong>：充分利用 TypeScript 的类型系统</li>
    </ol>

    <h2>总结</h2>
    <p>Composition API 为 Vue 3 带来了更强大的逻辑组织和复用能力。虽然学习曲线相对陡峭，但掌握后能显著提升开发效率和代码质量。建议在新项目中积极使用，在老项目中可以渐进式迁移。</p>
  `,
  category: '前端开发',
  tags: ['Vue3', 'Composition API', '前端开发', 'JavaScript'],
  views: 1234,
  likes: 42,
  liked: false,
  createdAt: '2024-01-15T10:00:00Z'
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.push('/posts')
}

const goToTag = (tag: string) => {
  router.push(`/tags?tag=${encodeURIComponent(tag)}`)
}

const toggleLike = () => {
  post.value.liked = !post.value.liked
  post.value.likes += post.value.liked ? 1 : -1
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: post.value.excerpt,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

onMounted(() => {
  // 根据路由参数获取文章详情
  const postId = route.params.id
  console.log('加载文章:', postId)
  
  // 这里可以调用API获取文章详情
  // fetchPost(postId)
})
</script>

<style scoped>
.post-detail {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.content-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

/* 文章头部 */
.post-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

.post-views {
  font-size: 14px;
  color: #999;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.post-excerpt {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 0;
}

/* 文章内容 */
.post-content {
  margin-bottom: 48px;
  line-height: 1.8;
}

.post-content :deep(h2) {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.post-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px 0;
}

.post-content :deep(p) {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 16px;
}

.post-content :deep(ul), .post-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.post-content :deep(li) {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #444;
  margin-bottom: 8px;
}

.post-content :deep(pre) {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.post-content :deep(code) {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  color: #e83e8c;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #333;
}

.post-content :deep(strong) {
  font-weight: 600;
  color: #333;
}

/* 标签 */
.post-tags {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.post-tags h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  background: #f8f9fa;
  color: #666;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.tag:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
}

/* 导航 */
.post-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #f0f0f0;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #333;
  color: #fff;
  border-color: #333;
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #ff69b4;
  color: #fff;
  border-color: #ff69b4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail {
    padding: 20px 15px;
  }
  
  .content-wrapper {
    padding: 40px 30px;
  }
  
  .post-title {
    font-size: 2rem;
  }
  
  .post-excerpt {
    font-size: 1.125rem;
  }
  
  .post-content :deep(h2) {
    font-size: 1.5rem;
  }
  
  .post-content :deep(h3) {
    font-size: 1.25rem;
  }
  
  .post-content :deep(p),
  .post-content :deep(li) {
    font-size: 1rem;
  }
  
  .post-navigation {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .nav-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 30px 20px;
  }
  
  .post-title {
    font-size: 1.75rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .post-content :deep(pre) {
    padding: 15px;
    font-size: 14px;
  }
}
</style> 