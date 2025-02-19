import { useUserData } from '@/configs/userData.config'
import i18n from '@/i18n'
import Dropzone from 'dropzone'
import { showNotify, showSuccessToast } from 'vant'
import { ref } from 'vue'
import { useHapticFeedback } from 'vue-tg/latest'

export const uploadVideos = ref<Dropzone.DropzoneFile[]>([])
export const uploadVideoProgresses = ref<{ [key: string]: number }>({})
export const uploadVideoStatuses = ref<{ [key: string]: string }>({})

export function useUploadVideo(
  container: string | HTMLElement,
  args: any,
  callback: (...args: any) => void,
) {
  const isAndroid = navigator.userAgent.match(/Android/i) !== null
  const myDropzone = new Dropzone(
    container as HTMLElement,
    {
      paramName: 'file',
      url: `${import.meta.env.VITE_BACKEND_URL}api/v1/common/upload-video`,
      chunking: true,
      maxFilesize: 100,
      chunkSize: 3000000,
      maxThumbnailFilesize: 35,
      ...(isAndroid ? {} : { acceptedFiles: 'video/*' }),
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
      dictMaxFilesExceeded: i18n.global.t('dropzone.dictMaxFilesExceeded'),
    } as Dropzone.DropzoneOptions,
  )

  myDropzone.on('addedfile', function (file: Dropzone.DropzoneFile) {
    if (file.upload?.uuid) {
      uploadVideos.value.push(file)
      uploadVideoProgresses.value[file.upload?.uuid] = 0
      uploadVideoStatuses.value[file.upload?.uuid] = file.status
    }
  })

  myDropzone.on('uploadprogress', function (file: Dropzone.DropzoneFile) {
    if (file.upload?.uuid) {
      uploadVideoProgresses.value[file.upload?.uuid] = file.upload?.progress || 0
      uploadVideoStatuses.value[file.upload?.uuid] = file.status
    }
  })

  myDropzone.on('success', (file: Dropzone.DropzoneFile, _response) => {
    const index = uploadVideos.value.findIndex((f) => f.upload?.uuid === file.upload?.uuid)
    if (index !== -1) {
      uploadVideos.value.splice(index, 1)
    }
    if (file.upload?.uuid) {
      delete uploadVideoProgresses.value[file.upload?.uuid]
      delete uploadVideoStatuses.value[file.upload?.uuid]
    }
    useHapticFeedback().notificationOccurred('success')
    showSuccessToast('Success')
    callback(...args, _response.data)
  })

  myDropzone.on('error', (file: Dropzone.DropzoneFile, message: Error) => {
    const index = uploadVideos.value.findIndex((f) => f.upload?.uuid === file.upload?.uuid)
    if (index !== -1) {
      uploadVideos.value.splice(index, 1)
    }

    if (file.upload?.uuid) {
      delete uploadVideoProgresses.value[file.upload?.uuid]
      uploadVideoStatuses.value[file.upload?.uuid] = file.status
    }

    showNotify({ type: 'danger', message: String(message) })
  })
}
