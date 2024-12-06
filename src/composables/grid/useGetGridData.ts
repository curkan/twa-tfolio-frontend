import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'

export const gridData = ref<GridData>()

export const useGetGridData = async (
  userId?: Number
) => {
  console.log(userId)
  let query = ''
  if (userId !== undefined) {
    query = '?user_id=' + userId
  }

  useApiStore()
    .get('api/v1/common/grid' + query)
    .then((response) => {
      gridData.value = response.data

      return gridData.value
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
