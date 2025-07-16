<template>
  <div class="post-detail-container">
    <!-- 文章横幅 -->
    <header class="post-banner" v-if="post?.coverImage" :style="{ backgroundImage: `url('/bg.png')` }">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="post-meta-banner" v-if="post.category">
          <router-link :to="`/categories?id=${post.category.id}`" class="category-link">
            {{ post.category.name }}
          </router-link>
        </div>
        <h1 class="post-title-banner">{{ post.title }}</h1>
        <div class="post-meta-banner">
          <span class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ post.author?.nickname || post.author?.username || 'ANONYMOUS' }}</span>
          </span>
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatDate(post.createdAt) }}</span>
          </span>
          <span class="meta-item" v-if="post.viewCount">
            <el-icon><View /></el-icon>
            <span>{{ post.viewCount }} VIEWS</span>
          </span>
        </div>
      </div>
    </header>

    <div class="post-detail-content">
      <el-card class="post-card">
        <div v-if="loading" class="loading">
          <el-skeleton :rows="10" animated />
        </div>
        
        <div v-else-if="post" class="post-content">
          <!-- 标签 -->
          <div class="post-tags" v-if="post.tags && post.tags.length">
            <div
              v-for="tag in post.tags"
              :key="tag.id"
              class="tag-item"
              @click="goToTag(tag.name)"
            >
              #{{ tag.name }}
            </div>
          </div>
          
          <!-- 文章内容 -->
          <main class="post-main">
            <div class="post-excerpt" v-if="post.excerpt">
              <blockquote>{{ post.excerpt }}</blockquote>
            </div>
            
            <div class="post-body" v-html="renderMarkdown(post.content)"></div>
          </main>
          
          <!-- 文章底部 -->
          <footer class="post-footer">
            <div class="post-info">
              <p><strong>LAST UPDATED:</strong> {{ formatDate(post.updatedAt) }}</p>
            </div>
            <div class="post-actions">
              <el-button class="action-btn" @click="goBack">
                <el-icon><ArrowLeft /></el-icon>
                RETURN
              </el-button>
              <el-button class="action-btn share-btn" @click="sharePost">
                <el-icon><Share /></el-icon>
                SHARE
              </el-button>
            </div>
          </footer>
        </div>
        
        <div v-else class="error-state">
          <el-result icon="warning" title="文章不存在" sub-title="您访问的文章可能已被删除或不存在">
            <template #extra>
              <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
            </template>
          </el-result>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { blogApi } from '@/api'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Calendar, 
  Folder, 
  View, 
  ArrowLeft, 
  Share 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import type { BlogPost } from '@/types/api'

const router = useRouter()
const route = useRoute()

const post = ref<BlogPost | null>(null)
const loading = ref(false)
const liking = ref(false)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
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

const toggleLike = async () => {
  if (!post.value || liking.value) return
  
  try {
    liking.value = true
    const data = await blogApi.likePost(post.value.id)
    
    // 更新本地状态
    if (post.value) {
      post.value.isLiked = data.liked
      post.value.likeCount += data.liked ? 1 : -1
    }
    
  } catch (error) {
    console.error('点赞失败:', error)
    // 显示错误提示
  } finally {
    liking.value = false
  }
}

const sharePost = () => {
  if (!post.value) return
  
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: post.value.summary,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

const renderMarkdown = (content: string) => {
  if (!content) return ''
  return marked(content)
}

const loadPost = async () => {
  const postId = route.params.id
  if (!postId) return
  
  try {
    loading.value = true
    const data = await blogApi.getPost(Number(postId))
    post.value = data
  } catch (error) {
    console.error('获取文章详情失败:', error)
    // 显示错误提示或跳转到404页面
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
:root {
  --main-blue: #3ec6e0;
  --main-blue-dark: #1a8fa6;
  --main-green: #7ee8fa;
  --main-glow: #a8ffeb;
}
.post-detail-container {
  padding-bottom: 40px;
}

/* 文章横幅 */
.post-banner {
  height: 50vh;
  min-height: 350px;
  max-height: 450px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,0.92) 60%, rgba(10,10,10,0.7) 90%, rgba(10,10,10,0.2) 100%);
}

.banner-content {
  z-index: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.category-link {
  background-color: var(--main-blue);
  color: white;
  padding: 5px 15px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  display: inline-block;
  margin-bottom: 15px;
}

.post-title-banner {
  font-size: 3.5rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, var(--main-blue), var(--main-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px var(--main-blue-dark);
}

.post-meta-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.post-meta-banner .meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 主要内容区域 */
.post-detail-content {
  max-width: 900px;
  margin: -60px auto 0;
  position: relative;
  z-index: 2;
}

.post-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(62,198,224,0.22), 0 2px 8px rgba(0,0,0,0.12);
  border: 2px solid var(--main-blue);
  padding: 30px;
  color: #222;
}

.loading :deep(.el-skeleton__item) {
  background: #333;
}

.post-content {
  padding-top: 20px;
}

.post-header, .post-footer {
  display: none; /* 隐藏旧的头部和尾部，信息已移到横幅和新尾部 */
}

/* 标签 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #444;
}

.tag-item {
  background: transparent;
  color: #a0a0a0;
  border: 1px solid #444;
  padding: 5px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background: var(--main-blue);
  border-color: var(--main-blue);
}

/* 文章正文 */
.post-main {
  line-height: 1.8;
  font-size: 1.1rem;
}

.post-excerpt blockquote {
  margin: 0 0 30px 0;
  padding: 20px;
  background: rgba(10, 10, 10, 0.5);
  border-left: 4px solid var(--main-blue);
  font-style: italic;
  color: #ccc;
}

.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}

.post-body :deep(p) {
  margin-bottom: 20px;
}

.post-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.post-body :deep(pre) {
  background: #f6f8fa;
  color: #222;
  border-radius: 10px;
  padding: 16px 18px;
  font-size: 1em;
  overflow-x: auto;
  box-shadow: 0 2px 12px rgba(62,198,224,0.08);
  margin-bottom: 24px;
}

.post-body code {
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 1em;
  color: #3ec6e0;
  background: none;
  padding: 0 2px;
}

.post-body pre code {
  color: #222;
  background: none;
  padding: 0;
}

/* 新的文章底部 */
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid #444;
}

.post-info p {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background-color: transparent;
  color: #ccc;
  border: 1px solid #444;
  font-weight: 600;
  text-transform: uppercase;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--main-blue);
}

.share-btn:hover {
  background-color: var(--main-blue);
}

.error-state :deep(.el-result__title h2),
.error-state :deep(.el-result__subtitle p) {
  color: #fff;
}

.post-body {
  color: #222;
  font-size: 1.15rem;
  line-height: 1.8;
}
</style> 