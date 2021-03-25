<template>
  <teleport to="#back">
      <div class="d-flex justify-content-center align-items-center w-100 h-100 loading-container"
    :style="{backgroundColor: background || ''}"
  >
      <div class="loading-content">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{text || 'loading'}}</span>
            <!-- <span class="sr-only"></span> -->
            <!-- <span class="visually-hidden">Loading...</span> -->
          </div>
          <p v-if="text" class="text-primary small">{{text}}</p>
      </div>
  </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)
    onUnmounted(() => {
      document.body.removeChild(node)
    })
  }
})
</script>

<style>
.loading-container{
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, .5);
    text-align: center;
}

</style>
