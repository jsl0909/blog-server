<template>
  <div class="categories">
    <div class="content-card">
      <h1>分类</h1>
      <div class="categories-content">
        <p v-if="loading">加载中...</p>
        <p v-else-if="categories.length === 0">暂无分类</p>
        <div v-else class="category-grid">
          <div class="category-item" v-for="cat in categories" :key="cat.id">
            <div class="cat-name">{{ cat.name }}</div>
            <div class="cat-desc" v-if="cat.description">{{ cat.description }}</div>
            <div class="cat-count">文章数：{{ cat.postCount || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { blogApi } from '@/api'
import type { Category } from '@/types/api'

const categories = ref<Category[]>([])
const loading = ref(false)

const loadCategories = async () => {
  loading.value = true
  try {
    const data = await blogApi.getCategories()
    categories.value = data
  } catch (e) {
    categories.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<style scoped>
.categories {
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
  max-width: 600px;
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

.categories-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.category-item {
  background: #f8f9fa;
  color: #666;
  padding: 20px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.category-item:hover {
  background: #333;
  color: #fff;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.cat-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 6px;
}

.cat-desc {
  font-size: 0.95em;
  color: #888;
  margin-bottom: 8px;
}

.cat-count {
  font-size: 0.9em;
  color: #aaa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories {
    padding: 20px 15px;
  }
  
  .content-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .categories-content p {
    font-size: 1rem;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .category-item {
    padding: 16px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 