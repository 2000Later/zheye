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
   <button class="btn btn-outline-primary mt-2 mb-5 mx-auto d-block w-25"
    @click="loadMorePage"
    v-if="!isLastPage" >加载更多</button>
 </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store'
import PostList from '../components/PostList.vue'
import { generateFitUrl } from '@/helper'
import useLoadMore from '@/hooks/useLoadMore'
export default defineComponent({
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id as string
    const total = computed(() => {
      if (store.state.posts.loadedColumns[currentId]) {
        return store.state.posts.loadedColumns[currentId].total || 0
      }
      return 0
    })
    const currentPage = computed(() => {
      if (store.state.posts.loadedColumns[currentId]) {
        return store.state.posts.loadedColumns[currentId].currentPage || 0
      }
      return 0
    })
    onMounted(() => {
      // 请求并存储数据
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { pageSize: 3, cid: currentId })
    })
    const column = computed(() => {
      const selecColumn = store.getters.getColumnById(currentId) as ColumnProps
      if (selecColumn) {
        generateFitUrl(selecColumn, 100, 100)
      }
      return selecColumn
    })
    const list = computed(() => store.getters.getPostsBycId(currentId))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total,
      { pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2), cid: currentId })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  },
  components: {
    PostList
  }
})
</script>

<style>

</style>
