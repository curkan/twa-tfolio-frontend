import { useApiStore } from '../useApiStore'

export const useUpdateGrid = async (nodes: any[]) => {
  const url = 'api/v1/common/grid'

  const response = await useApiStore()
    .put('api/v1/common/grid', { nodes: nodes })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })

  // Кешируем полученные данные
  const cache = await caches.open('grid-cache-v1')
  const cacheResponse = new Response(JSON.stringify(response.data), {
    headers: { 'Content-Type': 'application/json' }
  })

  await cache.put(url, cacheResponse)
}
