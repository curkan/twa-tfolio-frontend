import {useApiStore} from '@/composables/useApiStore'

export const useLikeNode = async (
  nodeId: number,
) => {
  return await useApiStore()
    .post(`api/v1/common/node/${nodeId}/like`, {})
}
