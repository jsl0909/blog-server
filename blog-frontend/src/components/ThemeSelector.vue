<template>
  <div class="theme-selector-container">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle-btn" @click="toggleSelector" :title="currentThemeInfo?.description">
      <span class="theme-icon">{{ currentThemeInfo?.preview }}</span>
      <span class="theme-label">{{ currentThemeInfo?.label }}</span>
      <el-icon class="toggle-icon" :class="{ 'rotated': showSelector }">
        <ArrowDown />
      </el-icon>
    </div>

    <!-- 主题选择面板 -->
    <transition name="theme-panel">
      <div v-if="showSelector" class="theme-panel" :class="{ 'upward': shouldShowUpward }" ref="panelRef">
        <div class="panel-header">
          <h3>选择主题</h3>
          <el-button 
            type="text" 
            size="small" 
            @click="toggleSelector"
            class="close-btn"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <div class="theme-grid">
          <div 
            v-for="theme in themeOptions" 
            :key="theme.value"
            class="theme-option"
            :class="{ 'active': currentTheme === theme.value }"
            @click="selectTheme(theme.value)"
          >
            <div class="theme-preview">
              <span class="preview-icon">{{ theme.preview }}</span>
            </div>
            <div class="theme-info">
              <div class="theme-name">{{ theme.label }}</div>
              <div class="theme-desc">{{ theme.description }}</div>
            </div>
            <div class="theme-check" v-if="currentTheme === theme.value">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 遮罩层 -->
    <transition name="overlay">
      <div v-if="showSelector" class="overlay" @click="toggleSelector"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { ArrowDown, Close, Check } from '@element-plus/icons-vue'

const themeStore = useThemeStore()

const showSelector = ref(false)
const shouldShowUpward = ref(false)
const panelRef = ref<HTMLElement>()

const themeOptions = computed(() => themeStore.themeOptions)
const currentTheme = computed(() => themeStore.currentTheme)
const currentThemeInfo = computed(() => themeStore.getCurrentThemeInfo())

const checkPanelPosition = () => {
  // 简化逻辑：如果主题选择器在侧边栏下半部分，就向上展开
  const container = document.querySelector('.theme-selector-container') as HTMLElement
  const sidebar = document.querySelector('.sidebar') as HTMLElement
  
  if (!container || !sidebar) return
  
  const containerRect = container.getBoundingClientRect()
  const sidebarRect = sidebar.getBoundingClientRect()
  const sidebarHeight = sidebarRect.height
  const containerTop = containerRect.top - sidebarRect.top
  
  // 如果容器在侧边栏的下半部分，向上展开
  shouldShowUpward.value = containerTop > sidebarHeight * 0.6
}

const toggleSelector = () => {
  showSelector.value = !showSelector.value
  if (showSelector.value) {
    checkPanelPosition()
  }
}

const selectTheme = (theme: string) => {
  themeStore.setTheme(theme)
  showSelector.value = false
}
</script>

<style scoped>
.theme-selector-container {
  position: relative;
  z-index: 1000;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.theme-icon {
  font-size: 16px;
}

.theme-label {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toggle-icon {
  font-size: 12px;
  color: #666666;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.theme-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-height: 300px;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  backdrop-filter: blur(15px);
  z-index: 1001;
}

/* 当面板可能被底部遮挡时，向上展开 */
.theme-panel.upward {
  top: auto;
  bottom: calc(100% + 8px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(248, 249, 250, 0.8);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #333333;
}

.close-btn {
  padding: 4px;
}

.theme-grid {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.theme-option:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
}

.theme-option.active {
  background: rgba(102, 126, 234, 0.12);
  border: 2px solid rgba(102, 126, 234, 0.4);
}

.theme-preview {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.preview-icon {
  font-size: 20px;
}

.theme-info {
  flex: 1;
  min-width: 0;
}

.theme-name {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
}

.theme-desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
}

.theme-check {
  color: #667eea;
  font-size: 18px;
  font-weight: bold;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: -1;
}

/* 过渡动画 */
.theme-panel-enter-active,
.theme-panel-leave-active {
  transition: all 0.3s ease;
}

.theme-panel-enter-from,
.theme-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 320px;
  }
  
  .theme-toggle-btn {
    padding: 6px 10px;
  }
  
  .theme-label {
    display: none;
  }
}
</style> 