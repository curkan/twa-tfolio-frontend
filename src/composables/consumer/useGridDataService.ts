import { ref } from 'vue'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import type {Node} from '../types/grid.type'

export function useGridDataService() {
  const gridNodes = ref<Node[]>()

  const fetchGridData = async (userId: number) => {
    await useGetGridData(userId)
    gridNodes.value = gridData.value?.grid
  }

  const resetGridData = () => {
    gridData.value = undefined
  }

  return {
    fetchGridData,
    resetGridData,
    gridNodes
  }
}
