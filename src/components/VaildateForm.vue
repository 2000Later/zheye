<template>
  <form class="vaildate-form-container">
      <slot name="default"></slot>
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
// interface VaildateFunc {
//   name: () => boolean;
// }
// VaildateFunc['name']
type VaildateFunc = () => boolean

// 使用事件监听器的原因：父组件中有多个子组件，slot不能使用自定义事件
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
    // // 将监听得到的验证函数（func 也就是发射事件时携带的参数）都存到一个数组中
    const callback = (func?: VaildateFunc) => {
      if (typeof func === 'undefined') return
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    // 清空表单
    const resetInput = () => {
      emitter.emit('resetInput')
    }
    onUnmounted(() => {
      // 删除监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm,
      resetInput
    }
  }
})
</script>

<style>
.btn-block{
  display: block;
  width: 100%;
}
</style>
