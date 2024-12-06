import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainButtonStore = defineStore('mainButtonStore', () => {
  const currentText = ref()
  const beforeText = ref()

  return { currentText, beforeText }
})

