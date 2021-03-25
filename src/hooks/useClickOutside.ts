import { onMounted, onUnmounted, ref, Ref } from 'vue'
export default function useClickOutside (elementRef: Ref<null | HTMLElement>) {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      // (<HTMLElement>e.target) 与 e.target as HTMLElement 都是类型断言
    //   console.log(elementRef.value.contains(e.target as HTMLElement))
      // 判断dropdown节点 包含e.target节点
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
      // 是否包含在elementRef节点中
      //   isClickOutside.value = elementRef.value.contains(e.target as HTMLElement)
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}
