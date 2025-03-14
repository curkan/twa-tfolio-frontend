import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {Node} from '@/composables/types/grid.type'

export const useNodeStore = defineStore('node', () => {
  const currentNode = ref<Node>()

  return { currentNode }
})

