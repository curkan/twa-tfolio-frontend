import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'
import { useUserStore } from '../stores/useUserStore'
import type { ISocialLinks } from '../types/social-links.type'

export const gridData = ref<GridData>()

export const useUpdateUser = async (
  displayName?: string,
  aboutYou?: string,
  socialLinks?: ISocialLinks[],
  enabledSendMeButton?: boolean,
) => {
  let settings = null
  if (enabledSendMeButton == true || enabledSendMeButton == false) {
    settings = {
      enabled_send_me_button: enabledSendMeButton,
    }
  }
  return await useApiStore()
    .put('api/v1/common/me', {
      displayName: displayName,
      biography: aboutYou,
      socials: socialLinks,
      settings: settings,
    })
    .then((response) => {
      useUserStore().authUser = response.data
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
