<template>
  <div class="tags">
    <div class="content-card">
      <h1>标签</h1>
      <div class="tags-content">
        <p v-if="loading">加载中...</p>
        <p v-else-if="tags.length === 0">暂无标签</p>
        <div v-else class="tags-cloud">
          <span
            class="tag-item"
            v-for="tag in tags"
            :key="tag.id"
            :style="{ backgroundColor: tag.color || '#f8f9fa', color: tag.color ? '#fff' : '#666' }"
          >
            {{ tag.name }}<span class="tag-count">({{ tag.postCount || 0 }})</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { blogApi } from '@/api'
import type { Tag } from '@/types/api'

const tags = ref<Tag[]>([])
const loading = ref(false)

const loadTags = async () => {
  loading.value = true
  try {
    const data = await blogApi.getTags()
    tags.value = data
  } catch (e) {
    tags.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadTags)
</script>

<style scoped>
.tags {
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

.tags-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.tag-item {
  background: #f8f9fa;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  display: inline-block;
}

.tag-item:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tag-count {
  font-size: 12px;
  margin-left: 4px;
  color: #fff;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tags {
    padding: 20px 15px;
  }
  
  .content-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .tags-content p {
    font-size: 1rem;
  }
  
  .tag-item {
    font-size: 13px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .tags-cloud {
    gap: 8px;
  }
}
</style> 