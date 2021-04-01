<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader action="/api/upload"
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    :beforeUpload="uploadCheck"
    @file-upload="handleFileUploaded">
      <h2>点击上传头图</h2>
      <template #loading>
       <div class="f-flex">
          <div class="spinner-border text-secondary" role="status">
        <!-- sr-only -->
          <span class="visually-hidden">Loading...</span>
        </div>
        <h2>正在上传</h2>
       </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadData.data.url" alt="">
      </template>
    </uploader>
    <!-- <input type="file" name="file" @change.prevent="handleFileChange"> -->
    <vaildate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <vaildate-input
          type='text'
          :rules="titleRules"
          v-model="titleValue"
          placeholder="请输入文章标题"
         >
        </vaildate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <vaildate-input
          rows="10"
          :rules="contentRules"
          v-model="contentVal"
          tag="textarea"
          placeholder="请输入文章详情"
          >
          </vaildate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </vaildate-form>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import VaildateForm from '../components/VaildateForm.vue'
import VaildateInput, { RulesPorp } from '../components/VaildateInput.vue'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import { beforeUploadCheck } from '@/helper'
import createMessage from '@/components/createMessage'

export default defineComponent({
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleValue = ref('')
    const titleRules: RulesPorp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesPorp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    let imageId = ''
    // 上传文件成功后的处理函数
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      console.log(result)
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleValue.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          store.dispatch('createPost', newPost).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const uploadCheck = (file: File) => {
      const { passed, error } = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      console.log(passed, error)
      if (error === 'format') {
        createMessage('上传的图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不超过 1MB', 'error')
      }
      return passed
    }
    return {
      titleValue,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded
    }
  },
  components: {
    VaildateForm,
    VaildateInput,
    Uploader
  }
})
</script>

<style>
.create-post-page .file-upload-container{
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img{
  width: 100%;
  height: 100%;
  object-fit: cover;   /* 保持图片比例，充满整个容器  */
}
</style>
