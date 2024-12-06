import { useUserData } from '@/configs/userData.config'
import i18n from '@/i18n'
import Dropzone from 'dropzone'
import heic2any from 'heic2any'
import {showLoadingToast, showToast} from 'vant'
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
      maxFilesize: 400000000,
      chunkSize: 1000000,
      headers: {
        authorization: 'Bearer ' + btoa(useUserData() as string),
      },
      method: 'POST',
      disablePreviews: true,
    } as Dropzone.DropzoneOptions,
  )
  myDropzone.on('thumbnail', function (file: Dropzone.DropzoneFile, dataURL) {
    if (!file.name.match(/\.heic$/i)) {
      uploadFiles.value.push(file)
    }
  })
  myDropzone.on('addedfile', (file: Dropzone.DropzoneFile) => {
      if (file.name.match(/\.heic$/i)) {
        showLoadingToast({
          message: i18n.global.t('main.prepareImage'),
          forbidClick: true,
        });
        heic2any({
            blob: file,
            toType: "image/jpeg",
        }).then(function(convertedBlob) {
            var newFile = new File([convertedBlob], file.name.replace(".heic", ".jpg"), { type: "image/jpeg" });
            var reader = new FileReader();
            reader.onload = function(e) {
                file.dataURL = e.target.result;
                uploadFiles.value.push(file)
            };
            reader.readAsDataURL(newFile);
        }).catch(function(err) {
            console.error('Error converting HEIC:', err);
        });
    }
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
