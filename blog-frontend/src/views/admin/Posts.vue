<template>
  <div class="admin-posts">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>文章管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建文章
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索文章标题或内容"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable style="width: 120px">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格操作栏 -->
    <div class="table-actions">
      <el-button 
        type="danger" 
        :disabled="!selectedPosts.length"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>
        批量删除 ({{ selectedPosts.length }})
      </el-button>
    </div>

    <!-- 文章表格 -->
    <el-card>
      <el-table
        :data="posts"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <el-link @click="handleEdit(row)" type="primary">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status?.toLowerCase() === 'published' ? 'success' : 'warning'">
              {{ row.status?.toLowerCase() === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120">
          <template #default="{ row }">
            {{ row.author?.nickname || row.author?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="tag in (row.tags || []).map((t: any) => t.tag || t)"
              :key="tag.id"
              size="small"
              style="margin-right: 5px;"
            >
              {{ tag.name }}
            </el-tag>
            <span v-if="!row.tags || !row.tags.length">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" @click="handleView(row)" type="success">预览</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { postsApi, type Post } from '@/api/posts'
import dayjs from 'dayjs'

const router = useRouter()

// 数据
const posts = ref<Post[]>([])
const loading = ref(false)
const selectedPosts = ref<Post[]>([])

// 搜索表单
const searchForm = reactive({
  search: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 获取文章列表
const loadPosts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchForm.search || undefined,
      status: searchForm.status || undefined
    }
    const response = await postsApi.getList(params) as any
    
    // 处理不同的响应格式
    if (response.data) {
      posts.value = response.data.posts || response.data
      pagination.total = response.data.total || 0
    } else {
      posts.value = response.posts || response || []
      pagination.total = response.total || response.length || 0
    }
  } catch (error) {
    ElMessage.error('获取文章列表失败')
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadPosts()
}

// 重置搜索
const handleReset = () => {
  searchForm.search = ''
  searchForm.status = ''
  pagination.page = 1
  loadPosts()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadPosts()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadPosts()
}

// 选择变化
const handleSelectionChange = (selection: Post[]) => {
  selectedPosts.value = selection
}

// 新建文章
const handleCreate = () => {
  router.push('/admin/posts/create')
}

// 编辑文章
const handleEdit = (post: Post) => {
  router.push(`/admin/posts/edit/${post.id}`)
}

// 预览文章
const handleView = (post: Post) => {
  // 在新窗口打开文章详情页
  const url = router.resolve(`/posts/${post.id}`).href
  window.open(url, '_blank')
}

// 删除文章
const handleDelete = async (post: Post) => {
  try {
    await ElMessageBox.confirm(`确定删除文章"${post.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await postsApi.delete(post.id)
    ElMessage.success('删除成功')
    loadPosts()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedPosts.value.length) return
  
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedPosts.value.length} 篇文章吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedPosts.value.map(post => post.id)
    await postsApi.batchDelete(ids)
    ElMessage.success('批量删除成功')
    loadPosts()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.admin-posts {
  padding: 40px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.page-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  letter-spacing: -0.02em;
}
.el-button[type="primary"] {
  background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  transition: background 0.2s;
}
.el-button[type="primary"]:hover {
  background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
}
.search-card {
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(33,147,176,0.06);
  border: 1px solid #f0f0f0;
  background: #fff;
}
.table-actions {
  margin-bottom: 10px;
}
.el-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(33,147,176,0.06);
  border: 1px solid #f0f0f0;
  background: #fff;
}
.el-table {
  border-radius: 12px;
  background: #fff;
  font-size: 15px;
}
.el-table th, .el-table td {
  background: #fff;
  border-bottom: 1px solid #f5f7fa;
}
.el-table th {
  color: #2193b0;
  font-weight: 700;
  background: #f8fafc;
}
.el-table .el-link {
  color: #2193b0;
  font-weight: 600;
  font-size: 1.05em;
}
.el-table .el-link:hover {
  text-decoration: underline;
}
.el-tag {
  border-radius: 10px;
  font-weight: 500;
  background: #f8fafc;
  color: #2193b0;
  border: none;
}
.el-tag[type="success"] {
  background: #e0f7fa;
  color: #009688;
}
.el-tag[type="warning"] {
  background: #fffbe6;
  color: #e6a23c;
}
.el-tag[type="info"] {
  background: #e3f2fd;
  color: #1976d2;
}
.el-button[type="danger"] {
  background: #fff0f0;
  color: #e96900;
  border-radius: 12px;
  border: 1px solid #e96900;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.el-button[type="danger"]:hover {
  background: #ffe5e5;
  color: #e96900;
}
.el-button[type="success"] {
  background: #e0f7fa;
  color: #009688;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}
.el-button[type="success"]:hover {
  background: #b2ebf2;
  color: #00796b;
}
.pagination {
  margin-top: 24px;
  text-align: right;
}
:deep(.el-table__header th) {
  background: #f8fafc !important;
}
:deep(.el-table__body tr:hover) {
  background: #f0f7fa !important;
}
:deep(.el-table__row) {
  transition: background 0.2s;
}
:deep(.el-pagination) {
  margin-top: 12px;
}
@media (max-width: 900px) {
  .admin-posts {
    padding: 20px 5px;
  }
  .page-header h1 {
    font-size: 1.5rem;
  }
  .el-card {
    padding: 0 2px;
  }
}
</style> 