import { nextTick, ref } from 'vue'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import type {Node} from '../types/grid.type'

export function useGridDataService() {
  const gridNodes = ref<Node[]>()

  const fetchGridData = async (userId: number) => {
    try {
      const cache = await caches.open('grid-cache-v1')
      const cachedResponse = await cache.match('api/v1/common/grid')

      if (cachedResponse) {
        const cachedData = await cachedResponse.json()
        gridData.value = cachedData
        gridNodes.value = gridData.value!.grid

        // Обновляем UI с кешированными данными
        await nextTick()
      }
    } catch {

    }

    useGetGridData().then(() => {
        gridNodes.value = gridData.value!.grid
    })
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
