import { showFailToast, showLoadingToast } from 'vant'

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
          forbidClick: true,
          loadingType: 'spinner',
        })

        callback(...args)
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
