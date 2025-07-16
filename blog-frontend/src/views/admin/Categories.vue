<template>
  <div class="admin-categories">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>分类管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建分类
      </el-button>
    </div>

    <!-- 分类表格 -->
    <el-card>
      <el-table :data="categories" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="分类名称" min-width="150">
          <template #default="{ row }">
            <el-link @click="handleEdit(row)" type="primary">
              {{ row.name }}
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
      :title="dialogMode === 'create' ? '新建分类' : '编辑分类'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="categoryForm" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入分类描述（可选）"
          />
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
import { categoriesApi, type Category, type CreateCategoryDto } from '@/api/categories'
import dayjs from 'dayjs'

// 数据
const categories = ref<Category[]>([])
const loading = ref(false)

// 弹窗
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const submitting = ref(false)

// 表单
const formRef = ref<FormInstance>()
const categoryForm = reactive<CreateCategoryDto & { id?: number }>({
  name: '',
  description: ''
})

// 表单校验规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

// 获取分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await categoriesApi.getList() as any
    categories.value = response || []
  } catch (error) {
    ElMessage.error('获取分类列表失败')
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 新建分类
const handleCreate = () => {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (category: Category) => {
  dialogMode.value = 'edit'
  categoryForm.id = category.id
  categoryForm.name = category.name
  categoryForm.description = category.description || ''
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (category: Category) => {
  // 检查是否有文章使用该分类
  const postCount = category._count?.posts || 0
  if (postCount > 0) {
    ElMessage.warning(`该分类下还有 ${postCount} 篇文章，无法删除`)
    return
  }

  try {
    await ElMessageBox.confirm(`确定删除分类"${category.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await categoriesApi.delete(category.id)
    ElMessage.success('删除成功')
    loadCategories()
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
      await categoriesApi.create(categoryForm)
      ElMessage.success('创建成功')
    } else {
      await categoriesApi.update(categoryForm.id!, categoryForm)
      ElMessage.success('更新成功')
    }
    
    dialogVisible.value = false
    loadCategories()
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
  categoryForm.id = undefined
  categoryForm.name = ''
  categoryForm.description = ''
  formRef.value?.clearValidate()
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.admin-categories {
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