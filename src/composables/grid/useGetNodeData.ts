import type {Node} from '../types/grid.type'
import { useApiStore } from '../useApiStore'

export const useGetNodeData = async (nodeId: Number) => {
  return useApiStore()
    .get(`api/v1/common/grid/${nodeId}`)
    .then((response) => {
      return response.data as Node
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
