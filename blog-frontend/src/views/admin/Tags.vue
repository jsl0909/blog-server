<template>
  <div class="admin-tags">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>标签管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建标签
      </el-button>
    </div>

    <!-- 标签表格 -->
    <el-card>
      <el-table :data="tags" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="标签名称" min-width="150">
          <template #default="{ row }">
            <el-link @click="handleEdit(row)" type="primary">
              <el-tag size="large">{{ row.name }}</el-tag>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span>{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章数量" width="120">
          <template #default="{ row }">
            <el-tag type="info">{{ row._count?.posts || 0 }} 篇</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="(row._count?.posts || 0) > 0"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新建标签' : '编辑标签'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="tagForm" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="tagForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ dialogMode === 'create' ? '创建' : '更新' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { tagsApi, type Tag, type CreateTagDto } from '@/api/tags'
import dayjs from 'dayjs'

// 数据
const tags = ref<Tag[]>([])
const loading = ref(false)

// 弹窗
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const submitting = ref(false)

// 表单
const formRef = ref<FormInstance>()
const tagForm = reactive<CreateTagDto & { id?: number }>({
  name: '',
  color: ''
})

// 表单校验规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 30, message: '标签名称长度在 1 到 30 个字符', trigger: 'blur' }
  ]
}

// 获取标签列表
const loadTags = async () => {
  loading.value = true
  try {
    const response = await tagsApi.getList() as any
    tags.value = response || []
  } catch (error) {
    ElMessage.error('获取标签列表失败')
    console.error('获取标签列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 新建标签
const handleCreate = () => {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (tag: Tag) => {
  dialogMode.value = 'edit'
  tagForm.id = tag.id
  tagForm.name = tag.name
  tagForm.color = tag.color || ''
  dialogVisible.value = true
}

// 删除标签
const handleDelete = async (tag: Tag) => {
  // 检查是否有文章使用该标签
  const postCount = tag._count?.posts || 0
  if (postCount > 0) {
    ElMessage.warning(`该标签下还有 ${postCount} 篇文章，无法删除`)
    return
  }

  try {
    await ElMessageBox.confirm(`确定删除标签"${tag.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await tagsApi.delete(tag.id)
    ElMessage.success('删除成功')
    loadTags()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (dialogMode.value === 'create') {
      await tagsApi.create({ name: tagForm.name, color: tagForm.color })
      ElMessage.success('创建成功')
    } else {
      await tagsApi.update(tagForm.id!, { name: tagForm.name, color: tagForm.color })
      ElMessage.success('更新成功')
    }
    
    dialogVisible.value = false
    loadTags()
  } catch (error) {
    ElMessage.error(dialogMode.value === 'create' ? '创建失败' : '更新失败')
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  tagForm.id = undefined
  tagForm.name = ''
  tagForm.color = ''
  formRef.value?.clearValidate()
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  loadTags()
  console.log('Tags页面已加载')
})
</script>

<style scoped>
.admin-tags {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #303133;
}
</style> 