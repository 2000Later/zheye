import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  currentPage: number;
  pageSize: number;
  cid? : any;
}
export default function useLoadMore (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 5 }) {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => params.cid ? {
    currentPage: currentPage.value,
    pageSize: params.pageSize,
    cid: params.cid
  } : {
    currentPage: currentPage.value,
    pageSize: params.pageSize
  })
  console.log(requestParams.value)
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage
  }
}
