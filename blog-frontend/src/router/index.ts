import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NProgress from 'nprogress'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/posts',
        name: 'Posts',
        component: () => import('@/views/Posts.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: '/posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/PostDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类' }
      },
      {
        path: '/tags',
        name: 'Tags',
        component: () => import('@/views/Tags.vue'),
        meta: { title: '标签' }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: { title: '关于' }
      }
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: '登录', requiresGuest: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { title: '注册', requiresGuest: true }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '仪表板' }
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: () => import('@/views/admin/Posts.vue'),
        meta: { title: '文章管理' }
      },
      {
        path: 'posts/create',
        name: 'CreatePost',
        component: () => import('@/views/admin/CreatePost.vue'),
        meta: { title: '创建文章' }
      },
      {
        path: 'posts/edit/:id',
        name: 'EditPost',
        component: () => import('@/views/admin/EditPost.vue'),
        meta: { title: '编辑文章' }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/Categories.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'tags',
        name: 'AdminTags',
        component: () => import('@/views/admin/Tags.vue'),
        meta: { title: '标签管理' }
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('@/views/admin/Comments.vue'),
        meta: { title: '评论管理' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { title: '用户管理', requiresSuperAdmin: true }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '系统设置', requiresSuperAdmin: true }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人资料', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 路由守卫
router.beforeEach(async (_to, _from, next) => {
  NProgress.start()
  
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = _to.meta.title ? `${_to.meta.title} - 博客系统` : '博客系统'
  
  // 检查认证状态
  if (_to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
    return
  }
  
  // 检查游客页面（已登录用户不能访问）
  if (_to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  // 检查管理员权限
  if (_to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
    return
  }
  
  // 检查超级管理员权限
  if (_to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
    next('/admin')
    return
  }
  
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router 