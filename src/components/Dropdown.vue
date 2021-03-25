<template>
 <div class="dropdown" ref="dropdownRef">
  <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{title}}</a>
  <ul class="dropdown-menu" :style="{display: 'block'}" v-show="isOpen">
    <slot></slot>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null) // dom挂载时命名一样的ref节点就能拿到
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      // console.log('点击是否包含在dropdown里', isClickOutside.value)
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    // const handler = (e: MouseEvent) => {
    //   console.log(dropdownRef.value)
    //   if (dropdownRef.value) {
    //     // (<HTMLElement>e.target) 与 e.target as HTMLElement 都是类型断言
    //     // 判断dropdown节点 不包含e.target节点
    //     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
    //       isOpen.value = false
    //     }
    //   }
    // }
    // onMounted(() => {
    //   document.addEventListener('click', handler)
    // })
    // onUnmounted(() => {
    //   document.removeEventListener('click', handler)
    // })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>

<style>

</style>
