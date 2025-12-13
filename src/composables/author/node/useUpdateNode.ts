import {useApiStore} from '@/composables/useApiStore'
import {useNodeStore} from '@/stores/useNodeStore'

export const useUpdateNode = async (
  nodeId: number,
  description?: string,
) => {
  return await useApiStore()
    .put(`api/v1/common/node/${nodeId}`, {
      description: description,
    })
}
