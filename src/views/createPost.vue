<template>
  <div class="create-post-page">
    <h4>{{isEditMode ?  '编辑文章' : '新建文章'}}</h4>
    <uploader action="/api/upload"
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    :beforeUpload="uploadCheck"
    @file-upload="handleFileUploaded"
    :updated="updateData">
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
        <img :src="dataProps.uploadedData.data.url" alt="">
      </template>
    </uploader>
    <!-- <input type="file" name="file" @change.prevent="handleFileChange"> -->
    <vaildate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <vaildate-input
          type='text'
          :rules="titleRules"
          v-model="titleVal"
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
        <button class="btn btn-primary btn-large">{{isEditMode? '更新文章' : '发表文章'}}</button>
      </template>
    </vaildate-form>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { defineComponent, onMounted, ref } from 'vue'
import VaildateForm from '../components/VaildateForm.vue'
import VaildateInput, { RulesPorp } from '../components/VaildateInput.vue'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import { beforeUploadCheck } from '@/helper'
import createMessage from '@/components/createMessage'

export default defineComponent({
  setup () {
    const updateData = ref()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id // 转换为布尔类型
    const store = useStore<GlobalDataProps>()
    const titleVal = ref('')
    const titleRules: RulesPorp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesPorp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) { // 如果是编辑操作，就请求最新的数据
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            updateData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content
        })
      }
    })
    let imageId = ''
    // 上传文件成功后的处理函数
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      console.log('rawData.data', rawData.data)
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
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? { id: route.query.id, payload: newPost } : newPost
          store.dispatch(actionName, sendData).then(() => {
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
      if (error === 'format') {
        createMessage('上传的图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不超过 1MB', 'error')
      }
      return passed
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      updateData,
      isEditMode
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
