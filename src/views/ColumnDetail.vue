<template>
 <div class="column-detail-page w-75 mx-auto">
   <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
     <div class="col-3 text-center">
       <img :src="column.avatar && column.avatar.fitUrl" :alt="column.titie" class="rounded-circle border w-100">
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
import { GlobalDataProps, ColumnProps } from '../store'
import PostList from '../components/PostList.vue'
import { generateFitUrl } from '@/helper'
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
      const selecColumn = store.getters.getColumnById(currentId) as ColumnProps
      if (selecColumn) {
        generateFitUrl(selecColumn, 100, 100)
      }
      return selecColumn
    })
    const list = computed(() => store.getters.getPostsById(currentId))
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
