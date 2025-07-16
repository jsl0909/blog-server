<template>
  <div class="dashboard">
    <div class="welcome-section">
      <h1>仪表盘</h1>
      <p>欢迎来到博客后台管理系统！</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-icon posts">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.postCount || 0 }}</div>
                <div class="stat-label">文章总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-icon users">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.userCount || 0 }}</div>
                <div class="stat-label">用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-icon comments">
                <el-icon><ChatDotSquare /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.commentCount || 0 }}</div>
                <div class="stat-label">评论总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <div class="stat-icon categories">
                <el-icon><Folder /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.categoryCount || 0 }}</div>
                <div class="stat-label">分类总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="action-card" @click="$router.push('/admin/posts/create')">
            <div class="action-item">
              <el-icon class="action-icon"><EditPen /></el-icon>
              <div class="action-text">写文章</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="$router.push('/admin/posts')">
            <div class="action-item">
              <el-icon class="action-icon"><Document /></el-icon>
              <div class="action-text">管理文章</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="$router.push('/admin/users')">
            <div class="action-item">
              <el-icon class="action-icon"><User /></el-icon>
              <div class="action-text">管理用户</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="$router.push('/admin/comments')">
            <div class="action-item">
              <el-icon class="action-icon"><ChatDotSquare /></el-icon>
              <div class="action-text">管理评论</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document, User, ChatDotSquare, Folder, EditPen } from '@element-plus/icons-vue'
import { adminApi } from '@/api/admin'
import { ElMessage } from 'element-plus'

const stats = ref({
  postCount: 0,
  userCount: 0,
  commentCount: 0,
  categoryCount: 0
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
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-section h1 {
  color: #303133;
  margin-bottom: 8px;
}

.welcome-section p {
  color: #606266;
  font-size: 14px;
}

.stats-cards {
  margin-bottom: 40px;
}

.stat-card {
  cursor: default;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
  color: white;
}

.stat-icon.posts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.comments {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.categories {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.quick-actions h2 {
  color: #303133;
  margin-bottom: 20px;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.action-icon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 10px;
}

.action-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}
</style> 