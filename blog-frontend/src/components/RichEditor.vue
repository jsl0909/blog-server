<template>
  <div class="typora-style-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn" @click="insertBold" title="粗体">
          <strong>B</strong>
        </button>
        <button class="toolbar-btn" @click="insertItalic" title="斜体">
          <em>I</em>
        </button>
        <button class="toolbar-btn" @click="insertStrikethrough" title="删除线">
          <del>S</del>
        </button>
      </div>
      <div class="toolbar-group">
        <button class="toolbar-btn" @click="insertHeading(1)" title="一级标题">H1</button>
        <button class="toolbar-btn" @click="insertHeading(2)" title="二级标题">H2</button>
        <button class="toolbar-btn" @click="insertHeading(3)" title="三级标题">H3</button>
      </div>
      <div class="toolbar-group">
        <button class="toolbar-btn" @click="insertList(false)" title="无序列表">•</button>
        <button class="toolbar-btn" @click="insertList(true)" title="有序列表">1.</button>
        <button class="toolbar-btn" @click="insertQuote" title="引用">"</button>
      </div>
      <div class="toolbar-group">
        <button class="toolbar-btn" @click="insertCode(false)" title="行内代码">`</button>
        <button class="toolbar-btn" @click="insertCode(true)" title="代码块">```</button>
        <button class="toolbar-btn" @click="insertLink" title="链接">🔗</button>
        <button class="toolbar-btn" @click="insertImage" title="图片">🖼️</button>
      </div>
      <div class="toolbar-group">
        <select v-model="currentTheme" @change="changeTheme" class="theme-selector" title="选择主题">
          <option value="dark">深色主题</option>
          <option value="github">GitHub</option>
          <option value="night">Night</option>
          <option value="onelight">OneLight</option>
          <option value="newsprint">Newsprint</option>
          <option value="pixyll">Pixyll</option>
          <option value="whitey">Whitey</option>
        </select>
        <button class="toolbar-btn" @click="toggleOutline" :class="{ active: showOutline }" title="切换大纲">
          📋
        </button>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="editor-container">
      <!-- 大纲面板 -->
      <div class="outline-pane" v-if="showOutline" :class="currentTheme">
        <div class="outline-header">
          <span class="outline-title">大纲</span>
        </div>
        <div class="outline-content">
          <div 
            v-for="(item, index) in outlineItems" 
            :key="index"
            class="outline-item"
            :class="{ 
              'outline-h1': item.level === 1,
              'outline-h2': item.level === 2,
              'outline-h3': item.level === 3,
              'outline-h4': item.level === 4,
              'outline-h5': item.level === 5,
              'outline-h6': item.level === 6
            }"
            @click="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

      <!-- 编辑器面板 -->
      <div class="editor-pane" :class="{ 'full-width': !showOutline }">
        <!-- Typora风格的所见即所得编辑器 -->
        <div 
          ref="editorRef"
          class="typora-editor"
          :class="currentTheme"
          contenteditable="true"
          @input="handleInput"
          @keydown="handleKeydown"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @paste="handlePaste"
          @focus="handleFocus"
          @blur="handleBlur"
          spellcheck="false"
          data-placeholder="开始编写你的Markdown文档..."
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

// 导入主题样式
import '@/themes/github.css'
import '@/themes/night.css'
import '@/themes/onelight.css'
import '@/themes/newsprint.css'
import '@/themes/pixyll.css'
import '@/themes/whitey.css'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const editorRef = ref<HTMLElement>()
const showOutline = ref(true)
const currentTheme = ref('dark')
const markdownContent = ref('')
let isComposing = false
let isUpdating = false
let renderTimeout: number | null = null

// 大纲项目
const outlineItems = ref<Array<{id: string, text: string, level: number}>>([])

// 配置marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 自定义渲染器
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }) => {
  const validLang = !!(lang && hljs.getLanguage(lang))
  const highlighted = validLang ? hljs.highlight(text, { language: lang }).value : hljs.highlightAuto(text).value
  return `<pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>`
}
marked.use({ renderer })

// 解析大纲
const parseOutline = (markdown: string) => {
  const lines = markdown.split('\n')
  const items: Array<{id: string, text: string, level: number}> = []
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = `heading-${index}`
      items.push({ id, text, level })
    }
  })
  
  return items
}

// 将HTML转换为Markdown
const htmlToMarkdown = (html: string): string => {
  // 简单的HTML到Markdown转换
  let markdown = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div>/gi, '\n')
    .replace(/<\/div>/gi, '')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~')
    .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n'
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let index = 1
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${index++}. $1\n`) + '\n'
    })
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
  
  return markdown
}

// 将Markdown转换为HTML并更新编辑器
const updateEditorContent = async (markdown: string) => {
  if (!editorRef.value || isUpdating) return
  
  isUpdating = true
  
  try {
    const html = await marked.parse(markdown || '')
    editorRef.value.innerHTML = html as string
    
    // 更新大纲
    outlineItems.value = parseOutline(markdown)
  } catch (error) {
    console.warn('Markdown解析失败:', error)
  } finally {
    isUpdating = false
  }
}

// 获取当前光标位置
const getCaretPosition = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  
  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(editorRef.value!)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  
  return preCaretRange.toString().length
}

// 设置光标位置
const setCaretPosition = (position: number) => {
  if (!editorRef.value) return
  
  const selection = window.getSelection()
  const range = document.createRange()
  
  let currentPos = 0
  const walker = document.createTreeWalker(
    editorRef.value,
    NodeFilter.SHOW_TEXT,
    null
  )
  
  let node
  while (node = walker.nextNode()) {
    const nodeLength = node.textContent?.length || 0
    if (currentPos + nodeLength >= position) {
      range.setStart(node, position - currentPos)
      range.setEnd(node, position - currentPos)
      break
    }
    currentPos += nodeLength
  }
  
  selection?.removeAllRanges()
  selection?.addRange(range)
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== markdownContent.value) {
    markdownContent.value = newValue || ''
    updateEditorContent(newValue || '').catch(console.error)
  }
}, { immediate: true })

// 处理输入
const handleInput = () => {
  if (isUpdating) return
  
  const html = editorRef.value?.innerHTML || ''
  const markdown = htmlToMarkdown(html)
  
  if (markdown !== markdownContent.value) {
    markdownContent.value = markdown
    emit('update:modelValue', markdown)
    
    // 防抖重新渲染以显示Markdown效果
    if (renderTimeout) {
      clearTimeout(renderTimeout)
    }
    renderTimeout = window.setTimeout(() => {
      if (!isUpdating) {
        updateEditorContent(markdown).catch(console.error)
      }
      renderTimeout = null
    }, 300)
  }
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (isComposing) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    return
  }
  
  // 处理Tab键
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertText', false, '  ')
  }
  
  // 处理Markdown快捷键
  if (e.key === ' ' || e.key === 'Enter') {
    const position = getCaretPosition()
    if (position !== null) {
      const text = editorRef.value?.textContent || ''
      const lineStart = text.lastIndexOf('\n', position - 1) + 1
      const line = text.substring(lineStart, position)
      
      // 处理标题
      if (line.match(/^#{1,6}$/)) {
        e.preventDefault()
        const level = line.length
        document.execCommand('insertText', false, ' ')
        // 立即渲染标题
        setTimeout(() => {
          const html = editorRef.value?.innerHTML || ''
          const markdown = htmlToMarkdown(html)
          updateEditorContent(markdown).catch(console.error)
        }, 10)
      }
      
      // 处理列表
      if (line.match(/^[-*+]\s*$/)) {
        e.preventDefault()
        document.execCommand('insertText', false, ' ')
        setTimeout(() => {
          const html = editorRef.value?.innerHTML || ''
          const markdown = htmlToMarkdown(html)
          updateEditorContent(markdown).catch(console.error)
        }, 10)
      }
      
      if (line.match(/^\d+\.\s*$/)) {
        e.preventDefault()
        document.execCommand('insertText', false, ' ')
        setTimeout(() => {
          const html = editorRef.value?.innerHTML || ''
          const markdown = htmlToMarkdown(html)
          updateEditorContent(markdown).catch(console.error)
        }, 10)
      }
    }
  }
  
  // 处理其他Markdown语法触发字符
  if (e.key === '*' || e.key === '_' || e.key === '`' || e.key === '~' || e.key === '#') {
    // 延迟渲染以显示Markdown效果
    setTimeout(() => {
      const html = editorRef.value?.innerHTML || ''
      const markdown = htmlToMarkdown(html)
      updateEditorContent(markdown).catch(console.error)
    }, 100)
  }
}

// 处理输入法开始
const handleCompositionStart = () => {
  isComposing = true
}

// 处理输入法结束
const handleCompositionEnd = () => {
  isComposing = false
}

// 处理粘贴
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

// 处理焦点
const handleFocus = () => {
  editorRef.value?.classList.add('focused')
}

// 处理失焦
const handleBlur = () => {
  editorRef.value?.classList.remove('focused')
}

// 插入文本
const insertText = (text: string) => {
  if (!editorRef.value) return
  
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(text))
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    document.execCommand('insertText', false, text)
  }
  
  // 触发输入事件
  handleInput()
}

// 工具栏功能
const insertBold = () => {
  document.execCommand('bold', false)
  handleInput()
}

const insertItalic = () => {
  document.execCommand('italic', false)
  handleInput()
}

const insertStrikethrough = () => {
  document.execCommand('strikethrough', false)
  handleInput()
}

const insertHeading = (level: number) => {
  const prefix = '#'.repeat(level) + ' '
  insertText(prefix)
}

const insertList = (ordered: boolean = false) => {
  const prefix = ordered ? '1. ' : '- '
  insertText(prefix)
}

const insertQuote = () => {
  insertText('> ')
}

const insertCode = (block: boolean = false) => {
  if (block) {
    insertText('\n```\n\n```\n')
  } else {
    insertText('`')
  }
}

const insertLink = () => {
  insertText('[链接文本](url)')
}

const insertImage = () => {
  insertText('![图片描述](url)')
}

const toggleOutline = () => {
  showOutline.value = !showOutline.value
}

const changeTheme = () => {
  console.log('切换到主题:', currentTheme.value)
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  console.log('滚动到标题:', id)
}

onMounted(() => {
  // 初始化内容
  markdownContent.value = props.modelValue || ''
  updateEditorContent(props.modelValue || '').catch(console.error)
  
  // 聚焦到编辑器
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  })
})

// 清理定时器
onUnmounted(() => {
  if (renderTimeout) {
    clearTimeout(renderTimeout)
    renderTimeout = null
  }
})
</script>

<style scoped>
.typora-style-editor {
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding-right: 12px;
  border-right: 1px solid #d0d7de;
}

.toolbar-group:last-child {
  border-right: none;
  margin-left: auto;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #656d76;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #d0d7de;
  color: #0969da;
}

.toolbar-btn.active {
  background: #0969da;
  color: white;
  border-color: #0969da;
}

.theme-selector {
  padding: 4px 8px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: white;
  color: #656d76;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.theme-selector:hover {
  border-color: #0969da;
  color: #0969da;
}

.theme-selector:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.2);
}

.toolbar-btn strong {
  font-weight: bold;
}

.toolbar-btn em {
  font-style: italic;
}

.toolbar-btn del {
  text-decoration: line-through;
}

.editor-container {
  display: flex;
  height: 500px;
}

.editor-pane {
  flex: 1;
  border-right: 1px solid #e1e4e8;
  transition: all 0.3s ease;
  background: white;
}

.editor-pane.full-width {
  flex: 1;
  border-right: none;
}

.typora-editor {
  height: 100%;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #24292f;
  background: white;
  overflow-y: auto;
  outline: none;
  cursor: text;
  position: relative;
}

.typora-editor:focus {
  outline: none;
}

.typora-editor:empty:before {
  content: attr(data-placeholder);
  color: #8c959f;
  pointer-events: none;
  position: absolute;
  top: 20px;
  left: 20px;
}

/* 深色主题 */
.typora-editor.dark {
  background: #1e1e1e;
  color: #e1e1e1;
}

.typora-editor.dark h1 {
  font-size: 2.2em;
  font-weight: 700;
  margin: 32px 0 20px 0;
  padding-bottom: 12px;
  color: #4fc3f7;
  border-bottom: 2px solid #333;
  letter-spacing: -0.02em;
}

.typora-editor.dark h2 {
  font-size: 1.6em;
  font-weight: 600;
  margin: 28px 0 16px 0;
  padding-bottom: 8px;
  color: #ffffff;
  border-bottom: 1px solid #333;
}

.typora-editor.dark h3 {
  font-size: 1.3em;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #ffffff;
}

.typora-editor.dark p {
  margin: 16px 0;
  color: #e1e1e1;
  line-height: 1.8;
}

.typora-editor.dark ul, .typora-editor.dark ol {
  margin: 16px 0;
  padding-left: 28px;
}

.typora-editor.dark li {
  margin: 8px 0;
  color: #e1e1e1;
  line-height: 1.6;
}

.typora-editor.dark blockquote {
  margin: 20px 0;
  padding: 16px 20px;
  color: #b0b0b0;
  border-left: 4px solid #4fc3f7;
  background: #2a2a2a;
  border-radius: 0 6px 6px 0;
  font-style: italic;
}

.typora-editor.dark code {
  padding: 3px 8px;
  background: #2d2d2d;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, 'Courier New', monospace;
  font-size: 90%;
  color: #00e676;
  border: 1px solid #404040;
}

.typora-editor.dark pre {
  padding: 20px;
  background: #2d2d2d;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #404040;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.typora-editor.dark pre code {
  background: none;
  padding: 0;
  border: none;
  color: #e1e1e1;
  font-size: 14px;
  line-height: 1.5;
}

.typora-editor.dark a {
  color: #4fc3f7;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.typora-editor.dark a:hover {
  color: #81d4fa;
  border-bottom-color: #81d4fa;
}

.typora-editor.dark strong {
  color: #ffffff;
  font-weight: 600;
}

.typora-editor.dark em {
  color: #b0b0b0;
  font-style: italic;
}

.typora-editor.dark del {
  color: #ff6b6b;
  text-decoration: line-through;
}

/* GitHub主题 */
.typora-editor.github {
  background: #ffffff;
  color: #24292f;
}

.typora-editor.github h1 {
  font-size: 2.25em;
  line-height: 1.2;
  border-bottom: 1px solid #d0d7de;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  color: #24292f;
}

.typora-editor.github h2 {
  font-size: 1.75em;
  line-height: 1.225;
  border-bottom: 1px solid #d0d7de;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  color: #24292f;
}

.typora-editor.github h3 {
  font-size: 1.5em;
  line-height: 1.43;
  margin: 24px 0 16px 0;
  color: #24292f;
}

.typora-editor.github p {
  margin: 16px 0;
  color: #24292f;
  line-height: 1.6;
}

.typora-editor.github a {
  color: #0969da;
  text-decoration: none;
}

.typora-editor.github a:hover {
  text-decoration: underline;
}

.typora-editor.github code {
  padding: 2px 6px;
  background: #f6f8fa;
  border-radius: 6px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
  color: #24292f;
}

.typora-editor.github pre {
  padding: 16px;
  background: #f6f8fa;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
}

.typora-editor.github blockquote {
  margin: 16px 0;
  padding: 0 16px;
  color: #656d76;
  border-left: 4px solid #d0d7de;
}

/* 通用Markdown样式 */
.typora-editor h1,
.typora-editor h2,
.typora-editor h3,
.typora-editor h4,
.typora-editor h5,
.typora-editor h6 {
  font-weight: bold;
  margin: 16px 0 8px 0;
}

.typora-editor strong {
  font-weight: bold;
}

.typora-editor em {
  font-style: italic;
}

.typora-editor del {
  text-decoration: line-through;
}

.typora-editor code {
  background: #f6f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

.typora-editor pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
}

.typora-editor pre code {
  background: none;
  padding: 0;
}

.typora-editor blockquote {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  margin: 16px 0;
  color: #6a737d;
}

.typora-editor ul,
.typora-editor ol {
  padding-left: 24px;
  margin: 16px 0;
}

.typora-editor li {
  margin: 4px 0;
}

/* 滚动条样式 */
.typora-editor::-webkit-scrollbar {
  width: 8px;
}

.typora-editor::-webkit-scrollbar-track {
  background: #f6f8fa;
}

.typora-editor::-webkit-scrollbar-thumb {
  background: #d0d7de;
  border-radius: 4px;
}

.typora-editor::-webkit-scrollbar-thumb:hover {
  background: #8c959f;
}

/* 深色主题滚动条 */
.typora-editor.dark::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.typora-editor.dark::-webkit-scrollbar-thumb {
  background: #404040;
}

.typora-editor.dark::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.outline-pane {
  width: 280px;
  border-right: 1px solid #e1e4e8;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.outline-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
  background: #ffffff;
}

.outline-title {
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

.outline-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.outline-item {
  padding: 6px 20px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;
  color: #656d76;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.outline-item:hover {
  background: #f3f4f6;
  color: #0969da;
}

.outline-item.outline-h1 {
  font-weight: 600;
  color: #24292f;
  padding-left: 20px;
}

.outline-item.outline-h2 {
  padding-left: 32px;
  color: #24292f;
}

.outline-item.outline-h3 {
  padding-left: 44px;
  color: #656d76;
}

.outline-item.outline-h4 {
  padding-left: 56px;
  color: #656d76;
  font-size: 12px;
}

.outline-item.outline-h5 {
  padding-left: 68px;
  color: #656d76;
  font-size: 12px;
}

.outline-item.outline-h6 {
  padding-left: 80px;
  color: #656d76;
  font-size: 12px;
}

/* 深色主题大纲 */
.outline-pane.dark {
  background: #2a2a2a;
  border-right: 1px solid #404040;
}

.outline-pane.dark .outline-header {
  background: #333;
  border-bottom: 1px solid #404040;
}

.outline-pane.dark .outline-title {
  color: #e1e1e1;
}

.outline-pane.dark .outline-item {
  color: #b0b0b0;
}

.outline-pane.dark .outline-item:hover {
  background: #404040;
  color: #4fc3f7;
}

.outline-pane.dark .outline-item.outline-h1 {
  color: #ffffff;
}

.outline-pane.dark .outline-item.outline-h2 {
  color: #e1e1e1;
}

/* GitHub主题大纲 */
.outline-pane.github {
  background: #f6f8fa;
  border-right: 1px solid #d0d7de;
}

.outline-pane.github .outline-header {
  background: #ffffff;
  border-bottom: 1px solid #d0d7de;
}

.outline-pane.github .outline-title {
  color: #24292f;
}

.outline-pane.github .outline-item {
  color: #656d76;
}

.outline-pane.github .outline-item:hover {
  background: #f3f4f6;
  color: #0969da;
}

.outline-pane.github .outline-item.outline-h1 {
  color: #24292f;
}

.outline-pane.github .outline-item.outline-h2 {
  color: #24292f;
}

/* 大纲滚动条 */
.outline-content::-webkit-scrollbar {
  width: 6px;
}

.outline-content::-webkit-scrollbar-track {
  background: transparent;
}

.outline-content::-webkit-scrollbar-thumb {
  background: #d0d7de;
  border-radius: 3px;
}

.outline-content::-webkit-scrollbar-thumb:hover {
  background: #8c959f;
}

/* 深色主题大纲滚动条 */
.outline-pane.dark .outline-content::-webkit-scrollbar-thumb {
  background: #404040;
}

.outline-pane.dark .outline-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
    height: auto;
  }
  
  .editor-pane {
    border-right: none;
    border-bottom: 1px solid #e1e4e8;
  }
  
  .toolbar-group {
    padding-right: 8px;
  }
  
  .toolbar-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .theme-selector {
    font-size: 11px;
    padding: 3px 6px;
  }
}
</style>