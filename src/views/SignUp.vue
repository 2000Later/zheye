<template>
  <div class="singup-page mx-auto p-3 w-330">
      <h5 class="my-4 text-center">注册者也账户</h5>
      <VaildateForm ref="formRef" @formSubmit="onFormSubmit">
         <div class="mb-3">
            <label class="form-label">邮箱地址</label>
            <VaildateInput type="text" :rules="emailRules" v-model="formData.email" placeholder="请输入邮箱地址" />
         </div>
         <div class="mb-3">
            <label class="form-label">昵称</label>
            <VaildateInput type="text" :rules="nickNameRules" v-model="formData.nickName" placeholder="请输入昵称" />
         </div>
         <div class="mb-3">
            <label class="form-label">密码</label>
            <VaildateInput type="password" :rules="passwordRules" v-model="formData.password" placeholder="请输入密码" />
         </div>
         <div class="mb-3">
            <label class="form-label">重复密码</label>
            <VaildateInput type="password" :rules="repeatPasswordRules" v-model="formData.repeatPassword" placeholder="请再次输入密码" />
         </div>
         <!-- #submit 相当于 v-slot="submit" -->
         <template #submit>
             <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
         </template>
      </VaildateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import VaildateForm from '@/components/VaildateForm.vue'
import VaildateInput, { RulesPorp } from '@/components/VaildateInput.vue'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'

export default defineComponent({
  setup () { // setup代替的是beforeCreate和created
    const formRef = ref<any>('')
    const router = useRouter()
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesPorp = [
      { type: 'required', message: '请输入邮箱' },
      { type: 'email', message: '请输入合法邮箱' }
    ]
    const nickNameRules: RulesPorp = [
      { type: 'required', message: '请输入昵称' }
    ]
    const passwordRules: RulesPorp = [
      { type: 'required', message: '请输入密码' }
    ]
    const repeatPasswordRules: RulesPorp = [
      { type: 'required', message: '请再次输入密码' },
      { type: 'custom', vaildator: () => formData.password === formData.repeatPassword, message: '密码不一致' }
    ]
    onMounted(() => {
      console.log(formRef)
    })
    const onFormSubmit = (result: boolean) => {
      formRef.value.resetInput()
      if (result) {
        const params = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('/api/users', params).then(res => {
          console.log(res)
          createMessage('注册成功 正在跳转到登陆页面', 'success')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }).catch(err => {
          console.log(err)
        })
      }
    }
    return {
      emailRules,
      nickNameRules,
      passwordRules,
      repeatPasswordRules,
      formData,
      onFormSubmit,
      formRef
    }
  },
  components: {
    VaildateForm,
    VaildateInput
  }
})
</script>

<style>
.w-330 {
  max-width: 330px;
}
</style>
