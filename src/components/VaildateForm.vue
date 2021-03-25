<template>
  <form class="vaildate-form-container">
      <slot></slot>
      <div class="submit-area" @click.prevent="submitForm">
          <slot name="submit">
              <button class="btn btn-primary">提交</button>
          </slot>
      </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
interface VaildateFunc {
  (): () => number;
}
// type VaildateFunc = () => boolean
export const emitter = mitt()

export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: VaildateFunc[] = []
    const submitForm = () => {
      // 遍历表单中所有的验证方法，调用验证方法，保存所有的返回值，所有返回值有一个为false，那么就将返回值给最后的result
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // // 将监听得到的验证函数都存到一个数组中
    const callback = (func?: VaildateFunc) => {
      if (typeof func === 'undefined') return
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 删除监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>

</style>
