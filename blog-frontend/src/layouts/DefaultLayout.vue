<template>
  <div class="layout">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <!-- Logo区域 -->
        <div class="logo-section">
          <router-link to="/" class="logo">
            <div class="logo-icon">📖</div>
          </router-link>
        </div>

        <!-- 主导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-item" exact-active-class="active">
            <span class="nav-text">Home</span>
          </router-link>
          <router-link to="/posts" class="nav-item" active-class="active">
            <span class="nav-text">View Blog</span>
          </router-link>
          <router-link to="/categories" class="nav-item" active-class="active">
            <span class="nav-text">Categories</span>
          </router-link>
          <router-link to="/tags" class="nav-item" active-class="active">
            <span class="nav-text">Tags</span>
          </router-link>
          <router-link to="/about" class="nav-item" active-class="active">
            <span class="nav-text">About</span>
          </router-link>
          <router-link to="/profile" class="nav-item" active-class="active">
            <span class="nav-text">Journals</span>
          </router-link>
          <router-link to="/photos" class="nav-item" active-class="active">
            <span class="nav-text">Photos</span>
          </router-link>
          <router-link to="/links" class="nav-item" active-class="active">
            <span class="nav-text">Links</span>
          </router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="search-section">
          <el-input 
            v-model="searchQuery" 
            placeholder="Search" 
            class="search-input"
            size="small"
          >
            <template #suffix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 用户信息区域 -->
        <div class="user-section" v-if="authStore.isAuthenticated">
          <el-dropdown @command="handleCommand" placement="top-start">
            <div class="user-info">
              <el-avatar :src="authStore.user?.avatar" :size="32">
                {{ authStore.user?.nickname || authStore.user?.username }}
              </el-avatar>
              <span class="username">{{ authStore.user?.nickname || authStore.user?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="admin" v-if="authStore.isAdmin">后台管理</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 登录/注册按钮 -->
        <div class="auth-section" v-else>
          <router-link to="/auth/login" class="auth-btn">登录</router-link>
          <router-link to="/auth/register" class="auth-btn">注册</router-link>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="sidebar-footer">
        <p>&copy; 2022 Kent Liao</p>
        <p>Powered by Halo & Daisy</p>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>

    <!-- 右下角语言切换按钮 -->
    <div class="language-switcher">
      <el-button circle size="large" class="lang-btn" @click="toggleLanguage">
        {{ currentLang }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
const currentLang = ref('中')

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
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 左侧导航栏 */
.sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-content {
  flex: 1;
  padding: 40px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.logo-section {
  text-align: center;
}

.logo {
  display: inline-block;
  text-decoration: none;
}

.logo-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.logo-icon:hover {
  background: #e8e8e8;
  transform: scale(1.05);
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: block;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background: #f0f0f0;
  color: #333;
  font-weight: 600;
}

.nav-text {
  font-size: 15px;
}

/* 搜索区域 */
.search-section {
  margin-top: 8px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #f8f9fa;
  border: none;
  box-shadow: none;
}

.search-input :deep(.el-input__inner) {
  color: #666;
  font-size: 14px;
}

.search-icon {
  color: #999;
}

/* 用户信息区域 */
.user-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-info:hover {
  background: #f8f9fa;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 登录注册按钮 */
.auth-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-btn {
  display: block;
  text-align: center;
  padding: 10px 16px;
  background: #f8f9fa;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.auth-btn:hover {
  background: #e9ecef;
  color: #333;
}

/* 底部版权 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.sidebar-footer p {
  margin: 4px 0;
  font-size: 12px;
  color: #999;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
}

/* 右下角语言切换 */
.language-switcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
}

.lang-btn {
  width: 56px;
  height: 56px;
  background: #ff69b4;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
}

.lang-btn:hover {
  background: #ff1493;
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 260px;
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
  
  .language-switcher {
    bottom: 16px;
    right: 16px;
  }
  
  .lang-btn {
    width: 48px;
    height: 48px;
    font-size: 14px;
  }
}
</style> 