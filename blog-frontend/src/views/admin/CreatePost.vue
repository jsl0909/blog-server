<template>
  <div class="create-post">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建文章</span>
          <el-button @click="$router.go(-1)" type="text">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        v-loading="loading"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入文章标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <RichEditor
                v-model="form.content"
                height="500px"
                placeholder="请输入文章内容..."
              />
            </el-form-item>

            <el-form-item label="文章摘要">
              <el-input
                v-model="form.excerpt"
                type="textarea"
                :rows="3"
                placeholder="请输入文章摘要，留空则自动生成"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="发布状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio value="draft">草稿</el-radio>
                <el-radio value="published">发布</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="文章分类">
              <el-select
                v-model="form.categoryId"
                placeholder="选择分类"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="文章标签">
              <el-select
                v-model="form.tagIds"
                multiple
                placeholder="选择标签"
                style="width: 100%"
              >
                <el-option
                  v-for="tag in tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                <el-icon><Document /></el-icon>
                创建文章
              </el-button>
              <el-button @click="handleSaveDraft" :loading="submitting">
                <el-icon><Folder /></el-icon>
                保存草稿
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { ArrowLeft, Document, Folder } from '@element-plus/icons-vue'
import RichEditor from '@/components/RichEditor.vue'
import { postsApi } from '@/api/posts'
import { blogApi } from '@/api'
import type { PostForm } from '@/types/post'
import type { Category, Tag } from '@/types/api'

const router = useRouter()
const formRef = ref<InstanceType<typeof ElForm>>()

const loading = ref(false)
const submitting = ref(false)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

// 表单数据
const form = reactive<PostForm>({
  title: '',
  content: '',
  excerpt: '',
  status: 'draft',
  categoryId: undefined,
  tagIds: []
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择发布状态', trigger: 'change' }
  ]
}

// 生成摘要
const generateExcerpt = (content: string): string => {
  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '')
  return text.length > 150 ? text.substring(0, 150) + '...' : text
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const submitData = {
      ...form,
      status: (form.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
      excerpt: form.excerpt || generateExcerpt(form.content)
    }
    
    await postsApi.create(submitData)
    ElMessage.success('文章创建成功')
    router.push('/admin/posts')
  } catch (error: any) {
    console.error('创建文章失败:', error)
    ElMessage.error(error.response?.data?.message || '创建文章失败')
  } finally {
    submitting.value = false
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  if (!form.title.trim()) {
    ElMessage.warning('请至少输入文章标题')
    return
  }
  
  try {
    submitting.value = true
    
    const submitData = {
      ...form,
      status: 'draft' as const,
      excerpt: form.excerpt || generateExcerpt(form.content)
    }
    
    await postsApi.create(submitData)
    ElMessage.success('草稿保存成功')
    router.push('/admin/posts')
  } catch (error: any) {
    console.error('保存草稿失败:', error)
    ElMessage.error(error.response?.data?.message || '保存草稿失败')
  } finally {
    submitting.value = false
  }
}

// 获取分类列表
const loadCategories = async () => {
  categories.value = await blogApi.getCategories()
}

// 获取标签列表
const loadTags = async () => {
  tags.value = await blogApi.getTags()
}

// 页面初始化
onMounted(() => {
  loadCategories()
  loadTags()
})
</script>

<style scoped>
.create-post {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-form-item__label) {
  font-weight: 600;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 