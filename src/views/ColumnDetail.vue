<template>
 <div class="column-detail-page w-75 mx-auto">
   <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
     <div class="col-3 text-center">
       <img :src="column.avatar.url" :alt="column.titie" class="rounded-circle border w-100">
     </div>
    <div class="col-9">
     <h4>{{column.title}}</h4>
     <p class="text-muted">{{column.description}}</p>
   </div>
   </div>
   <post-list :list="list"></post-list>
 </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id
    onMounted(() => {
      // 请求并存储数据
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed(() => {
      const column = store.getters.getColumnById(currentId)
      if (column && !column.avatar.url) {
        column.avatar.url = require('@/assets/column.jpg')
      }
      return column
    })
    const list = computed(() => store.getters.getPostsById(currentId))
    console.log(list)
    // console.log(column, list)
    return {
      column,
      list
    }
  },
  components: {
    PostList
  }
})
</script>

<style>

</style>
