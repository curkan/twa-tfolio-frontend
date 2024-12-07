import { useUserData } from '@/configs/userData.config'
import Dropzone from 'dropzone'
import { showToast } from 'vant'
import { ref } from 'vue'
export const uploadFiles = ref<Dropzone.DropzoneFile[]>([])

export function useUploadFiles(
  container: string | HTMLElement,
  args: any,
  callback: (...args: any) => void,
) {
  const myDropzone = new Dropzone(
    container as HTMLElement,
    {
      paramName: 'files',
      url: `${import.meta.env.VITE_BACKEND_URL}api/v1/common/upload-files`,
      chunking: true,
      maxFilesize: 35,
      chunkSize: 3000000,
      maxThumbnailFilesize: 35,
      acceptedFiles: 'image/*',
      headers: {
        authorization: 'Bearer ' + btoa(useUserData() as string),
      },
      method: 'POST',
      disablePreviews: true,
    } as Dropzone.DropzoneOptions,
  )

  myDropzone.on('thumbnail', function (file: Dropzone.DropzoneFile, dataURL) {
    if (file.name.match(/\.heic$/i)) {
      file.dataURL = '/images/heic.svg'
    }

    uploadFiles.value.push(file)
  })

  myDropzone.on('success', (file: Dropzone.DropzoneFile, _response) => {
    uploadFiles.value = uploadFiles.value?.filter(
      (item: Dropzone.DropzoneFile) => item.upload?.uuid !== file.upload?.uuid,
    )
    callback(...args, _response.data)
  })

  myDropzone.on('uploadprogress', (file, progress) => {
    // console.log(progress)
  })

  myDropzone.on('error', (file: Dropzone.DropzoneFile, message: string | Error) => {
    uploadFiles.value = uploadFiles.value?.filter(
      (item: Dropzone.DropzoneFile) => item.upload?.uuid !== file.upload?.uuid,
    )
    showToast(message)
  })

}
