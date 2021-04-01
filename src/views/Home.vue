<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="py-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <uploader action="/api/upload" :beforeUpload="beforeUpload" @file-upload="onFileUpload">
      <template #success="slotScope">
        {{slotScope}}
        <img :src="slotScope.uploadData.data.url" alt="">
      </template>
      <template #loading>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </template>
    </uploader>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ColumnList from '@/components/ColumnList.vue'
import Uploader from '@/components/Uploader.vue'
import { GlobalDataProps, ResponseType, ImageProps } from '../store'
import createMessage from '@/components/createMessage'

export default defineComponent({
  setup () {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => store.state.columns)
    const biggerColumnsLen = computed(() => store.getters.biggerColumnsLen)
    const beforeUpload = (file: File) => {
      console.log(file)
      const isPng = (file.type === 'image/png')
      console.log(isPng)
      if (!isPng) { // 如果不是png 就给个提示
        createMessage('上传的图片只能是 PNG 格式！', 'error')
      }
      return isPng
    }
    const onFileUpload = (rowDate: ResponseType<ImageProps>) => {
      createMessage(`上传的文件ID${rowDate.data._id}`, 'success')
    }
    return {
      list,
      biggerColumnsLen,
      beforeUpload,
      onFileUpload
    }
  },
  components: {
    ColumnList,
    Uploader
  }

})
</script>

<style>

</style>
