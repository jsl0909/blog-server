<template>
  <div class="admin-users">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>用户管理</h1>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建用户
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索用户名或邮箱"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable style="width: 120px">
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.roleId" placeholder="选择角色" clearable style="width: 120px">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户表格 -->
    <el-card>
      <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column prop="username" label="用户名" min-width="120">
          <template #default="{ row }">
            <el-link @click="handleEdit(row)" type="primary">
              {{ row.username }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column label="角色" min-width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role.id"
              :type="getRoleType(role.name)"
              size="small"
              style="margin-right: 4px"
            >
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="统计" width="120">
          <template #default="{ row }">
            <div class="user-stats">
              <span>{{ row._count?.posts || 0 }} 文章</span>
              <span>{{ row._count?.comments || 0 }} 评论</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-dropdown @command="(command: string) => handleStatusChange(row, command)">
              <el-button size="small" type="warning">
                状态 <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="active" :disabled="row.status === 'active'">
                    激活
                  </el-dropdown-item>
                  <el-dropdown-item command="inactive" :disabled="row.status === 'inactive'">
                    禁用
                  </el-dropdown-item>
                  <el-dropdown-item command="banned" :disabled="row.status === 'banned'">
                    封禁
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新建用户' : '编辑用户'"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="userForm" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item 
          v-if="dialogMode === 'create'" 
          label="密码" 
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item 
          v-if="dialogMode === 'edit'" 
          label="新密码"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="留空则不修改密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="userForm.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio value="active">正常</el-radio>
            <el-radio value="inactive">禁用</el-radio>
            <el-radio value="banned">封禁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
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
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { adminApi, type User, type CreateUserData, type Role } from '@/api/admin'
import dayjs from 'dayjs'

// 数据
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  search: '',
  status: '',
  roleId: undefined as number | undefined
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 弹窗
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const submitting = ref(false)

// 表单
const formRef = ref<FormInstance>()
const userForm = reactive<CreateUserData & { id?: number }>({
  username: '',
  email: '',
  password: '',
  status: 'active',
  roleIds: []
})

// 表单校验规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 获取用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchForm.search || undefined,
      status: searchForm.status || undefined,
      roleId: searchForm.roleId || undefined
    }
    const response = await adminApi.getUsers(params)
    users.value = response.users
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const loadRoles = async () => {
  try {
    const response = await adminApi.getRoles()
    roles.value = response
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  searchForm.search = ''
  searchForm.status = ''
  searchForm.roleId = undefined
  pagination.page = 1
  loadUsers()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadUsers()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadUsers()
}

// 新建用户
const handleCreate = () => {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (user: User) => {
  dialogMode.value = 'edit'
  userForm.id = user.id
  userForm.username = user.username
  userForm.email = user.email
  userForm.password = ''
  userForm.nickname = user.nickname
  userForm.avatar = user.avatar
  userForm.status = user.status
  userForm.roleIds = user.roles.map(role => role.id)
  dialogVisible.value = true
}

// 状态变更
const handleStatusChange = async (user: User, status: string) => {
  try {
    await adminApi.updateUser(user.id, { status })
    ElMessage.success('状态更新成功')
    loadUsers()
  } catch (error) {
    ElMessage.error('状态更新失败')
    console.error('状态更新失败:', error)
  }
}

// 删除用户
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(`确定删除用户"${user.username}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await adminApi.deleteUser(user.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // 对于编辑模式，如果密码为空则不验证密码
    if (dialogMode.value === 'edit' && !userForm.password) {
      // 临时移除密码的必填验证
      const rules = { ...formRules }
      delete rules.password
      formRef.value.clearValidate('password')
    }
    
    await formRef.value.validate()
    submitting.value = true
    
    const submitData: any = { ...userForm }
    if (dialogMode.value === 'edit' && !submitData.password) {
      delete submitData.password
    }
    
    if (dialogMode.value === 'create') {
      await adminApi.createUser(submitData)
      ElMessage.success('创建成功')
    } else {
      await adminApi.updateUser(userForm.id!, submitData)
      ElMessage.success('更新成功')
    }
    
    dialogVisible.value = false
    loadUsers()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || (dialogMode.value === 'create' ? '创建失败' : '更新失败'))
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
  userForm.id = undefined
  userForm.username = ''
  userForm.email = ''
  userForm.password = ''
  userForm.nickname = ''
  userForm.avatar = ''
  userForm.status = 'active'
  userForm.roleIds = []
  formRef.value?.clearValidate()
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'warning'
    case 'banned': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '正常'
    case 'inactive': return '禁用'
    case 'banned': return '封禁'
    default: return '未知'
  }
}

// 获取角色类型
const getRoleType = (roleName: string) => {
  switch (roleName) {
    case 'super_admin': return 'danger'
    case 'admin': return 'warning'
    case 'editor': return 'primary'
    case 'user': return 'info'
    default: return 'info'
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  loadRoles()
  loadUsers()
})
</script>

<style scoped>
.admin-users {
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

.search-card {
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #909399;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 