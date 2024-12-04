import { useApiStore } from '../useApiStore'
import { useUserStore } from '../stores/useUserStore'
import type { IUser } from '../types/user.type'

export const useAuth = async () => {
  return useApiStore()
    .get('api/v1/common/me')
    .then((response) => {
      useUserStore().authUser = response.data as IUser
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
