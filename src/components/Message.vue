<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
    :class="classObject"
    v-if="isVisible"
    role="alert">
        <span>{{message}}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="hide">
            <!-- <span aria-hidden="true">&times;</span> -->
        </button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup (props, context) {
    useDOMCreate('message')
    const isVisible = ref<boolean>(true)
    const classObject = {
      'alert-primary': props.type === 'default',
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error'
    }
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', true)
    }
    return {
      classObject,
      hide,
      isVisible
    }
  }
})
</script>

<style>

</style>
