<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <Loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,.8)"/>
    <message type="error" :message="error.message" v-if="error.status"></message>
    <h2>{{error.message}}</h2>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">@ 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GlobalDataProps } from './store'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import Message from './components/Message.vue'
import createMessage from './components/createMessage'

export default defineComponent({
  name: 'App',
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      // 没有登陆并且token存在 就获取用户信息数据
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    // watch第一个参数希望是个对象类型 函数也是对象
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  },
  components: {
    GlobalHeader,
    Loader,
    Message
  }
})
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
