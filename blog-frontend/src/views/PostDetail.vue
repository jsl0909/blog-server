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
          <!-- 文章状态标识 -->
          <span 
            v-if="post.status !== 'PUBLISHED'" 
            class="post-status-banner"
            :class="post.status.toLowerCase()"
          >
            {{ getStatusText(post.status) }}
          </span>
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
              <!-- 编辑按钮 - 只有作者或管理员才能看到 -->
              <el-button 
                v-if="canEdit" 
                class="action-btn edit-btn" 
                @click="editPost"
              >
                <el-icon><EditPen /></el-icon>
                编辑
              </el-button>
            </div>
          </footer>
          
          <!-- 评论区域 -->
          <div class="comments-section">
            <h3 class="comments-title">评论 ({{ comments.length }})</h3>
            
            <!-- 发表评论 -->
            <div v-if="authStore.isAuthenticated" class="comment-form">
              <el-input
                v-model="newComment"
                type="textarea"
                :rows="3"
                placeholder="写下你的评论..."
                maxlength="500"
                show-word-limit
              />
              <div class="comment-form-actions">
                <el-button 
                  type="primary" 
                  @click="submitComment"
                  :loading="submittingComment"
                  :disabled="!newComment.trim()"
                >
                  发表评论
                </el-button>
              </div>
            </div>
            
            <!-- 未登录提示 -->
            <div v-else class="login-prompt">
              <p>请 <router-link to="/auth/login">登录</router-link> 后发表评论</p>
            </div>
            
            <!-- 评论列表 -->
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id" 
                class="comment-item"
              >
                <div class="comment-header">
                  <div class="comment-author">
                    <el-avatar :size="32" :src="comment.author?.avatar">
                      {{ comment.author?.nickname || comment.author?.username }}
                    </el-avatar>
                    <div class="author-info">
                      <div class="author-name">
                        {{ comment.author?.nickname || comment.author?.username }}
                      </div>
                      <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
                    </div>
                  </div>
                  <div class="comment-actions" v-if="canEditComment(comment)">
                    <el-button 
                      size="small" 
                      type="text" 
                      @click="editComment(comment)"
                    >
                      编辑
                    </el-button>
                    <el-button 
                      size="small" 
                      type="text" 
                      @click="deleteComment(comment.id)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                <div class="comment-content">
                  <div v-if="editingCommentId === comment.id" class="comment-edit">
                    <el-input
                      v-model="comment.content"
                      type="textarea"
                      :rows="2"
                    />
                    <div class="edit-actions">
                      <el-button size="small" @click="cancelEdit">取消</el-button>
                      <el-button size="small" type="primary" @click="saveEdit">保存</el-button>
                    </div>
                  </div>
                  <div v-else class="comment-text">{{ comment.content }}</div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="comments.length === 0" class="no-comments">
                <p>暂无评论，快来发表第一条评论吧！</p>
              </div>
            </div>
          </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { blogApi } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { 
  User, 
  Calendar, 
  Folder, 
  View, 
  ArrowLeft, 
  Share,
  EditPen
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import type { BlogPost } from '@/types/api'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const post = ref<BlogPost | null>(null)
const loading = ref(false)
const liking = ref(false)
const comments = ref<any[]>([])
const newComment = ref('')
const submittingComment = ref(false)
const editingCommentId = ref<number | null>(null)

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    content: '这篇文章写得很好，对我很有帮助！',
    createdAt: '2024-01-15T10:30:00Z',
    author: {
      id: 2,
      username: 'reader1',
      nickname: '技术爱好者',
      avatar: ''
    }
  },
  {
    id: 2,
    content: '感谢分享，学到了很多新知识。',
    createdAt: '2024-01-14T15:20:00Z',
    author: {
      id: 3,
      username: 'reader2',
      nickname: '前端开发者',
      avatar: ''
    }
  }
]

// 计算属性：是否可以编辑文章
const canEdit = computed(() => {
  if (!authStore.isAuthenticated || !post.value) return false
  
  // 管理员可以编辑所有文章
  if (authStore.isAdmin) return true
  
  // 作者可以编辑自己的文章
  return post.value.author?.id === authStore.user?.id
})

// 编辑文章
const editPost = () => {
  if (!post.value) return
  router.push(`/edit/${post.value.id}`)
}

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

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'ARCHIVED': '已归档'
  }
  return statusMap[status] || status
}

const loadPost = async () => {
  const postId = route.params.id
  if (!postId || isNaN(Number(postId))) {
    ElMessage.error('无效的文章ID，无法预览')
    router.push('/posts')
    return
  }
  try {
    loading.value = true
    const data = await blogApi.getPost(Number(postId))
    if (!data || !data.id) {
      ElMessage.error('文章不存在或已被删除')
      router.push('/posts')
      return
    }
    post.value = data
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
    router.push('/posts')
  } finally {
    loading.value = false
  }
}

// 评论相关方法
const submitComment = async () => {
  if (!newComment.value.trim() || !post.value) return
  
  try {
    submittingComment.value = true
    // 模拟提交评论
    const comment = {
      id: Date.now(),
      content: newComment.value,
      createdAt: new Date().toISOString(),
      author: {
        id: authStore.user?.id,
        username: authStore.user?.username,
        nickname: authStore.user?.nickname,
        avatar: authStore.user?.avatar
      }
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
    ElMessage.success('评论发表成功')
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('发表评论失败')
  } finally {
    submittingComment.value = false
  }
}

const canEditComment = (comment: any) => {
  if (!authStore.isAuthenticated) return false
  if (authStore.isAdmin) return true
  return comment.author?.id === authStore.user?.id
}

const editComment = (comment: any) => {
  editingCommentId.value = comment.id
}

const deleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '确认删除', {
      type: 'warning'
    })
    
    const index = comments.value.findIndex(c => c.id === commentId)
    if (index > -1) {
      comments.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const cancelEdit = () => {
  editingCommentId.value = null
}

const saveEdit = () => {
  editingCommentId.value = null
  ElMessage.success('评论更新成功')
}

onMounted(() => {
  loadPost()
  // 加载评论数据
  comments.value = [...mockComments]
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

.post-status-banner {
  display: inline-block;
  padding: 4px 10px;
  margin-left: 12px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-status-banner.draft {
  background: rgba(255, 193, 7, 0.9);
  color: #856404;
}

.post-status-banner.archived {
  background: rgba(220, 53, 69, 0.9);
  color: white;
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

/* 评论区域样式 */
.comments-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.comment-form {
  margin-bottom: 32px;
}

.comment-form-actions {
  margin-top: 16px;
  text-align: right;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.login-prompt a {
  color: var(--main-blue);
  text-decoration: none;
  font-weight: 600;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.comment-date {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment-item:hover .comment-actions {
  opacity: 1;
}

.comment-content {
  margin-top: 8px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.comment-edit {
  margin-top: 12px;
}

.edit-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-comments p {
  font-size: 16px;
  margin: 0;
}

/* 文章正文 - Typora风格优化 */
.post-main {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
  max-width: 800px;
  margin: 0 auto;
}

.post-excerpt blockquote {
  margin: 0 0 30px 0;
  padding: 20px 24px;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  font-style: italic;
  color: #6c757d;
  border-radius: 0 8px 8px 0;
}

/* 标题样式 - Typora风格 */
.post-body :deep(h1) {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 2rem 0 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  line-height: 1.3;
}

.post-body :deep(h2) {
  font-size: 1.8rem;
  font-weight: 600;
  color: #34495e;
  margin: 1.8rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #e9ecef;
  line-height: 1.4;
}

.post-body :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #34495e;
  margin: 1.5rem 0 0.8rem;
  line-height: 1.4;
}

.post-body :deep(h4) {
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin: 1.2rem 0 0.6rem;
  line-height: 1.4;
}

.post-body :deep(h5) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #34495e;
  margin: 1rem 0 0.5rem;
  line-height: 1.4;
}

.post-body :deep(h6) {
  font-size: 1rem;
  font-weight: 600;
  color: #34495e;
  margin: 0.8rem 0 0.4rem;
  line-height: 1.4;
}

/* 段落样式 */
.post-body :deep(p) {
  margin-bottom: 1.2rem;
  line-height: 1.8;
  color: #2c3e50;
}

/* 图片样式 */
.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin: 1.5rem 0;
}

/* 代码块样式 - Typora风格 */
.post-body :deep(pre) {
  background: #f8f9fa;
  color: #2c3e50;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  font-size: 0.9rem;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 1.5rem 0;
  border: 1px solid #e9ecef;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
}

/* 行内代码样式 */
.post-body :deep(code) {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
  font-size: 0.9em;
  color: #e74c3c;
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.post-body :deep(pre code) {
  color: #2c3e50;
  background: none;
  padding: 0;
  border: none;
}

/* 列表样式 */
.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.post-body :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.post-body :deep(ul li) {
  list-style-type: disc;
  color: #2c3e50;
}

.post-body :deep(ol li) {
  list-style-type: decimal;
  color: #2c3e50;
}

/* 引用样式 */
.post-body :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 0 8px 8px 0;
  color: #6c757d;
  font-style: italic;
}

/* 表格样式 */
.post-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-body :deep(th),
.post-body :deep(td) {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.post-body :deep(th) {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.post-body :deep(td) {
  color: #2c3e50;
}

.post-body :deep(tr:hover) {
  background: #f8f9fa;
}

/* 分割线样式 */
.post-body :deep(hr) {
  border: none;
  height: 1px;
  background: #e9ecef;
  margin: 2rem 0;
}

/* 链接样式 */
.post-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.post-body :deep(a:hover) {
  color: #5a6fd8;
  border-bottom-color: #5a6fd8;
}

/* 强调样式 */
.post-body :deep(strong) {
  font-weight: 600;
  color: #2c3e50;
}

.post-body :deep(em) {
  font-style: italic;
  color: #2c3e50;
}

/* 删除线样式 */
.post-body :deep(del) {
  color: #6c757d;
  text-decoration: line-through;
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

.edit-btn {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.edit-btn:hover {
  background-color: #0056b3;
  border-color: #0056b3;
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