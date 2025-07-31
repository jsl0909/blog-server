<template>
  <div class="admin-layout">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="sidebar-content">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo">
            <div class="logo-icon">⚙️</div>
            <div class="logo-text">
              <h3>管理后台</h3>
              <p>Blog Admin</p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/admin" class="nav-item" exact-active-class="active">
            <span class="nav-icon">📊</span>
            <span class="nav-text">仪表盘</span>
          </router-link>
          
          <div class="nav-group">
            <div class="nav-group-title">内容管理</div>
            <router-link to="/admin/posts" class="nav-item" active-class="active">
              <span class="nav-icon">📝</span>
              <span class="nav-text">文章管理</span>
            </router-link>
            <router-link to="/admin/posts/create" class="nav-item" active-class="active">
              <span class="nav-icon">✍️</span>
              <span class="nav-text">创建文章</span>
            </router-link>
            <router-link to="/admin/posts/upload-markdown" class="nav-item" active-class="active">
              <span class="nav-icon">📁</span>
              <span class="nav-text">上传Markdown</span>
            </router-link>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">分类标签</div>
            <router-link to="/admin/categories" class="nav-item" active-class="active">
              <span class="nav-icon">📂</span>
              <span class="nav-text">分类管理</span>
            </router-link>
            <router-link to="/admin/tags" class="nav-item" active-class="active">
              <span class="nav-icon">🏷️</span>
              <span class="nav-text">标签管理</span>
            </router-link>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">用户互动</div>
            <router-link to="/admin/comments" class="nav-item" active-class="active">
              <span class="nav-icon">💬</span>
              <span class="nav-text">评论管理</span>
            </router-link>
            <router-link to="/admin/users" class="nav-item" active-class="active" v-if="authStore.isSuperAdmin">
              <span class="nav-icon">👥</span>
              <span class="nav-text">用户管理</span>
            </router-link>
          </div>

          <div class="nav-group" v-if="authStore.isSuperAdmin">
            <div class="nav-group-title">系统设置</div>
            <router-link to="/admin/settings" class="nav-item" active-class="active">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">系统设置</span>
            </router-link>
          </div>
        </nav>

        <!-- 用户信息 -->
        <div class="user-section">
          <div class="user-info">
            <el-avatar :src="authStore.user?.avatar" :size="40">
              {{ authStore.user?.nickname || authStore.user?.username }}
            </el-avatar>
            <div class="user-details">
              <div class="username">{{ authStore.user?.nickname || authStore.user?.username }}</div>
              <div class="user-role">{{ authStore.isSuperAdmin ? '超级管理员' : '管理员' }}</div>
            </div>
          </div>
          <div class="user-actions">
            <el-button size="small" @click="goToFrontend">返回前台</el-button>
            <el-button size="small" type="danger" @click="logout">退出登录</el-button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>
        <div class="header-right">
          <el-button @click="goToFrontend" size="small">
            <el-icon><House /></el-icon>
            返回前台
          </el-button>
        </div>
      </header>

      <!-- 内容区域 -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import { House } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 当前页面标题
const currentPageTitle = computed(() => {
  return route.meta.title || '管理后台'
})

// 返回前台
const goToFrontend = () => {
  router.push('/')
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    authStore.logout()
    router.push('/auth/login')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 左侧导航栏 */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  flex: 1;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.logo-text p {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
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
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
}

/* 用户信息区域 */
.user-section {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.user-actions {
  display: flex;
  gap: 8px;
}

.user-actions .el-button {
  flex: 1;
  font-size: 12px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部导航栏 */
.top-header {
  background: white;
  padding: 20px 32px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
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
  }
  
  .top-header {
    padding: 16px 20px;
  }
  
  .content-area {
    padding: 20px;
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style> 