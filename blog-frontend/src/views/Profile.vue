<template>
  <div class="profile">
    <div class="content-card">
      <h1>个人日志</h1>
      <div class="profile-content">
        <p>这里是我的个人日志页面，记录一些日常思考和生活感悟。</p>
        
        <!-- 添加新日志按钮 -->
        <div class="add-journal-section" v-if="authStore.isAuthenticated">
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加日志
          </el-button>
        </div>
        
        <div class="journal-list">
          <div 
            v-for="journal in journals" 
            :key="journal.id" 
            class="journal-item"
            @click="viewJournal(journal)"
          >
            <div class="journal-header">
              <div class="journal-date">{{ formatDate(journal.date) }}</div>
              <div class="journal-actions" v-if="authStore.isAuthenticated">
                <el-button 
                  size="small" 
                  type="text" 
                  @click.stop="editJournal(journal)"
                >
                  <el-icon><EditPen /></el-icon>
                </el-button>
                <el-button 
                  size="small" 
                  type="text" 
                  @click.stop="deleteJournal(journal.id)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="journal-title">{{ journal.title }}</div>
            <div class="journal-excerpt">{{ journal.content }}</div>
            <div class="journal-mood" v-if="journal.mood">
              <span class="mood-emoji">{{ journal.mood }}</span>
              <span class="mood-text">{{ getMoodText(journal.mood) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="journals.length === 0" class="empty-state">
          <p>暂无日志记录</p>
          <el-button v-if="authStore.isAuthenticated" type="primary" @click="showAddDialog = true">
            写第一篇日志
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑日志对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="editingJournal ? '编辑日志' : '添加日志'"
      width="600px"
    >
      <el-form :model="journalForm" :rules="journalRules" ref="journalFormRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="journalForm.title" placeholder="请输入日志标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="journalForm.content" 
            type="textarea" 
            :rows="6"
            placeholder="写下你的想法和感悟..."
          />
        </el-form-item>
        <el-form-item label="心情">
          <el-select v-model="journalForm.mood" placeholder="选择心情">
            <el-option label="😊 开心" value="😊" />
            <el-option label="😔 难过" value="😔" />
            <el-option label="😤 愤怒" value="😤" />
            <el-option label="😌 平静" value="😌" />
            <el-option label="🤔 思考" value="🤔" />
            <el-option label="😴 疲惫" value="😴" />
            <el-option label="🎉 兴奋" value="🎉" />
            <el-option label="💪 充满干劲" value="💪" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveJournal">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 查看日志对话框 -->
    <el-dialog 
      v-model="showViewDialog" 
      title="日志详情"
      width="600px"
    >
      <div v-if="viewingJournal" class="journal-detail">
        <div class="detail-header">
          <h3>{{ viewingJournal.title }}</h3>
          <div class="detail-date">{{ formatDate(viewingJournal.date) }}</div>
          <div class="detail-mood" v-if="viewingJournal.mood">
            <span class="mood-emoji">{{ viewingJournal.mood }}</span>
            <span class="mood-text">{{ getMoodText(viewingJournal.mood) }}</span>
          </div>
        </div>
        <div class="detail-content">{{ viewingJournal.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Journal {
  id: number
  title: string
  content: string
  date: string
  mood?: string
}

const authStore = useAuthStore()
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const editingJournal = ref<Journal | null>(null)
const viewingJournal = ref<Journal | null>(null)
const journalFormRef = ref()

const journals = ref<Journal[]>([
  {
    id: 1,
    title: '新年新计划',
    content: '新的一年开始了，制定一些技术学习和个人成长的计划。希望今年能够掌握更多新技术，提升自己的编程能力，同时也要注意身体健康，保持工作与生活的平衡。',
    date: '2024-01-15T10:00:00Z',
    mood: '💪'
  },
  {
    id: 2,
    title: '技术思考',
    content: '最近在思考前端架构设计的一些问题，记录一下心得。Vue 3的Composition API确实带来了更好的代码组织和复用性，但同时也需要更多的学习成本。',
    date: '2024-01-10T14:30:00Z',
    mood: '🤔'
  },
  {
    id: 3,
    title: '生活感悟',
    content: '工作与生活的平衡是一个永恒的话题，今天有一些新的感悟。有时候我们需要慢下来，享受生活中的小确幸，比如一杯咖啡，一段音乐，或者一个安静的午后。',
    date: '2024-01-05T16:45:00Z',
    mood: '😌'
  }
])

const journalForm = reactive({
  title: '',
  content: '',
  mood: ''
})

const journalRules = {
  title: [
    { required: true, message: '请输入日志标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入日志内容', trigger: 'blur' }
  ]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMoodText = (mood: string) => {
  const moodMap: Record<string, string> = {
    '😊': '开心',
    '😔': '难过',
    '😤': '愤怒',
    '😌': '平静',
    '🤔': '思考',
    '😴': '疲惫',
    '🎉': '兴奋',
    '💪': '充满干劲'
  }
  return moodMap[mood] || '未知'
}

const viewJournal = (journal: Journal) => {
  viewingJournal.value = journal
  showViewDialog.value = true
}

const editJournal = (journal: Journal) => {
  editingJournal.value = journal
  journalForm.title = journal.title
  journalForm.content = journal.content
  journalForm.mood = journal.mood || ''
  showAddDialog.value = true
}

const deleteJournal = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇日志吗？', '确认删除', {
      type: 'warning'
    })
    
    const index = journals.value.findIndex(j => j.id === id)
    if (index > -1) {
      journals.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const saveJournal = async () => {
  try {
    await journalFormRef.value.validate()
    
    if (editingJournal.value) {
      // 编辑现有日志
      const index = journals.value.findIndex(j => j.id === editingJournal.value!.id)
      if (index > -1) {
        journals.value[index] = {
          ...editingJournal.value,
          title: journalForm.title,
          content: journalForm.content,
          mood: journalForm.mood
        }
      }
      ElMessage.success('更新成功')
    } else {
      // 添加新日志
      const newJournal: Journal = {
        id: Date.now(),
        title: journalForm.title,
        content: journalForm.content,
        date: new Date().toISOString(),
        mood: journalForm.mood
      }
      journals.value.unshift(newJournal)
      ElMessage.success('添加成功')
    }
    
    // 重置表单
    journalForm.title = ''
    journalForm.content = ''
    journalForm.mood = ''
    editingJournal.value = null
    showAddDialog.value = false
  } catch (error) {
    console.error('保存失败:', error)
  }
}

onMounted(() => {
  // 按日期排序
  journals.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
</script>

<style scoped>
.profile {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.profile-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
}

.add-journal-section {
  text-align: center;
  margin-bottom: 40px;
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.journal-item {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.journal-item:hover {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.journal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.journal-date {
  font-size: 14px;
  color: #999;
}

.journal-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.journal-item:hover .journal-actions {
  opacity: 1;
}

.journal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.journal-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.journal-mood {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mood-emoji {
  font-size: 18px;
}

.mood-text {
  font-size: 14px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-bottom: 20px;
}

/* 日志详情样式 */
.journal-detail {
  padding: 20px 0;
}

.detail-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.detail-date {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.detail-mood {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-content {
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
  white-space: pre-wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile {
    padding: 20px 15px;
  }
  
  .content-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .profile-content p {
    font-size: 1rem;
  }
  
  .journal-item {
    padding: 20px;
  }
  
  .journal-title {
    font-size: 1.125rem;
  }
  
  .journal-actions {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .journal-item {
    padding: 16px;
  }
}
</style> 