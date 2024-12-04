import { ref } from 'vue'
import type { GridData } from '../types/grid.type'
import { useApiStore } from '../useApiStore'

export const gridData = ref<GridData>()

export const useUploadImage = async (formData: FormData) => {
  useApiStore()
    .postForm('api/v1/common/upload-image', formData)
    .then((response) => {
      return response.data.node
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
