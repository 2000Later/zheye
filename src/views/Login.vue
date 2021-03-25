<template>
  <vaildate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <vaildate-input ref="inputRef" :rules="emailRules" v-model="emailValue" class="hello" placeholder="请输入邮箱地址"></vaildate-input>
      </div>
      <!-- <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
           v-model="emailRef.val"
           @blur="vaildateEmail"
        />
        <div class="form-text" v-if="emailRef.error">{{emailRef.message}}</div>
      </div> -->
      <div class="mb-3">
        <label class="form-label">密码</label>
        <vaildate-input type="password" placeholder="请输入密码" v-model="passwordValue" :rules="passwordRules"></vaildate-input>
      </div>
      <template v-slot:submit>
        <button class="btn btn-danger">提交</button>
      </template>
    </vaildate-form>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import VaildateForm from '../components/VaildateForm.vue'
import VaildateInput, { RulesPorp } from '../components/VaildateInput.vue'

export default defineComponent({
  setup () {
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const inputRef = ref<any>('')
    const emailValue = ref('')
    const emailRules: RulesPorp = [
      { type: 'required', message: '电子邮件地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮件地址' }
    ]
    const passwordValue = ref('')
    const passwordRules: RulesPorp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailValue.value,
          password: passwordValue.value
        }
        store.dispatch('loginAndFetch', payload).then(data => {
          console.log('@@', data)
          router.push('/')
          // router.push({ name: 'column', params: { id: 1 } })
        })
      }
    }
    return {
      emailValue,
      emailRules,
      passwordValue,
      passwordRules,
      inputRef,
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
