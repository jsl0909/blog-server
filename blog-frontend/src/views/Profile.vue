<template>
  <div class="profile">
    <div class="content-card">
      <h1>个人日志</h1>
      <div class="profile-content">
        <p>这里是我的个人日志页面，记录一些日常思考和生活感悟。</p>
        <div class="journal-list">
          <div class="journal-item">
            <div class="journal-date">2024.01.15</div>
            <div class="journal-title">新年新计划</div>
            <div class="journal-excerpt">新的一年开始了，制定一些技术学习和个人成长的计划...</div>
          </div>
          <div class="journal-item">
            <div class="journal-date">2024.01.10</div>
            <div class="journal-title">技术思考</div>
            <div class="journal-excerpt">最近在思考前端架构设计的一些问题，记录一下心得...</div>
          </div>
          <div class="journal-item">
            <div class="journal-date">2024.01.05</div>
            <div class="journal-title">生活感悟</div>
            <div class="journal-excerpt">工作与生活的平衡是一个永恒的话题，今天有一些新的感悟...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Profile page logic
</script>

<style scoped>
.profile {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 700px;
  width: 100%;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.profile-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.journal-item {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.journal-item:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.journal-date {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.journal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.journal-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile {
    padding: 20px 15px;
  }
  
  .content-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .profile-content p {
    font-size: 1rem;
  }
  
  .journal-item {
    padding: 20px;
  }
  
  .journal-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .journal-item {
    padding: 16px;
  }
}
</style> 