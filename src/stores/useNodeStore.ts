import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {Node} from '@/composables/types/grid.type'
import {useGetNodeData} from '@/composables/grid/useGetNodeData'

export const useNodeStore = defineStore('node', () => {
  const currentNode = ref<Node>()

  const updateCurrentNode = () => {
    useGetNodeData(Number(currentNode.value?.id)).then((data) => {
      currentNode.value = data as Node
    })
  }

  return { currentNode, updateCurrentNode }
})

