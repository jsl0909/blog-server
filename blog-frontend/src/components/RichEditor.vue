<template>
  <div class="rich-editor">
    <div ref="vditorRef" :style="{ minHeight: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: string
  placeholder?: string
  height?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容...',
  height: '400px'
})

const emit = defineEmits<Emits>()

const vditorRef = ref<HTMLDivElement | null>(null)
let vditor: any = null
const content = ref(props.modelValue)
const height = props.height

// 初始化 Vditor
onMounted(() => {
  vditor = new Vditor(vditorRef.value as HTMLDivElement, {
    value: content.value,
    height: height,
    placeholder: props.placeholder,
    mode: 'sv', // sv: 所见即所得，ir: 即时渲染，wysiwyg: 富文本
    toolbarConfig: {
      pin: true
    },
    cache: {
      enable: false
    },
    upload: {
      accept: 'image/*',
      handler(files: FileList) {
        // 这里可以自定义图片上传逻辑
        // 目前先转 base64
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          vditor?.insertValue(`![](${base64})`)
          ElMessage.success('图片上传成功')
        }
        reader.readAsDataURL(file)
      }
    },
    after: () => {
      vditor?.setValue(content.value)
    },
    input(value: string) {
      content.value = value
      emit('update:modelValue', value)
    }
  })
})

onBeforeUnmount(() => {
  vditor?.destroy()
  vditor = null
})

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
    vditor?.setValue(newValue)
  }
})
</script>

<style scoped>
.rich-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
}
</style> 