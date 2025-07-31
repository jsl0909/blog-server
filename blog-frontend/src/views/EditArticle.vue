<template>
  <div class="edit-article-page">
    <div class="edit-container">
      <!-- 文章标题 -->
      <div class="title-section">
        <label class="required-label">* 文章标题</label>
        <div class="title-input-wrapper">
          <input 
            v-model="articleTitle" 
            type="text" 
            class="title-input"
            placeholder="请输入文章标题"
            maxlength="100"
          />
          <span class="char-count">{{ articleTitle.length }} / 100</span>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="content-section">
        <label class="required-label">* 文章内容</label>
        <RichEditor v-model="articleContent" />
      </div>

      <!-- 文章摘要 -->
      <div class="summary-section">
        <label>文章摘要</label>
        <div class="summary-input-wrapper">
          <textarea 
            v-model="articleSummary" 
            class="summary-input"
            placeholder="请输入文章摘要,留空则自动生成"
            maxlength="200"
            rows="3"
          ></textarea>
          <span class="char-count">{{ articleSummary.length }} / 200</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="saveDraft" class="btn btn-secondary" :disabled="isSaving">
          {{ isSaving ? '保存中...' : '保存草稿' }}
        </button>
        <button @click="publishArticle" class="btn btn-primary" :disabled="isSaving || !canPublish">
          {{ isSaving ? '发布中...' : '发布文章' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import RichEditor from '@/components/RichEditor.vue'
import { postsApi, type CreatePostDto, type UpdatePostDto } from '@/api/posts'

const router = useRouter()
const route = useRoute()

// 响应式数据
const articleTitle = ref('')
const articleContent = ref('')
const articleSummary = ref('')
const isSaving = ref(false)
const isEditMode = ref(false)
const postId = ref<number | null>(null)

// 计算属性
const canPublish = computed(() => {
  return articleTitle.value.trim() && articleContent.value.trim()
})

// 初始化
onMounted(async () => {
  const id = route.params.id
  if (id && id !== 'create') {
    isEditMode.value = true
    postId.value = Number(id)
    await loadPost()
  }
})

// 加载文章
const loadPost = async () => {
  try {
    if (!postId.value) return
    
    const response = await postsApi.getById(postId.value)
    const post = response.data
    
    articleTitle.value = post.title
    articleContent.value = post.content
    articleSummary.value = post.excerpt || ''
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
  }
}

// 保存草稿
const saveDraft = async () => {
  if (!articleTitle.value.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  isSaving.value = true
  try {
    const postData: CreatePostDto | UpdatePostDto = {
      title: articleTitle.value.trim(),
      content: articleContent.value,
      excerpt: articleSummary.value.trim(),
      status: 'draft'
    }

    if (isEditMode.value && postId.value) {
      await postsApi.update(postId.value, postData as UpdatePostDto)
      ElMessage.success('草稿保存成功')
    } else {
      const response = await postsApi.create(postData as CreatePostDto)
      if (response && response.data && response.data.id) {
        postId.value = response.data.id
        isEditMode.value = true
        ElMessage.success('草稿保存成功')
      } else {
        throw new Error('保存草稿失败：未获取到文章ID')
      }
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    ElMessage.error('保存草稿失败')
  } finally {
    isSaving.value = false
  }
}

// 发布文章
const publishArticle = async () => {
  if (!canPublish.value) {
    ElMessage.warning('请填写完整的文章信息')
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要发布这篇文章吗？发布后将无法撤回。',
      '确认发布',
      {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    isSaving.value = true
    
    const postData: CreatePostDto | UpdatePostDto = {
      title: articleTitle.value.trim(),
      content: articleContent.value,
      excerpt: articleSummary.value.trim(),
      status: 'published'
    }

    if (isEditMode.value && postId.value) {
      await postsApi.update(postId.value, postData as UpdatePostDto)
      ElMessage.success('文章发布成功')
    } else {
      const response = await postsApi.create(postData as CreatePostDto)
      if (response && response.data && response.data.id) {
        postId.value = response.data.id
        isEditMode.value = true
        ElMessage.success('文章发布成功')
      } else {
        throw new Error('创建文章失败：未获取到文章ID')
      }
    }

    // 跳转到文章详情页
    router.push(`/posts/${postId.value}`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布文章失败:', error)
      ElMessage.error('发布文章失败')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.edit-article-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px 0;
}

.edit-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.title-section,
.content-section,
.summary-section {
  padding: 24px 32px;
  border-bottom: 1px solid #e9ecef;
}

.summary-section {
  border-bottom: none;
}

.required-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #dc3545;
  margin-bottom: 12px;
}

.summary-section label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
}

.title-input-wrapper,
.summary-input-wrapper {
  position: relative;
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.title-input:focus {
  border-color: #007bff;
}

.summary-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
}

.summary-input:focus {
  border-color: #007bff;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #6c757d;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.action-buttons {
  padding: 24px 32px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

@media (max-width: 768px) {
  .edit-container {
    margin: 0 16px;
    border-radius: 8px;
  }
  
  .title-section,
  .content-section,
  .summary-section {
    padding: 16px 20px;
  }
  
  .action-buttons {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 