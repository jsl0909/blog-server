<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>欢迎回来，{{ authStore.user?.nickname || authStore.user?.username }}！</h1>
          <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
        </div>
        <div class="welcome-illustration">
          <div class="illustration-icon">🎉</div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <h2 class="section-title">数据概览</h2>
      <div class="stats-grid">
        <div class="stat-card posts">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.postCount || 0 }}</div>
            <div class="stat-label">文章总数</div>
            <div class="stat-trend">
              <span class="trend-icon">📈</span>
              <span class="trend-text">较上月增长 12%</span>
            </div>
          </div>
        </div>

        <div class="stat-card users">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.userCount || 0 }}</div>
            <div class="stat-label">用户总数</div>
            <div class="stat-trend">
              <span class="trend-icon">👥</span>
              <span class="trend-text">活跃用户 {{ stats.userCount || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card comments">
          <div class="stat-icon">
            <el-icon><ChatDotSquare /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.commentCount || 0 }}</div>
            <div class="stat-label">评论总数</div>
            <div class="stat-trend">
              <span class="trend-icon">💬</span>
              <span class="trend-text">今日新增 5 条</span>
            </div>
          </div>
        </div>

        <div class="stat-card categories">
          <div class="stat-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.categoryCount || 0 }}</div>
            <div class="stat-label">分类总数</div>
            <div class="stat-trend">
              <span class="trend-icon">📂</span>
              <span class="trend-text">内容分类完善</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions-section">
      <h2 class="section-title">快捷操作</h2>
      <div class="actions-grid">
        <div class="action-card" @click="$router.push('/admin/posts/create')">
          <div class="action-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="action-content">
            <h3>写文章</h3>
            <p>创建新的博客文章</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="action-card" @click="$router.push('/admin/posts')">
          <div class="action-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="action-content">
            <h3>管理文章</h3>
            <p>查看和编辑所有文章</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="action-card" @click="$router.push('/admin/categories')">
          <div class="action-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="action-content">
            <h3>分类管理</h3>
            <p>管理文章分类</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="action-card" @click="$router.push('/admin/comments')">
          <div class="action-icon">
            <el-icon><ChatDotSquare /></el-icon>
          </div>
          <div class="action-content">
            <h3>评论管理</h3>
            <p>审核和管理评论</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="action-card" @click="$router.push('/admin/users')" v-if="authStore.isSuperAdmin">
          <div class="action-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="action-content">
            <h3>用户管理</h3>
            <p>管理系统用户</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <div class="action-card" @click="$router.push('/admin/settings')" v-if="authStore.isSuperAdmin">
          <div class="action-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="action-content">
            <h3>系统设置</h3>
            <p>配置系统参数</p>
          </div>
          <div class="action-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity-section">
      <h2 class="section-title">最近活动</h2>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon">📝</div>
          <div class="activity-content">
            <div class="activity-title">新文章发布</div>
            <div class="activity-desc">《Vue3 组合式API最佳实践》已发布</div>
            <div class="activity-time">2小时前</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">💬</div>
          <div class="activity-content">
            <div class="activity-title">新评论</div>
            <div class="activity-desc">用户张三评论了《TypeScript入门指南》</div>
            <div class="activity-time">4小时前</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">👤</div>
          <div class="activity-content">
            <div class="activity-title">新用户注册</div>
            <div class="activity-desc">用户李四完成了注册</div>
            <div class="activity-time">6小时前</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Document, User, ChatDotSquare, Folder, EditPen, ArrowRight, Setting } from '@element-plus/icons-vue'
import { adminApi } from '@/api/admin'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()

const stats = ref({
  postCount: 0,
  userCount: 0,
  commentCount: 0,
  categoryCount: 0
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const loadStats = async () => {
  try {
    const response = await adminApi.getStats()
    stats.value = response as any
  } catch (error) {
    ElMessage.error('获取统计数据失败')
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
  console.log('Dashboard页面已加载')
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-text h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
}

.welcome-text p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.welcome-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-icon {
  font-size: 64px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 通用标题样式 */
.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* 统计卡片 */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-card.posts .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.users .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.comments .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.categories .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #27ae60;
}

.trend-icon {
  font-size: 14px;
}

/* 快捷操作 */
.quick-actions-section {
  margin-bottom: 40px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.action-content p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.action-arrow {
  color: #bdc3c7;
  transition: all 0.3s ease;
}

.action-card:hover .action-arrow {
  color: #667eea;
  transform: translateX(4px);
}

/* 最近活动 */
.recent-activity-section {
  margin-bottom: 40px;
}

.activity-list {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f8f9fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #bdc3c7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 0 16px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .welcome-text h1 {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card,
  .action-card {
    padding: 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style> 