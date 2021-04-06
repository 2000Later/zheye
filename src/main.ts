import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import store from './store'
import router from './router'

// axios.defaults.baseURL = '/api'
// axios.get('/api1/columns').then(res => {
//   console.log(res)
// })
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  // 每次请求重置状态
  store.commit('setError', { status: false, message: '' })
  return config
})

axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 500)
  return config
}, err => {
  const { error } = err.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  // throw Error(error)
  return Promise.reject(error) // 返回的错误须后面要捕获
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
