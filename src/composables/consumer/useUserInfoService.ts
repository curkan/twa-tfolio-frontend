// src/composables/consumer/useUserInfoService.ts
import { nextTick, ref } from 'vue'
import { useUserInfo } from '@/composables/user/useUserInfo'
import { socialLinksData, useGetSocialLinksData } from '@/composables/socialLinks/useGetSocialLinksData'
import type {IUser} from '../types/user.type'
import {type ISocialLinks} from '../types/social-links.type'

export function useUserInfoService() {
  const loading = ref(true)
  const photoUrl = ref<string>()
  const displayName = ref<string>()
  const biography = ref<string>()
  const userInfo = ref<IUser>()
  const socialLinks = ref<ISocialLinks[]>()
  const userInfoCacheName = 'user-info-cache-v1'
  const socialLinksCacheName = 'social-links-cache-v1'

  const fetchUserData = async (userId: number) => {
    loading.value = true
    let hasCachedUserInfo = false
    let hasCachedSocialLinks = false

    // Проверка кеша для основной информации пользователя
    try {
      const cache = await caches.open(userInfoCacheName)
      const cachedResponse = await cache.match(`api/v1/user/info?user_id=${userId}`)

      if (cachedResponse) {
        const cachedData = await cachedResponse.json()
        userInfo.value = cachedData
        photoUrl.value = cachedData.photo_url
        displayName.value = cachedData.display_name
        biography.value = cachedData.biography
        hasCachedUserInfo = true

        await nextTick()
      }
    } catch (error) {
      console.error('User info cache error:', error)
    }

    // Проверка кеша для социальных ссылок
    try {
      const cache = await caches.open(socialLinksCacheName)
      const cachedResponse = await cache.match(`api/v1/social/links?user_id=${userId}`)

      if (cachedResponse) {
        const cachedData = await cachedResponse.json()
        socialLinksData.value = cachedData
        socialLinks.value = socialLinksData.value
        hasCachedSocialLinks = true
      }
    } catch (error) {
      console.error('Social links cache error:', error)
    }

    // Если все данные есть в кеше, завершаем загрузку
    if (hasCachedUserInfo && hasCachedSocialLinks) {
      loading.value = false
      return
    }

    // Запрос недостающих данных
    const promises = []

    if (!hasCachedUserInfo) {
      promises.push(
        useUserInfo(userId).then((response) => {
          if (response === undefined) return

          userInfo.value = response
          photoUrl.value = response.photo_url
          displayName.value = response.display_name
          biography.value = response.biography
        })
      )
    }

    if (!hasCachedSocialLinks) {
      promises.push(
        useGetSocialLinksData(userId).then(() => {
          socialLinks.value = socialLinksData.value
        })
      )
    }

    await Promise.all(promises)
    loading.value = false
  }

  const resetUserData = () => {
    userInfo.value = undefined
    socialLinksData.value = undefined
    photoUrl.value = undefined
    displayName.value = undefined
    biography.value = undefined
  }

  return {
    fetchUserData,
    resetUserData,
    userInfo,
    loading,
    photoUrl,
    displayName,
    biography,
    socialLinks
  }
}
