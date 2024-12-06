import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'

export const gridData = ref<GridData>()

export const useUpdateGrid = async (nodes: any[]) => {
  return useApiStore()
    .put('api/v1/common/grid', { nodes: nodes })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
