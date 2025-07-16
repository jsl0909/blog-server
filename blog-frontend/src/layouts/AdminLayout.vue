<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/admin">仪表盘</router-link></li>
          <li><router-link to="/admin/posts">文章管理</router-link></li>
          <li><router-link to="/admin/categories">分类管理</router-link></li>
          <li><router-link to="/admin/tags">标签管理</router-link></li>
          <li><router-link to="/admin/comments">评论管理</router-link></li>
          <li><router-link to="/admin/users">用户管理</router-link></li>
          <li><router-link to="/admin/settings">系统设置</router-link></li>
        </ul>
      </nav>
    </aside>
    <div class="main">
      <header class="header">
        <h2>博客后台管理</h2>
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 后台管理布局
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 200px;
  background: #2d3a4b;
  color: #fff;
  padding: 20px 0;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 16px 0;
}
.sidebar a {
  color: #fff;
  text-decoration: none;
}
.main {
  flex: 1;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}
.header {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
main {
  flex: 1;
  padding: 24px;
}
</style> 