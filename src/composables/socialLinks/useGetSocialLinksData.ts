import { ref } from 'vue'
import { useApiStore } from '../useApiStore'
import type { ISocialLinks } from '../types/social-links.type'

export const socialLinksData = ref<ISocialLinks[]>()

export const useGetSocialLinksData = async (userId?: Number) => {
  let query = ''
  if (userId !== undefined) {
    query = '?user_id=' + userId
  }

  return useApiStore()
    .get('api/v1/common/social-links' + query)
    .then((response) => {
      socialLinksData.value = response.data

      return socialLinksData.value
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
