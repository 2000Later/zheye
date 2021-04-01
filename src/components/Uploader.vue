<template>
  <div class="file-upload">
    <div v-bind="$attrs" class="file-upload-container" @click.prevent="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadData="uploadData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
      <!-- <button class="btn btn-primary" @click.prevent="triggerUpload">
        <span v-if="fileStatus === 'loading'">正在上传...</span>
        <span v-else-if="fileStatus === 'success'">上传成功...</span>
        <span v-else>点击上传</span>
      </button> -->
      <input
        ref="fileInput"
        type="file"
        class="file-input d-none"
        multiple
        @change="handleFileChange">
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, ref } from 'vue'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file: File) => boolean
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<checkFunction>
    }
  },
  inheritAttrs: false, // 关闭属性绑定到组件根元素上 $attrs
  emits: ['file-upload', 'file-upload-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<null | UploadStatus>('ready')
    const uploadData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files) // 将伪数组转换为array
        // if (props.beforeUpload && !props.beforeUpload(files[0])) return // 如果上传之前的函数存在，并返回false就不在继续执行
        console.log('files[0]', files[0])
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formDate = new FormData()
        formDate.append('file', files[0])
        axios.post(props.action, formDate, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resp) => {
          console.log(resp.data)
          uploadData.value = resp.data
          context.emit('file-upload', resp.data)
          fileStatus.value = 'success'
        }).catch((error) => {
          context.emit('file-upload-error', { error })
          fileStatus.value = 'error'
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      fileStatus,
      triggerUpload,
      handleFileChange,
      uploadData
    }
  }
})
</script>

<style>

</style>
