import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewportStore = defineStore('useViewportStore', () => {
  const disabledBackSwipe = ref<boolean>(false)
  const isTelegramApp = ref<boolean>(false)

  return { disabledBackSwipe, isTelegramApp }
})
