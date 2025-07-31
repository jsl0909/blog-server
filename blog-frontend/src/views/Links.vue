<template>
  <div class="links">
    <div class="content-wrapper">
      <div class="links-header">
        <h1>友情链接</h1>
        <p>分享一些有用的资源和朋友们的博客</p>
      </div>
      
      <div class="links-grid">
        <div 
          v-for="link in links" 
          :key="link.id" 
          class="link-item"
        >
          <a :href="link.url" target="_blank" rel="noopener noreferrer" class="link-card">
            <div class="link-icon">
              <img :src="link.icon" :alt="link.name" @error="handleImageError" />
            </div>
            <div class="link-info">
              <h3>{{ link.name }}</h3>
              <p>{{ link.description }}</p>
              <span class="link-category">{{ link.category }}</span>
            </div>
            <div class="link-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 17l9.2-9.2M17 17V7H7"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Link {
  id: number
  name: string
  description: string
  url: string
  icon: string
  category: string
}

const links = ref<Link[]>([
  {
    id: 1,
    name: 'GitHub',
    description: '全球最大的代码托管平台',
    url: 'https://github.com',
    icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    category: '开发工具'
  },
  {
    id: 2,
    name: 'Stack Overflow',
    description: '程序员问答社区',
    url: 'https://stackoverflow.com',
    icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
    category: '学习资源'
  },
  {
    id: 3,
    name: 'MDN Web Docs',
    description: 'Web开发技术文档',
    url: 'https://developer.mozilla.org',
    icon: 'https://developer.mozilla.org/apple-touch-icon.png',
    category: '学习资源'
  },
  {
    id: 4,
    name: 'Vue.js',
    description: '渐进式JavaScript框架',
    url: 'https://vuejs.org',
    icon: 'https://vuejs.org/images/logo.png',
    category: '技术框架'
  },
  {
    id: 5,
    name: 'React',
    description: '用于构建用户界面的JavaScript库',
    url: 'https://reactjs.org',
    icon: 'https://reactjs.org/favicon.ico',
    category: '技术框架'
  },
  {
    id: 6,
    name: 'TypeScript',
    description: 'JavaScript的超集',
    url: 'https://www.typescriptlang.org',
    icon: 'https://www.typescriptlang.org/images/branding/logo.svg',
    category: '编程语言'
  },
  {
    id: 7,
    name: 'Node.js',
    description: 'JavaScript运行时环境',
    url: 'https://nodejs.org',
    icon: 'https://nodejs.org/static/images/logo.svg',
    category: '开发工具'
  },
  {
    id: 8,
    name: 'Docker',
    description: '容器化平台',
    url: 'https://www.docker.com',
    icon: 'https://www.docker.com/sites/default/files/d8/styles/logo-thumbnail/public/2019-07/Moby-logo.png',
    category: '开发工具'
  },
  {
    id: 9,
    name: 'CSS-Tricks',
    description: 'CSS技巧和教程',
    url: 'https://css-tricks.com',
    icon: 'https://css-tricks.com/apple-touch-icon.png',
    category: '学习资源'
  },
  {
    id: 10,
    name: 'Dev.to',
    description: '开发者社区',
    url: 'https://dev.to',
    icon: 'https://dev.to/assets/favicon-32x32.png',
    category: '学习资源'
  },
  {
    id: 11,
    name: 'Medium',
    description: '技术文章分享平台',
    url: 'https://medium.com',
    icon: 'https://medium.com/favicon.ico',
    category: '学习资源'
  },
  {
    id: 12,
    name: 'Unsplash',
    description: '高质量免费图片',
    url: 'https://unsplash.com',
    icon: 'https://unsplash.com/favicon.ico',
    category: '设计资源'
  }
])

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.links {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
}

.links-header {
  text-align: center;
  margin-bottom: 60px;
}

.links-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.links-header p {
  font-size: 1.125rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.link-item {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.link-item:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.link-card {
  display: flex;
  align-items: center;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  height: 100%;
  transition: all 0.3s ease;
}

.link-card:hover {
  background: #f8f9fa;
}

.link-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 20px;
  flex-shrink: 0;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.link-info p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #666;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-category {
  display: inline-block;
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.link-arrow {
  color: #ccc;
  margin-left: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.link-card:hover .link-arrow {
  color: #666;
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .links {
    padding: 20px 15px;
  }
  
  .links-header {
    margin-bottom: 40px;
  }
  
  .links-header h1 {
    font-size: 2rem;
  }
  
  .links-header p {
    font-size: 1rem;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .link-card {
    padding: 20px;
  }
  
  .link-icon {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
  
  .link-info h3 {
    font-size: 1rem;
  }
  
  .link-info p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .link-card {
    padding: 16px;
  }
  
  .link-icon {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  
  .link-info h3 {
    font-size: 0.95rem;
  }
  
  .link-info p {
    font-size: 0.85rem;
  }
}
</style> 