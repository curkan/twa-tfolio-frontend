// src/composables/social/useGetSocialLinksData.ts
import { ref } from 'vue'
import { useApiStore } from '../useApiStore'
import type { ISocialLinks } from '../types/social-links.type'

export const socialLinksData = ref<ISocialLinks[]>()

const CACHE_NAME = 'social-links-cache-v1'

export const useGetSocialLinksData = async (userId?: number) => {
  const query = userId !== undefined ? `?user_id=${userId}` : ''
  const url = `api/v1/common/social-links${query}`

  try {
    // Сначала проверяем кеш
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      const { data, timestamp } = await cachedResponse.json()

      // Отдаем кешированные данные
      socialLinksData.value = data
    }

    // Асинхронное обновление кеша в фоне
    updateCacheInBackground(url, cache)

    // Возвращаем данные из кеша (если были) или undefined (если кеша не было)
    return socialLinksData.value

  } catch (error) {
    console.error('Error fetching social links:', error)
    throw error
  }
}

// Функция для асинхронного обновления кеша
const updateCacheInBackground = async (url: string, cache: Cache) => {
  try {
    const response = await useApiStore().get(url)

    // Обновляем реактивную переменную
    socialLinksData.value = response.data

    // Обновляем кеш
    const cacheData = {
      data: response.data,
      timestamp: Date.now()
    }

    const cacheResponse = new Response(JSON.stringify(cacheData), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    await cache.put(url, cacheResponse)

  } catch (error) {
    console.error('Error updating cache in background:', error)
    // Не пробрасываем ошибку, чтобы не влиять на основной поток
  }
}
