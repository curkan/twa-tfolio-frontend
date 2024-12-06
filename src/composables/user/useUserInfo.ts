import { useApiStore } from '../useApiStore'
import type { IUser } from '../types/user.type'

export const useUserInfo = async (
  userId: number
) => {
  return useApiStore()
    .get('api/v1/common/users/' + userId)
    .then((response) => {
      return response.data as IUser
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
