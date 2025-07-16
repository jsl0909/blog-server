import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, LoginForm, RegisterForm } from '@/types/auth'
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => {
    if (!user.value || !user.value.roles || !Array.isArray(user.value.roles)) return false
    return user.value.roles.some(role => 
      ['super_admin', 'admin', 'editor'].includes(role.name)
    )
  })
  const isSuperAdmin = computed(() => {
    if (!user.value || !user.value.roles || !Array.isArray(user.value.roles)) return false
    return user.value.roles.some(role => role.name === 'super_admin')
  })

  // 登录
  const login = async (loginForm: LoginForm) => {
    try {
      const response = await authApi.login(loginForm)
      setAuth(response.access_token, response.user)
      ElMessage.success('登录成功')
      return response
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '登录失败')
      throw error
    }
  }

  // 注册
  const register = async (registerForm: RegisterForm) => {
    try {
      const response = await authApi.register(registerForm)
      setAuth(response.access_token, response.user)
      ElMessage.success('注册成功')
      return response
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '注册失败')
      throw error
    }
  }

  // 登出
  const logout = () => {
    clearAuth()
    ElMessage.success('已退出登录')
  }

  // 设置认证信息
  const setAuth = (accessToken: string, userData: User) => {
    token.value = accessToken
    user.value = userData
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 初始化用户信息
  const initUser = async () => {
    if (token.value) {
      try {
        // 从本地存储加载用户信息
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          user.value = JSON.parse(storedUser)
        }
        // 这里可以调用API验证token有效性
        // const userData = await userApi.getProfile()
        // user.value = userData
      } catch (error) {
        clearAuth()
      }
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    login,
    register,
    logout,
    setAuth,
    clearAuth,
    initUser
  }
}) 