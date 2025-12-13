// src/composables/grid/useGetGridData.ts
import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'

export const gridData = ref<GridData>()

export const useGetGridData = async (userId?: number) => {
  let query = ''
  if (userId !== undefined) {
    query = '?user_id=' + userId
  }

  const url = 'api/v1/common/grid' + query

  try {
    const response = await useApiStore().get(url)
    gridData.value = response.data

    // Кешируем полученные данные
    const cache = await caches.open('grid-cache-v1')
    const cacheResponse = new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' }
    })
    await cache.put(url, cacheResponse)

    return gridData.value
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
