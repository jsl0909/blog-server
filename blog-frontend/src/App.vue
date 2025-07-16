<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 应用启动时初始化认证状态
onMounted(() => {
  authStore.initUser()
})
</script>

<style>
#app {
  min-height: 100vh;
  animation: fadeInBg 1.2s cubic-bezier(.4,2,.6,1);
}

@keyframes fadeInBg {
  from {
    opacity: 0;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}
</style> 