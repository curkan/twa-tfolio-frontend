import { showFailToast, showLoadingToast } from 'vant'
import {useApiStore} from '../useApiStore'

export const useHandleUploadImage = async (
  event: Event,
  args: any,
  callback: (...args: any) => void,
) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Проверка формата файла
    const allowedFormats = ['image/png', 'image/jpeg', 'image/gif']
    if (allowedFormats.includes(file.type)) {
      // Проверка размера файла
      if (file.size <= 2048 * 1024) {
        const formData = new FormData()
        formData.append('picture', file)

        showLoadingToast({
          message: 'Loading...',
          closeOnClickOverlay: true,
          loadingType: 'spinner',
        })

        useApiStore()
          .postForm('api/v1/common/upload-image', formData)
          .then((response) => {
            callback(...args, response.data.data)
          })
          .catch((error) => {
            console.error('Error fetching data:', error)
          })
      } else {
        showFailToast({
          message: 'Big file size',
        })
      }
    } else {
      showFailToast({
        message: 'Not allowed file type',
      })
    }
  }
}
