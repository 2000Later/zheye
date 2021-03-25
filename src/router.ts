import { createRouter, createWebHistory } from 'vue-router'
import store from './store'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: () => import('./views/ColumnDetail.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('./views/createPost.vue'),
      meta: { requireLogin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin && !store.state.user.isLogin) { // 如果进入这个路由需要登陆 并且没有登陆 那就去登陆
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) { // 如果这个路由有redirectAlreadyLogin 并且 已经登陆 那么就去首页
    next('/')
  } else {
    next()
  }
})

export default router
