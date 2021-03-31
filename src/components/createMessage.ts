import { createApp } from 'vue'
import Message from './Message.vue'
export default (message: string, type: string, delay = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 挂载到创建的节点中
  messageInstance.mount(mountNode)
  setTimeout(() => {
    // 卸载组件
    messageInstance.unmount(mountNode)
    // 移除节点
    document.body.removeChild(mountNode)
  }, delay)
}
