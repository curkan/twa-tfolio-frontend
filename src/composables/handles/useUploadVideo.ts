import { useUserData } from '@/configs/userData.config'
import i18n from '@/i18n'
import Dropzone from 'dropzone'
import { showNotify, showSuccessToast, showToast } from 'vant'
import { ref } from 'vue'
import {useHapticFeedback} from 'vue-tg/latest'
export const uploadVideo = ref<Dropzone.DropzoneFile>()
export const uploadVideoProgress = ref<number>(0)
export const uploadVideoStatus = ref<string>()

export function useUploadVideo(
  container: string | HTMLElement,
  args: any,
  callback: (...args: any) => void,
) {
  const myDropzone = new Dropzone(
    container as HTMLElement,
    {
      paramName: 'file',
      url: `${import.meta.env.VITE_BACKEND_URL}api/v1/common/upload-video`,
      chunking: true,
      maxFilesize: 50,
      chunkSize: 3000000,
      maxThumbnailFilesize: 35,
      acceptedFiles: 'video/*',
      headers: {
        authorization: 'Bearer ' + btoa(useUserData() as string),
      },
      method: 'POST',
      disablePreviews: true,
      dictDefaultMessage: i18n.global.t('dropzone.dictDefaultMessage'),
      dictFallbackMessage: i18n.global.t('dropzone.dictFallbackMessage'),
      dictFallbackText: i18n.global.t('dropzone.dictFallbackText'),
      dictFileTooBig: i18n.global.t('dropzone.dictFileTooBig'),
      dictInvalidFileType: i18n.global.t('dropzone.dictInvalidFileType'),
      dictResponseError: i18n.global.t('dropzone.dictResponseError'),
      dictCancelUpload: i18n.global.t('dropzone.dictCancelUpload'),
      dictCancelUploadConfirmation: i18n.global.t('dropzone.dictCancelUploadConfirmation'),
      dictRemoveFile: i18n.global.t('dropzone.dictRemoveFile'),
      dictMaxFilesExceeded: i18n.global.t('dropzone.dictMaxFilesExceeded')
    } as Dropzone.DropzoneOptions,
  )

  myDropzone.on('addedfile', function (file: Dropzone.DropzoneFile) {
    uploadVideo.value = file
  })


  myDropzone.on('uploadprogress', function (file: Dropzone.DropzoneFile) {
    uploadVideoProgress.value = file.upload?.progress
    uploadVideoStatus.value = file.status
  })

  myDropzone.on('success', (file: Dropzone.DropzoneFile, _response) => {
    uploadVideo.value = undefined
    useHapticFeedback().notificationOccurred('success')
    showSuccessToast('Success')
    callback(...args, _response.data)
  })


  myDropzone.on('error', (file: Dropzone.DropzoneFile, message: Error) => {
    uploadVideo.value = undefined
    uploadVideoStatus.value = file.status
    showNotify({ type: 'danger', message: String(message) });
  })

}
