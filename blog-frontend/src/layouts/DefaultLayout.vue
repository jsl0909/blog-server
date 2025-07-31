<template>
  <div class="layout">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <!-- 用户头像区域 -->
        <div class="user-avatar-section">
          <el-dropdown 
            v-if="authStore.isAuthenticated" 
            @command="handleCommand"
            trigger="click"
            placement="bottom-start"
          >
            <div class="avatar-container">
              <el-avatar 
                :src="authStore.user?.avatar || '/avatar.png'" 
                :size="64"
                @error="handleAvatarError"
                class="clickable-avatar"
              >
                {{ authStore.user?.nickname || authStore.user?.username || 'KL' }}
              </el-avatar>
              <div class="avatar-status" :class="{ 'online': authStore.isAuthenticated }"></div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="admin" v-if="authStore.isAdmin">
                  <el-icon><Setting /></el-icon>
                  后台管理
                </el-dropdown-item>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div v-else class="avatar-container">
            <el-avatar 
              :src="authStore.user?.avatar || '/avatar.png'" 
              :size="64"
              @error="handleAvatarError"
            >
              {{ authStore.user?.nickname || authStore.user?.username || 'KL' }}
            </el-avatar>
            <div class="avatar-status" :class="{ 'online': authStore.isAuthenticated }"></div>
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ authStore.user?.nickname || authStore.user?.username || 'Kent Liao' }}</h3>
            <p class="user-title">{{ authStore.isAuthenticated ? '已登录' : '访客模式' }}</p>
          </div>
        </div>

        <!-- 快速导航 -->
        <nav class="nav-menu">
          <div class="nav-group">
            <div class="nav-group-title">快速导航</div>
            <router-link to="/" class="nav-item" exact-active-class="active">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">首页</span>
            </router-link>
            <router-link to="/edit" class="nav-item" active-class="active" v-if="authStore.isAuthenticated">
              <span class="nav-icon">✍️</span>
              <span class="nav-text">写文章</span>
            </router-link>
            <router-link to="/admin" class="nav-item" active-class="active" v-if="authStore.isAdmin">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">管理后台</span>
            </router-link>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">内容浏览</div>
            <router-link to="/posts" class="nav-item" active-class="active">
              <span class="nav-icon">📝</span>
              <span class="nav-text">文章列表</span>
            </router-link>
            <router-link to="/categories" class="nav-item" active-class="active">
              <span class="nav-icon">📂</span>
              <span class="nav-text">分类浏览</span>
            </router-link>
            <router-link to="/tags" class="nav-item" active-class="active">
              <span class="nav-icon">🏷️</span>
              <span class="nav-text">标签云</span>
            </router-link>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">个人空间</div>
            <router-link to="/about" class="nav-item" active-class="active">
              <span class="nav-icon">👤</span>
              <span class="nav-text">关于我</span>
            </router-link>
            <router-link to="/profile" class="nav-item" active-class="active">
              <span class="nav-icon">📔</span>
              <span class="nav-text">个人日志</span>
            </router-link>
            <router-link to="/photos" class="nav-item" active-class="active">
              <span class="nav-icon">📸</span>
              <span class="nav-text">相册</span>
            </router-link>
            <router-link to="/links" class="nav-item" active-class="active">
              <span class="nav-icon">🔗</span>
              <span class="nav-text">友情链接</span>
            </router-link>
          </div>
        </nav>

        <!-- 搜索框 -->
        <div class="search-section">
          <div class="search-wrapper">
            <el-input 
              v-model="searchQuery" 
              placeholder="搜索文章..." 
              class="search-input"
              size="large"
              @keyup.enter="handleSearch"
              @input="handleSearchInput"
            >
              <template #prefix>
                <el-icon class="search-icon"><Search /></el-icon>
              </template>
              <template #suffix>
                <el-icon 
                  v-if="searchQuery" 
                  class="clear-icon" 
                  @click="clearSearch"
                >
                  <Close />
                </el-icon>
              </template>
            </el-input>
          </div>
          
          <!-- 搜索建议 -->
          <div v-if="showSearchSuggestions && searchSuggestions.length > 0" class="search-suggestions">
            <div 
              v-for="suggestion in searchSuggestions" 
              :key="suggestion.id"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
            >
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-excerpt">{{ suggestion.excerpt }}</div>
            </div>
          </div>
        </div>

        <!-- 用户操作区域 -->
        <div class="user-actions" v-if="authStore.isAuthenticated">
          <el-dropdown @command="handleCommand" placement="top-start">
            <div class="user-menu-trigger">
              <el-icon><Setting /></el-icon>
              <span>用户菜单</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="admin" v-if="authStore.isAdmin">
                  <el-icon><Setting /></el-icon>
                  后台管理
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 登录/注册按钮 -->
        <div class="auth-section" v-else>
          <router-link to="/auth/login" class="auth-btn login-btn">
            <el-icon><User /></el-icon>
            登录
          </router-link>
          <router-link to="/auth/register" class="auth-btn register-btn">
            <el-icon><UserFilled /></el-icon>
            注册
          </router-link>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="sidebar-footer">
        <div class="footer-content">
          <p class="copyright">&copy; 2024 Kent Liao</p>
          <p class="powered-by">Powered by Vue3 & NestJS</p>
          <div class="footer-links">
            <a href="#" class="footer-link">隐私政策</a>
            <span class="separator">·</span>
            <a href="#" class="footer-link">使用条款</a>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <!-- 右下角浮动按钮 -->
    <div class="floating-actions">
      <!-- 语言切换按钮 -->
      <el-button circle size="large" class="action-btn lang-btn" @click="toggleLanguage">
        {{ currentLang }}
      </el-button>
      
      <!-- 返回顶部按钮 -->
      <el-button circle size="large" class="action-btn back-to-top" @click="scrollToTop" v-show="showBackToTop">
        <el-icon><Top /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Search, ArrowDown, User, Setting, SwitchButton, UserFilled, Top, Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
const currentLang = ref('中')
const showBackToTop = ref(false)
const showSearchSuggestions = ref(false)
const searchSuggestions = ref<any[]>([])

// 模拟搜索数据
const mockPosts = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 详解',
    excerpt: '深入理解 Vue 3 的组合式 API，掌握现代前端开发的核心概念...'
  },
  {
    id: 2,
    title: 'TypeScript 高级类型',
    excerpt: '学习 TypeScript 的高级类型系统，提升代码的类型安全性...'
  },
  {
    id: 3,
    title: 'NestJS 微服务架构',
    excerpt: '使用 NestJS 构建可扩展的微服务架构，实现高并发应用...'
  },
  {
    id: 4,
    title: '前端性能优化实践',
    excerpt: '从多个维度优化前端应用性能，提升用户体验...'
  },
  {
    id: 5,
    title: 'Docker 容器化部署',
    excerpt: '使用 Docker 实现应用的容器化部署，简化运维流程...'
  }
]

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      authStore.logout()
      router.push('/')
      break
  }
}

const toggleLanguage = () => {
  currentLang.value = currentLang.value === '中' ? 'EN' : '中'
  // 这里可以添加实际的语言切换逻辑
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/posts',
      query: { search: searchQuery.value.trim() }
    })
    showSearchSuggestions.value = false
  }
}

const handleSearchInput = () => {
  if (searchQuery.value.trim()) {
    // 模拟搜索建议
    const query = searchQuery.value.toLowerCase()
    searchSuggestions.value = mockPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query)
    ).slice(0, 5)
    showSearchSuggestions.value = true
  } else {
    showSearchSuggestions.value = false
    searchSuggestions.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  showSearchSuggestions.value = false
  searchSuggestions.value = []
}

const selectSuggestion = (suggestion: any) => {
  searchQuery.value = suggestion.title
  showSearchSuggestions.value = false
  router.push(`/posts/${suggestion.id}`)
}



const handleAvatarError = () => {
  // 头像加载失败时的处理
  console.log('Avatar load failed, using fallback')
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 左侧导航栏 */
.sidebar {
  width: 300px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  flex: 1;
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 用户头像区域 */
.user-avatar-section {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.clickable-avatar {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-avatar:hover {
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

:deep(.el-dropdown-menu__item.is-divided) {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  padding-top: 16px;
}

.avatar-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.avatar-status.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

.user-info {
  text-align: center;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.user-title {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 导航菜单 */
.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-group-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding-left: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
}

/* 搜索区域 */
.search-section {
  margin-top: 16px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.3);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.search-input :deep(.el-input__inner) {
  color: white;
  font-size: 14px;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.search-icon {
  color: rgba(255, 255, 255, 0.7);
}

.clear-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-icon:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* 搜索建议 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #f0f0f0;
  margin-top: 8px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background 0.2s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.suggestion-excerpt {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 用户操作区域 */
.user-actions {
  margin-top: 24px;
  padding: 12px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.user-menu-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

/* 登录注册按钮 */
.auth-section {
  margin-top: 16px;
  padding: 12px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.register-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

/* 底部版权 */
.sidebar-footer {
  margin-top: auto;
  padding: 20px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.15);
}

.footer-content {
  text-align: center;
}

.copyright {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.powered-by {
  margin: 0 0 12px 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 11px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 300px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 900px;
}

/* 浮动按钮 */
.floating-actions {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 56px;
  height: 56px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.lang-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.lang-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #d84315 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.back-to-top {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.back-to-top:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
    padding: 20px 15px;
  }
  
  .content-wrapper {
    max-width: 100%;
  }
  
  .floating-actions {
    bottom: 16px;
    right: 16px;
  }
  
  .action-btn {
    width: 48px;
    height: 48px;
    font-size: 14px;
  }
}
</style> 