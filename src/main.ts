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
  return config
})

axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 2000)
  return config
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
