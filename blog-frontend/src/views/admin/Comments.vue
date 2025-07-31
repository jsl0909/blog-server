<template>
  <div class="admin-comments">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>评论管理</h1>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable style="width: 120px">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
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
        type="success" 
        :disabled="!selectedComments.length"
        @click="handleBatchApprove"
      >
        <el-icon><Check /></el-icon>
        批量通过 ({{ selectedComments.length }})
      </el-button>
      <el-button 
        type="warning" 
        :disabled="!selectedComments.length"
        @click="handleBatchReject"
      >
        <el-icon><Close /></el-icon>
        批量拒绝 ({{ selectedComments.length }})
      </el-button>
      <el-button 
        type="danger" 
        :disabled="!selectedComments.length"
        @click="handleBatchDelete"
      >
        <el-icon><Delete /></el-icon>
        批量删除 ({{ selectedComments.length }})
      </el-button>
    </div>

    <!-- 评论表格 -->
    <el-card>
      <el-table
        :data="comments"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="comment-content">
              <div class="content">{{ row.content }}</div>
              <div class="meta">
                <span class="author">{{ row.author?.name || '匿名用户' }}</span>
                <span class="divider">·</span>
                <span class="post-title">{{ row.post?.title || '未知文章' }}</span>
              </div>
              <div v-if="row.parent" class="reply-to">
                回复：{{ row.parent.author.name }} - {{ row.parent.content.slice(0, 50) }}...
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.status)"
              size="small"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="评论时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'pending'"
              size="small" 
              type="success"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button 
              v-if="row.status === 'pending'"
              size="small" 
              type="warning"
              @click="handleReject(row)"
            >
              拒绝
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
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
import { Check, Close, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { commentsApi, type Comment } from '@/api/comments'
import dayjs from 'dayjs'

// 数据
const comments = ref<Comment[]>([])
const loading = ref(false)
const selectedComments = ref<Comment[]>([])

// 搜索表单
const searchForm = reactive({
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 获取评论列表
const loadComments = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      status: searchForm.status || undefined
    }
    const response = await commentsApi.getList(params) as any
    comments.value = response.data || response || []
    pagination.total = response.total || response.length || 0
  } catch (error) {
    ElMessage.error('获取评论列表失败')
    console.error('获取评论列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadComments()
}

// 重置搜索
const handleReset = () => {
  searchForm.status = ''
  pagination.page = 1
  loadComments()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadComments()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadComments()
}

// 选择变化
const handleSelectionChange = (selection: Comment[]) => {
  selectedComments.value = selection
}

// 通过评论
const handleApprove = async (comment: Comment) => {
  try {
    await commentsApi.updateStatus(comment.id, { status: 'approved' })
    ElMessage.success('审核通过')
    loadComments()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('审核失败:', error)
  }
}

// 拒绝评论
const handleReject = async (comment: Comment) => {
  try {
    await commentsApi.updateStatus(comment.id, { status: 'rejected' })
    ElMessage.success('已拒绝')
    loadComments()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('拒绝失败:', error)
  }
}

// 删除评论
const handleDelete = async (comment: Comment) => {
  try {
    await ElMessageBox.confirm('确定删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await commentsApi.delete(comment.id)
    ElMessage.success('删除成功')
    loadComments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 批量通过
const handleBatchApprove = async () => {
  if (!selectedComments.value.length) return
  
  try {
    await ElMessageBox.confirm(`确定通过选中的 ${selectedComments.value.length} 条评论吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    const ids = selectedComments.value.map(comment => comment.id)
    await commentsApi.batchApprove(ids)
    ElMessage.success('批量审核通过')
    loadComments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量操作失败')
      console.error('批量通过失败:', error)
    }
  }
}

// 批量拒绝
const handleBatchReject = async () => {
  if (!selectedComments.value.length) return
  
  try {
    await ElMessageBox.confirm(`确定拒绝选中的 ${selectedComments.value.length} 条评论吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedComments.value.map(comment => comment.id)
    await commentsApi.batchReject(ids)
    ElMessage.success('批量拒绝成功')
    loadComments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量操作失败')
      console.error('批量拒绝失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedComments.value.length) return
  
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedComments.value.length} 条评论吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const ids = selectedComments.value.map(comment => comment.id)
    await commentsApi.batchDelete(ids)
    ElMessage.success('批量删除成功')
    loadComments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'pending': return 'warning'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    case 'pending': return '待审核'
    default: return '未知'
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  loadComments()
  console.log('Comments页面已加载')
})
</script>

<style scoped>
.admin-comments {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.table-actions {
  margin-bottom: 10px;
}

.comment-content {
  max-width: 300px;
}

.content {
  margin-bottom: 8px;
  line-height: 1.4;
  word-break: break-word;
}

.meta {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.meta .divider {
  margin: 0 4px;
}

.reply-to {
  font-size: 12px;
  color: #606266;
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 3px solid #e4e7ed;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 