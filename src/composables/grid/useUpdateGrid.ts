import { useApiStore } from '../useApiStore'

export const useUpdateGrid = async (nodes: any[]) => {
  return useApiStore()
    .put('api/v1/common/grid', { nodes: nodes })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
