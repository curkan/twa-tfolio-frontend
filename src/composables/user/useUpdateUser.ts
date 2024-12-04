import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'
import { useUserStore } from '../stores/useUserStore'

export const gridData = ref<GridData>()

export const useUpdateUser = async (displayName?: string, aboutYou?: string) => {
  return await useApiStore()
    .put('api/v1/common/me', {
      displayName: displayName,
      biography: aboutYou,
    })
    .then((response) => {
      useUserStore().authUser = response.data
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
