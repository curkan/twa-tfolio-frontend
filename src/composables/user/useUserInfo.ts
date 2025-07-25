// src/composables/user/useUserInfo.ts
import { useApiStore } from '../useApiStore'

export const useUserInfo = async (userId: number) => {
  let userInfo
  const url = `api/v1/common/users/${userId}`
  const cacheName = 'user-cache-v1'

  try {
    // Проверяем кеш
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      const cachedData = await cachedResponse.json()
      userInfo = cachedData
      return cachedData
    }

    // Если нет в кеше, делаем запрос
    const response = await useApiStore().get(url)
    userInfo = response.data

    // Кешируем ответ
    const cacheResponse = new Response(JSON.stringify(response.data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600' // 1 час кеширования
      }
    })
    await cache.put(url, cacheResponse)

    return userInfo
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}
