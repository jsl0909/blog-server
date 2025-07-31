<template>
  <div class="edit-post">
    <div class="edit-header-gradient"></div>
    <el-card class="edit-card">
      <template #header>
        <div class="card-header">
          <span>编辑文章</span>
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
        class="edit-form"
      >
        <el-row :gutter="20">
          <el-col :span="16" class="main-form-col">
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
          <el-col :span="8" class="side-form-col">
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
                class="tag-select"
              >
                <el-option
                  v-for="tag in tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>
            <div class="post-info" v-if="postData">
              <el-divider>文章信息</el-divider>
              <p><strong>创建时间：</strong>{{ formatDate(postData.createdAt) }}</p>
              <p><strong>更新时间：</strong>{{ formatDate(postData.updatedAt) }}</p>
              <p v-if="postData.author"><strong>作者：</strong>{{ postData.author.nickname || postData.author.username }}</p>
              <p v-if="postData.viewCount"><strong>阅读量：</strong>{{ postData.viewCount }}</p>
            </div>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting" class="main-btn">
                <el-icon><Document /></el-icon>
                保存文章
              </el-button>
              <el-button @click="handleSaveDraft" :loading="submitting" class="draft-btn">
                <el-icon><Folder /></el-icon>
                保存草稿
              </el-button>
              <el-button type="danger" @click="handleDelete" :loading="deleting" class="delete-btn">
                <el-icon><Delete /></el-icon>
                删除文章
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { ArrowLeft, Document, Folder, Delete } from '@element-plus/icons-vue'
import RichEditor from '@/components/RichEditor.vue'
import { postsApi } from '@/api/posts'
import { blogApi } from '@/api'
import type { PostForm } from '@/types/post'
import type { Category, Tag, BlogPost } from '@/types/api'

const router = useRouter()
const route = useRoute()
const formRef = ref<InstanceType<typeof ElForm>>()

const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const postData = ref<BlogPost | null>(null)

const postId = Number(route.params.id)

onMounted(async () => {
  if (!postId || isNaN(postId)) {
    ElMessage.error('无效的文章ID，无法编辑')
    router.push('/admin/posts')
    return
  }
  loading.value = true
  try {
    await loadCategories()
    await loadTags()
    await fetchPost()
  } catch (e) {
    console.error('编辑页加载异常:', e)
    ElMessage.error('加载失败')
    router.push('/admin/posts')
  } finally {
    loading.value = false
  }
})

// 加载分类
async function loadCategories() {
  // 假设 blogApi.getCategories() 返回 [{id, name}]
  categories.value = await blogApi.getCategories()
  console.log('分类列表:', categories.value)
}
// 加载标签
async function loadTags() {
  tags.value = await blogApi.getTags()
  console.log('标签列表:', tags.value)
}

// 获取文章详情并回显
async function fetchPost() {
  try {
    const response = await postsApi.getById(postId)
    const post = response.data || response
    if (!post) {
      ElMessage.error('文章不存在')
      router.push('/admin/posts')
      return
    }
    postData.value = post
    // 回显表单
    form.title = post.title || ''
    form.content = post.content || ''
    form.excerpt = post.excerpt || ''
    form.status = post.status?.toLowerCase?.() || 'draft'
    // 分类回显
    form.categoryId = post.category?.id ? Number(post.category.id) : undefined
    // 标签回显（后端已统一为 [{id, name}]）
    form.tagIds = Array.isArray(post.tags)
      ? post.tags.map((item: {id: number, name: string}) => item.id)
      : []
    console.log('文章详情回显:', {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      status: form.status,
      categoryId: form.categoryId,
      tagIds: form.tagIds,
      tagsRaw: post.tags
    })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
    router.push('/admin/posts')
    throw error
  }
}

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

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 生成摘要
const generateExcerpt = (content: string): string => {
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
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      tagIds: Array.isArray(form.tagIds) ? form.tagIds.map(id => Number(id)) : [],
      status: form.status === 'published' ? 'published' : ('draft' as 'draft' | 'published'),
      excerpt: form.excerpt || generateExcerpt(form.content)
    }
    await postsApi.update(postId, submitData)
    ElMessage.success('文章更新成功')
    router.push('/admin/posts')
  } catch (error: any) {
    console.error('更新文章失败:', error)
    ElMessage.error(error.response?.data?.message || '更新文章失败')
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
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      tagIds: Array.isArray(form.tagIds) ? form.tagIds.map(id => Number(id)) : [],
      status: 'draft' as const,
      excerpt: form.excerpt || generateExcerpt(form.content)
    }
    await postsApi.update(postId, submitData)
    ElMessage.success('草稿保存成功')
    await fetchPost() // 重新获取文章信息
  } catch (error: any) {
    console.error('保存草稿失败:', error)
    ElMessage.error(error.response?.data?.message || '保存草稿失败')
  } finally {
    submitting.value = false
  }
}

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    deleting.value = true
    await postsApi.delete(postId)
    ElMessage.success('文章删除成功')
    router.push('/admin/posts')
  } catch (error: any) {
    if (error === 'cancel') return
    console.error('删除文章失败:', error)
    ElMessage.error(error.response?.data?.message || '删除文章失败')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.edit-post {
  min-height: 100vh;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  padding: 0 0 40px 0;
  position: relative;
}
.edit-header-gradient {
  height: 120px;
  background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
  border-radius: 0 0 32px 32px;
  box-shadow: 0 4px 24px rgba(33,147,176,0.10);
  margin-bottom: -60px;
}
.edit-card {
  max-width: 1100px;
  margin: 0 auto;
  margin-top: -60px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(33,147,176,0.10);
  padding: 32px 40px 24px 40px;
  background: #fff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  font-weight: 700;
  color: #2193b0;
}
.edit-form {
  margin-top: 12px;
}
.main-form-col {
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(33,147,176,0.04);
  padding: 24px 18px 18px 18px;
}
.side-form-col {
  background: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(33,147,176,0.04);
  padding: 18px 12px 12px 12px;
}
.el-form-item {
  margin-bottom: 22px;
}
.el-form-item__label {
  font-weight: 600;
  color: #2193b0;
}
.tag-select .el-select-tags-wrapper .el-tag {
  border-radius: 16px !important;
  background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%) !important;
  color: #fff !important;
  border: none !important;
  font-weight: 600;
  margin-bottom: 4px;
}
.tag-select .el-select-tags-wrapper .el-tag:hover {
  box-shadow: 0 2px 8px rgba(33,147,176,0.10);
}
.main-btn {
  border-radius: 20px;
  font-weight: 600;
  background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
  color: #fff;
  border: none;
  margin-right: 8px;
  transition: background 0.2s, color 0.2s;
}
.main-btn:hover {
  background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
}
.draft-btn {
  border-radius: 20px;
  font-weight: 600;
  background: #f8fafc;
  color: #2193b0;
  border: 1px solid #2193b0;
  margin-right: 8px;
  transition: background 0.2s, color 0.2s;
}
.draft-btn:hover {
  background: #e0eafc;
  color: #2193b0;
}
.delete-btn {
  border-radius: 20px;
  font-weight: 600;
  background: #fff0f0;
  color: #e96900;
  border: 1px solid #e96900;
  transition: background 0.2s, color 0.2s;
}
.delete-btn:hover {
  background: #ffe5e5;
  color: #e96900;
}
.post-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(33,147,176,0.04);
}
.post-info p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}
@media (max-width: 900px) {
  .edit-card {
    padding: 16px 4px 12px 4px;
  }
  .main-form-col, .side-form-col {
    padding: 10px 2px;
  }
}
@media (max-width: 600px) {
  .edit-card {
    padding: 2px 0 2px 0;
  }
  .main-form-col, .side-form-col {
    padding: 2px 0;
  }
  .card-header {
    font-size: 1em;
  }
}
</style> 