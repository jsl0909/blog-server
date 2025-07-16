<template>
  <div class="login-container">
    <div class="login-box" ref="loginBox">
      <h2 class="title-text">登录</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const loginBox = ref<HTMLElement | null>(null)

const loginForm = reactive<LoginForm>({
  email: '',
  password: ''
})

const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await authStore.login(loginForm)
    router.push('/')
  } catch (error) {
    // 错误已在store中处理
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f8fa;
}

.login-box {
  width: 340px;
  padding: 32px 24px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 0;
  box-shadow: none;
  transition: none;
}

.title-text {
  font-size: 1.6rem;
  font-weight: 600;
  color: #222;
  text-align: center;
  margin-bottom: 28px;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  background-clip: unset;
  text-shadow: none;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #e5e6eb;
  border-radius: 0;
  box-shadow: none;
  height: 40px;
  transition: border 0.2s;
}
:deep(.el-input__wrapper.is-focus) {
  border-bottom: 1.5px solid #3ec6e0;
}
:deep(.el-input__inner) {
  color: #222;
  height: 100%;
  background: transparent;
}
:deep(.el-input__inner::placeholder) {
  color: #b0b3b8;
  opacity: 1;
  text-transform: none;
}
:deep(.el-input__icon) {
  color: #b0b3b8;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 1rem;
  font-weight: 600;
  background: #3ec6e0;
  color: #fff;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transition: background 0.2s;
  text-transform: none;
}
.login-btn:hover {
  background: #1a8fa6;
}

@media (max-width: 600px) {
  .login-box {
    width: 98%;
    padding: 18px 4px;
  }
  .title-text {
    font-size: 1.1rem;
  }
}
</style> 