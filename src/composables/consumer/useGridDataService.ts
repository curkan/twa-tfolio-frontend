import { nextTick, ref } from 'vue'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import type {Node} from '../types/grid.type'

export function useGridDataService() {
  const gridNodes = ref<Node[]>()

  const fetchGridData = async (userId: number) => {
    let needAwaitRequest = false
    let nameCache = 'api/v1/common/grid/' + userId

    try {
      const cache = await caches.open('grid-cache-v1')
      const cachedResponse = await cache.match(nameCache)

      if (cachedResponse != undefined) {
        const cachedData = await cachedResponse.json()
        gridData.value = cachedData
        gridNodes.value = gridData.value!.grid

        // Обновляем UI с кешированными данными
        await nextTick()
      } else {
        needAwaitRequest = true
      }
    } catch {

    }


    if (needAwaitRequest) {
      await useGetGridData(userId).then(() => {
          gridNodes.value = gridData.value!.grid
      })
    } else {
      useGetGridData(userId).then(() => {
          gridNodes.value = gridData.value!.grid
      })
    }
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

