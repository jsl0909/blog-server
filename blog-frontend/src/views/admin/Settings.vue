<template>
  <div class="admin-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>系统设置</h1>
      <el-button type="primary" @click="handleSave" :loading="saving">
        <el-icon><Check /></el-icon>
        保存设置
      </el-button>
    </div>

    <!-- 设置表单 -->
    <el-card>
      <el-form :model="settingsForm" :rules="formRules" ref="formRef" label-width="120px">
        <!-- 基础设置 -->
        <div class="setting-section">
          <h3>基础设置</h3>
          <el-form-item label="网站名称" prop="siteName">
            <el-input
              v-model="settingsForm.siteName"
              placeholder="请输入网站名称"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="网站描述" prop="siteDescription">
            <el-input
              v-model="settingsForm.siteDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入网站描述"
              style="width: 500px"
            />
          </el-form-item>
          <el-form-item label="网站关键词" prop="siteKeywords">
            <el-input
              v-model="settingsForm.siteKeywords"
              placeholder="请输入网站关键词，用逗号分隔"
              style="width: 500px"
            />
          </el-form-item>
          <el-form-item label="网站Logo" prop="siteLogo">
            <el-input
              v-model="settingsForm.siteLogo"
              placeholder="请输入Logo URL"
              style="width: 400px"
            />
          </el-form-item>
        </div>

        <!-- SEO设置 -->
        <div class="setting-section">
          <h3>SEO设置</h3>
          <el-form-item label="默认标题" prop="defaultTitle">
            <el-input
              v-model="settingsForm.defaultTitle"
              placeholder="请输入默认页面标题"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="标题分隔符" prop="titleSeparator">
            <el-select v-model="settingsForm.titleSeparator" style="width: 150px">
              <el-option label=" - " value=" - " />
              <el-option label=" | " value=" | " />
              <el-option label=" · " value=" · " />
              <el-option label=" / " value=" / " />
            </el-select>
          </el-form-item>
          <el-form-item label="Meta描述" prop="metaDescription">
            <el-input
              v-model="settingsForm.metaDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入默认Meta描述"
              style="width: 500px"
            />
          </el-form-item>
          <el-form-item label="Meta关键词" prop="metaKeywords">
            <el-input
              v-model="settingsForm.metaKeywords"
              placeholder="请输入默认Meta关键词，用逗号分隔"
              style="width: 500px"
            />
          </el-form-item>
        </div>

        <!-- 功能设置 -->
        <div class="setting-section">
          <h3>功能设置</h3>
          <el-form-item label="允许注册">
            <el-switch
              v-model="settingsForm.allowRegister"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          <el-form-item label="评论审核">
            <el-switch
              v-model="settingsForm.commentModeration"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          <el-form-item label="每页文章数" prop="postsPerPage">
            <el-input-number
              v-model="settingsForm.postsPerPage"
              :min="1"
              :max="50"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="摘要长度" prop="excerptLength">
            <el-input-number
              v-model="settingsForm.excerptLength"
              :min="50"
              :max="500"
              style="width: 150px"
            />
            <span class="form-hint">文章摘要的字符长度限制</span>
          </el-form-item>
        </div>

        <!-- 联系方式 -->
        <div class="setting-section">
          <h3>联系方式</h3>
          <el-form-item label="管理员邮箱" prop="adminEmail">
            <el-input
              v-model="settingsForm.adminEmail"
              placeholder="请输入管理员邮箱"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="settingsForm.contactPhone"
              placeholder="请输入联系电话"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="联系地址" prop="contactAddress">
            <el-input
              v-model="settingsForm.contactAddress"
              type="textarea"
              :rows="2"
              placeholder="请输入联系地址"
              style="width: 400px"
            />
          </el-form-item>
        </div>

        <!-- 社交媒体 -->
        <div class="setting-section">
          <h3>社交媒体</h3>
          <el-form-item label="微博链接">
            <el-input
              v-model="settingsForm.socialWeibo"
              placeholder="请输入微博链接"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="微信二维码">
            <el-input
              v-model="settingsForm.socialWechat"
              placeholder="请输入微信二维码图片URL"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="GitHub链接">
            <el-input
              v-model="settingsForm.socialGithub"
              placeholder="请输入GitHub链接"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="QQ号码">
            <el-input
              v-model="settingsForm.socialQq"
              placeholder="请输入QQ号码"
              style="width: 200px"
            />
          </el-form-item>
        </div>

        <!-- 统计代码 -->
        <div class="setting-section">
          <h3>统计代码</h3>
          <el-form-item label="百度统计">
            <el-input
              v-model="settingsForm.baiduAnalytics"
              type="textarea"
              :rows="4"
              placeholder="请输入百度统计代码"
              style="width: 500px"
            />
          </el-form-item>
          <el-form-item label="Google Analytics">
            <el-input
              v-model="settingsForm.googleAnalytics"
              type="textarea"
              :rows="4"
              placeholder="请输入Google Analytics代码"
              style="width: 500px"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 数据
const saving = ref(false)

// 表单
const formRef = ref<FormInstance>()
const settingsForm = reactive({
  // 基础设置
  siteName: '我的博客',
  siteDescription: '一个专注于技术分享的个人博客',
  siteKeywords: '博客,技术,分享,前端,后端',
  siteLogo: '',
  
  // SEO设置
  defaultTitle: '我的博客',
  titleSeparator: ' - ',
  metaDescription: '一个专注于技术分享的个人博客，分享前端、后端、架构等技术文章',
  metaKeywords: '博客,技术,分享,前端,后端,Vue,React,Node.js',
  
  // 功能设置
  allowRegister: true,
  commentModeration: true,
  postsPerPage: 10,
  excerptLength: 200,
  
  // 联系方式
  adminEmail: 'admin@example.com',
  contactPhone: '',
  contactAddress: '',
  
  // 社交媒体
  socialWeibo: '',
  socialWechat: '',
  socialGithub: '',
  socialQq: '',
  
  // 统计代码
  baiduAnalytics: '',
  googleAnalytics: ''
})

// 表单校验规则
const formRules: FormRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '网站名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  siteDescription: [
    { required: true, message: '请输入网站描述', trigger: 'blur' },
    { max: 200, message: '网站描述不能超过 200 个字符', trigger: 'blur' }
  ],
  adminEmail: [
    { required: true, message: '请输入管理员邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  postsPerPage: [
    { required: true, message: '请设置每页文章数', trigger: 'blur' }
  ],
  excerptLength: [
    { required: true, message: '请设置摘要长度', trigger: 'blur' }
  ]
}

// 加载设置
const loadSettings = async () => {
  try {
    // 这里应该从后端API获取设置数据
    // const response = await settingsApi.getSettings()
    // Object.assign(settingsForm, response)
    
    // 暂时使用默认值
    console.log('设置已加载')
  } catch (error) {
    ElMessage.error('加载设置失败')
    console.error('加载设置失败:', error)
  }
}

// 保存设置
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 这里应该调用后端API保存设置
    // await settingsApi.updateSettings(settingsForm)
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('设置保存成功')
    console.log('保存的设置:', settingsForm)
  } catch (error) {
    ElMessage.error('设置保存失败')
    console.error('设置保存失败:', error)
  } finally {
    saving.value = false
  }
}

// 初始化
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.admin-settings {
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

.setting-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
}

.setting-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.setting-section h3 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}

.form-hint {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}
</style> 