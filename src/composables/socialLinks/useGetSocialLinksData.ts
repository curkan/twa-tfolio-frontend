// src/composables/social/useGetSocialLinksData.ts
import { ref } from 'vue'
import { useApiStore } from '../useApiStore'
import type { ISocialLinks } from '../types/social-links.type'

export const socialLinksData = ref<ISocialLinks[]>()
const CACHE_NAME = 'social-links-cache-v1'
const CACHE_TTL = 3600 * 1000 // 1 час в миллисекундах

export const useGetSocialLinksData = async (userId?: number) => {
  const query = userId !== undefined ? `?user_id=${userId}` : ''
  const url = `api/v1/common/social-links${query}`

  try {
    // Проверяем кеш
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      const { data, timestamp } = await cachedResponse.json()

      // Проверяем срок годности кеша
      if (Date.now() - timestamp < CACHE_TTL) {
        socialLinksData.value = data
        return data
      }
    }

    // Если нет в кеше или кеш устарел, делаем запрос
    const response = await useApiStore().get(url)
    socialLinksData.value = response.data

    // Кешируем ответ с timestamp
    const cacheData = {
      data: response.data,
      timestamp: Date.now()
    }

    const cacheResponse = new Response(JSON.stringify(cacheData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `max-age=${CACHE_TTL}`
      }
    })
    await cache.put(url, cacheResponse)

    return socialLinksData.value
  } catch (error) {
    console.error('Error fetching social links:', error)
    throw error
  }
}
