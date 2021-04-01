<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
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
import { defineComponent, ref } from 'vue'
import VaildateForm from '../components/VaildateForm.vue'
import VaildateInput, { RulesPorp } from '../components/VaildateInput.vue'
import { GlobalDataProps, PostProps } from '@/store'
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
    const onFormSubmit = (result: boolean) => {
      console.log(result)
      if (result) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            _id: Date.now().toString(),
            title: titleValue.value,
            content: contentVal.value,
            column,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    return {
      titleValue,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit
    }
  },
  components: {
    VaildateForm,
    VaildateInput
  }
})
</script>

<style>

</style>
