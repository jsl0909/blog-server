import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface ThemeOption {
  value: string
  label: string
  description: string
  preview: string
}

export const useThemeStore = defineStore('theme', () => {
  // 主题选项
  const themeOptions: ThemeOption[] = [
    {
      value: 'github',
      label: 'GitHub',
      description: 'GitHub风格的浅色主题，适合日间阅读',
      preview: '🌞'
    },
    {
      value: 'night',
      label: 'Night',
      description: '深色主题，适合夜间阅读，护眼舒适',
      preview: '🌙'
    },
    {
      value: 'onelight',
      label: 'OneLight',
      description: '简洁明亮的主题，专注阅读体验',
      preview: '☀️'
    },
    {
      value: 'newsprint',
      label: 'Newsprint',
      description: '报纸风格主题，复古文艺',
      preview: '📰'
    },
    {
      value: 'pixyll',
      label: 'Pixyll',
      description: '现代简约主题，清新淡雅',
      preview: '🌸'
    },
    {
      value: 'whitey',
      label: 'Whitey',
      description: '纯白主题，极简主义',
      preview: '⚪'
    }
  ]

  // 当前主题
  const currentTheme = ref<string>('github')
  
  // 是否显示主题选择器
  const showThemeSelector = ref<boolean>(false)

  // 从本地存储加载主题
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('blog-theme')
    if (savedTheme && themeOptions.find(t => t.value === savedTheme)) {
      currentTheme.value = savedTheme
    }
    applyTheme(currentTheme.value)
  }

  // 应用主题
  const applyTheme = (theme: string) => {
    // 移除所有主题类
    document.documentElement.classList.remove(...themeOptions.map(t => `theme-${t.value}`))
    
    // 添加当前主题类
    document.documentElement.classList.add(`theme-${theme}`)
    
    // 设置CSS变量
    document.documentElement.setAttribute('data-theme', theme)
    
    // 保存到本地存储
    localStorage.setItem('blog-theme', theme)
  }

  // 切换主题
  const setTheme = (theme: string) => {
    if (themeOptions.find(t => t.value === theme)) {
      currentTheme.value = theme
      applyTheme(theme)
    }
  }

  // 切换主题选择器显示状态
  const toggleThemeSelector = () => {
    showThemeSelector.value = !showThemeSelector.value
  }

  // 获取当前主题信息
  const getCurrentThemeInfo = () => {
    return themeOptions.find(t => t.value === currentTheme.value)
  }

  // 监听主题变化
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    themeOptions,
    currentTheme,
    showThemeSelector,
    loadTheme,
    applyTheme,
    setTheme,
    toggleThemeSelector,
    getCurrentThemeInfo
  }
}) 