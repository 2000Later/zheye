import axios from 'axios'
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
      path: '/signup',
      name: 'signup',
      component: () => import('./views/SignUp.vue')
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
  const { user, token } = store.state
  const { requireLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) { // vuex状态数据没有登陆
    if (token) { // vuex中有token就请求用户信息  vuex自动获取localStorage中的token，或者登陆时设置token
      axios.defaults.headers.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) { // 获取到用户信息后 如果跳转的路由需要重定向
          next('/')
        } else {
          next()
        }
      }).catch(err => { // 伪造的token或者网络问题请求失败
        console.error(err)
        store.commit('logout')
        next('login')
      })
    } else { // 没有token
      if (requireLogin) { // 这个to路由需要登陆那就去登陆
        next('login')
      } else {
        next()
      }
    }
  } else { // vuex状态数据是登陆了的
    if (redirectAlreadyLogin) { // 如果跳转路由要重定向
      next('/')
    } else {
      next()
    }
  }
  // if (to.meta.requireLogin && !store.state.user.isLogin) { // 如果进入这个路由需要登陆 并且没有登陆 那就去登陆
  //   next({ name: 'login' })
  // } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) { // 如果这个路由有redirectAlreadyLogin 并且 已经登陆 那么就去首页
  //   next('/')
  // } else {
  //   next()
  // }
})

export default router
