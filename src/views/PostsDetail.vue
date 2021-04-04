<template>
<div class="posts-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
        <img :src="currentImageUrl" :alt="currentPost.titie" class="rounded-lg img-flund my-4" v-if="currentPost">
        <h2 class="mb-4">{{currentPost.title}}</h2>
        <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
           <div class="col">
                <UserPorfile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></UserPorfile>
           </div>
           <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
        </div>
        <div v-html="currentHTML"></div>
        <div v-if="showEditArea" class="btn_group mt-5">
          <router-link type="button" class="btn btn-success" :to="{name: 'create', query: { id: currentPost._id }}">编辑</router-link>
          <button type="button" class="btn btn-danger">删除</button>
        </div>
    </article>
</div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ImageProps, PostProps, UserProps } from '@/store'
import MarkDownIt from 'markdown-it'
import UserPorfile from '@/components/UserProfile.vue'
// 文章权限一般对比文章author中的id和用户信息的id
export default defineComponent({
  components: {
    UserPorfile
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id
    const md = new MarkDownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    console.log(currentPost)
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      }
      return null
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    return {
      currentPost,
      currentImageUrl,
      currentHTML,
      showEditArea
    }
  }
})
</script>

<style>

</style>
