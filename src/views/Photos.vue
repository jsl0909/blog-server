<template>
  <div class="photos">
    <div class="content-wrapper">
      <div class="photos-header">
        <h1>相册</h1>
        <p>记录生活中的美好瞬间</p>
      </div>
      
      <div class="photos-grid">
        <div 
          v-for="photo in photos" 
          :key="photo.id" 
          class="photo-item"
          @click="openPhoto(photo)"
        >
          <div class="photo-image">
            <img :src="photo.thumbnail" :alt="photo.title" />
          </div>
          <div class="photo-info">
            <h3>{{ photo.title }}</h3>
            <p>{{ photo.description }}</p>
            <span class="photo-date">{{ formatDate(photo.date) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 照片查看器 -->
      <div v-if="selectedPhoto" class="photo-viewer" @click="closePhoto">
        <div class="photo-viewer-content" @click.stop>
          <button class="close-btn" @click="closePhoto">×</button>
          <img :src="selectedPhoto.fullSize" :alt="selectedPhoto.title" />
          <div class="photo-details">
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.description }}</p>
            <span>{{ formatDate(selectedPhoto.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Photo {
  id: number
  title: string
  description: string
  thumbnail: string
  fullSize: string
  date: string
}

const selectedPhoto = ref<Photo | null>(null)

const photos = ref<Photo[]>([
  {
    id: 1,
    title: '日落时分',
    description: '黄昏时分的美丽日落，天空被染成金黄色',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    date: '2024-01-15T18:30:00Z'
  },
  {
    id: 2,
    title: '城市夜景',
    description: '繁华都市的璀璨夜景，灯火辉煌',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
    date: '2024-01-12T20:15:00Z'
  },
  {
    id: 3,
    title: '自然风光',
    description: '青山绿水，自然的美丽风光',
    thumbnail: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=800&fit=crop',
    date: '2024-01-10T14:20:00Z'
  },
  {
    id: 4,
    title: '海边风景',
    description: '碧海蓝天，海浪拍打着海岸',
    thumbnail: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop',
    date: '2024-01-08T16:45:00Z'
  },
  {
    id: 5,
    title: '森林小径',
    description: '林间小路，阳光透过树叶洒下斑驳的光影',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
    date: '2024-01-05T11:30:00Z'
  },
  {
    id: 6,
    title: '星空银河',
    description: '夜空中闪烁的星河，令人震撼的宇宙景象',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=800&fit=crop',
    date: '2024-01-03T23:00:00Z'
  }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openPhoto = (photo: Photo) => {
  selectedPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

const closePhoto = () => {
  selectedPhoto.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.photos {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
}

.photos-header {
  text-align: center;
  margin-bottom: 60px;
}

.photos-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.photos-header p {
  font-size: 1.125rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
}

.photo-item {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.photo-item:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.photo-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.photo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover .photo-image img {
  transform: scale(1.05);
}

.photo-info {
  padding: 24px;
}

.photo-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.photo-info p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
}

.photo-date {
  font-size: 14px;
  color: #999;
}

/* 照片查看器 */
.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.photo-viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.photo-viewer-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.photo-details {
  padding: 24px;
  text-align: center;
}

.photo-details h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.photo-details p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;
}

.photo-details span {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photos {
    padding: 20px 15px;
  }
  
  .photos-header {
    margin-bottom: 40px;
  }
  
  .photos-header h1 {
    font-size: 2rem;
  }
  
  .photos-header p {
    font-size: 1rem;
  }
  
  .photos-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .photo-image {
    height: 200px;
  }
  
  .photo-info {
    padding: 20px;
  }
  
  .photo-viewer {
    padding: 10px;
  }
  
  .photo-viewer-content img {
    max-height: 60vh;
  }
  
  .photo-details {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .photos-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .photo-info {
    padding: 16px;
  }
  
  .photo-info h3 {
    font-size: 1.125rem;
  }
  
  .photo-info p {
    font-size: 0.95rem;
  }
}
</style> 