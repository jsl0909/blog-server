<template>
  <div class="markdown-upload">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Markdown 文件上传</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleUpload" class="space-y-6" autocomplete="off">
          <!-- 文件选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              选择 Markdown 文件
            </label>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept=".md,.markdown"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="mt-1 text-sm text-gray-500">
              支持 .md 和 .markdown 格式的文件
            </p>
          </div>

          <!-- 上传按钮 -->
          <div>
            <button
              type="submit"
              :disabled="!selectedFile || uploading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ uploading ? '上传中...' : '上传文件' }}
            </button>
          </div>
        </form>

        <!-- 上传结果 -->
        <div v-if="uploadResult" class="mt-6">
          <div
            :class="[
              'p-4 rounded-md',
              uploadResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            ]"
          >
            <h3 class="font-medium">
              {{ uploadResult.success ? '上传成功' : '上传失败' }}
            </h3>
            <p class="mt-1">{{ uploadResult.message }}</p>
            <div v-if="uploadResult.success && uploadResult.data" class="mt-3">
              <h4 class="font-medium">文章信息：</h4>
              <ul class="mt-2 space-y-1 text-sm">
                <li><strong>标题：</strong>{{ uploadResult.data.post.title }}</li>
                <li><strong>状态：</strong>{{ uploadResult.data.post.status }}</li>
                <li><strong>创建时间：</strong>{{ new Date(uploadResult.data.post.createdAt).toLocaleString() }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 文件预览 -->
        <div v-if="fileContent" class="mt-6">
          <h3 class="text-lg font-medium mb-3">文件预览</h3>
          <div class="bg-gray-50 p-4 rounded-md">
            <pre class="text-sm whitespace-pre-wrap">{{ fileContent }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadAPI } from '@/api/upload'

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadResult = ref<any>(null)
const fileContent = ref<string>('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    // 读取文件内容用于预览
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

const handleUpload = async (event?: Event) => {
  if (event) event.preventDefault();
  if (!selectedFile.value) return;
  if (uploading.value) return; // 防止重复提交
  uploading.value = true;
  uploadResult.value = null;
  try {
    console.log('handleUpload called');
    const result = await uploadAPI.uploadMarkdown(selectedFile.value)
    uploadResult.value = {
      success: result.success,
      message: result.success ? '文件上传并处理成功！' : result.error,
      data: result.data
    }
    if (result.success) {
      // 清空表单
      selectedFile.value = null
      fileContent.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  } catch (error: any) {
    uploadResult.value = {
      success: false,
      message: error.message || '上传失败，请重试'
    }
  } finally {
    uploading.value = false;
  }
}

onMounted(() => {
  console.log('MarkdownUpload页面已加载')
})
</script>

<style scoped>
.markdown-upload {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style> 