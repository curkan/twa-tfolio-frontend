import { useUserData } from '@/configs/userData.config'
import Dropzone from 'dropzone'
import { showNotify, showToast } from 'vant'
import { ref } from 'vue'
export const uploadVideo = ref<Dropzone.DropzoneFile>()
export const uploadVideoProgress = ref<number>(0)
export const uploadVideoStatus = ref<string>()

export function useUploadVideo(
  container: string | HTMLElement,
  args: any,
  callback?: (...args: any) => void,
) {
  showToast('uploadVideo')

  const myDropzone = new Dropzone(
    container as HTMLElement,
    {
      paramName: 'file',
      url: `${import.meta.env.VITE_BACKEND_URL}api/v1/common/upload-video`,
      chunking: true,
      maxFilesize: 500,
      chunkSize: 3000000,
      maxThumbnailFilesize: 35,
      acceptedFiles: 'video/*',
      headers: {
        authorization: 'Bearer ' + btoa(useUserData() as string),
      },
      method: 'POST',
      disablePreviews: true,
    } as Dropzone.DropzoneOptions,
  )

  myDropzone.on('addedfile', function (file: Dropzone.DropzoneFile) {
    uploadVideo.value = file
  })


  myDropzone.on('uploadprogress', function (file: Dropzone.DropzoneFile) {
    uploadVideoProgress.value = file.upload?.progress
    uploadVideoStatus.value = file.status
  })

  myDropzone.on('error', (file: Dropzone.DropzoneFile, message: Error) => {
    uploadVideo.value = undefined
    uploadVideoStatus.value = file.status
    showNotify({ type: 'danger', message: String(message.message) });
  })

}
