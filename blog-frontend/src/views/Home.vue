<template>
  <div class="home">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <!-- 头像 -->
      <div class="avatar-section">
        <div class="avatar">
          <img src="/avatar.png" alt="Kent Liao" @error="handleImageError" />
          <div class="avatar-placeholder" v-show="imageError">KL</div>
        </div>
      </div>

      <!-- 个人信息 -->
      <div class="info-section">
        <h1 class="name">Kent Liao</h1>
        <p class="bio">
          I'm an software engineer who constantly seeks out innovative solutions to 
          everyday problems.
        </p>
      </div>

      <!-- 社交图标 -->
      <div class="social-section">
        <a href="https://github.com" class="social-icon" title="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="mailto:contact@example.com" class="social-icon" title="Email">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636C.732 21.002 0 20.27 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.454-6.269h.91c.904 0 1.636.732 1.636 1.636z"/>
          </svg>
        </a>
        <a href="/rss" class="social-icon" title="RSS">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
          </svg>
        </a>
        <a href="mailto:contact@example.com" class="social-icon" title="Contact">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 480px;
  width: 100%;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.avatar-section {
  margin-bottom: 32px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #f5f5f5;
  position: absolute;
  top: 0;
  left: 0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  position: absolute;
  top: 0;
  left: 0;
}

.info-section {
  margin-bottom: 32px;
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.bio {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #666;
  max-width: 360px;
  margin: 0 auto;
}

.social-section {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f8f9fa;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.social-icon:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home {
    padding: 20px 15px;
  }
  
  .profile-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .name {
    font-size: 2rem;
  }
  
  .bio {
    font-size: 1rem;
  }
  
  .social-icon {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 30px 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .name {
    font-size: 1.75rem;
  }
  
  .social-section {
    gap: 12px;
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
  }
}
</style> 