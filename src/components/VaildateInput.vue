<template>
  <div class="vaildate-input-container pb-3">
    <input
        v-if="tag!=='textarea'"
        class="form-control"
        :class="{'is-invalid ': inputRef.error}"
        @blur="vaildateInput"
        :value="inputRef.val"
        @input="updateValue"
        v-bind="$attrs"/>
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid ': inputRef.error}"
      @blur="vaildateInput"
      :value="inputRef.val"
      @input="updateValue"
      v-bind="$attrs">
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback" >{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive } from 'vue'
import { emitter } from './VaildateForm.vue'
const emailReg = /^[0-9a-zA-z_.-]+[@][0-9a-zA-Z_.-]+([.][0-9a-z]+){1,2}$/

interface RulePorp {
  type: 'required' | 'email';
  message: string;
}

export type RulesPorp = RulePorp[]
export type TageType = 'input' | 'textarea'
export default defineComponent({
  name: 'VaildateInput',
  props: {
    rules: {
      type: Array as PropType<RulesPorp>
    },
    modelValue: String,
    tag: {
      type: String as PropType<TageType>,
      default: 'input'
    }
  },
  inheritAttrs: false, // inheritAttrs: false 和 $attrs，你就可以手动决定这些 attribute 会被赋予哪个元素。
  setup (props, context) {
    // console.log(context.attrs) // 在通过v-bind="$attrs" 绑定到根组件传入属性，的子元素上
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    // 用于实现根组件双向绑定 v-model
    const updateValue = (e: KeyboardEvent) => {
      // 获取input value值
      const targetValue = (e.target as HTMLInputElement).value
      // 将input值给 当inputRef便于验证
      inputRef.val = targetValue
      // 发射更新事件给根标签更新值
      context.emit('update:modelValue', targetValue)
    }
    // 用于验证输入值是否合法
    const vaildateInput = () => {
      if (props.rules) {
        // 只要有一个为false 那么就为false
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required': passed = (inputRef.val.trim() !== '')
              break
            case 'email': passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', vaildateInput)
    })
    return {
      inputRef,
      vaildateInput,
      updateValue
    }
  }
})
</script>

<style>

</style>
