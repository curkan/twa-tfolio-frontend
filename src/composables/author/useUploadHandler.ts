import { ref, type Ref } from 'vue'
import { useUploadFiles } from '@/composables/handles/useUploadFiles'
import { useUploadVideo } from '@/composables/handles/useUploadVideo'
import type { Node } from '@/composables/types/grid.type'

export function useUploadHandler(onUploadSuccess: (node: Node) => void, fileInput: Ref<HTMLInputElement>, fileInputVideo: Ref<HTMLInputElement>) {
  /**
   * Инициализирует обработчики загрузки
   */
  const setupUploadHandlers = () => {
    if (fileInput.value) {
      useUploadFiles(fileInput.value, [], onUploadSuccess)
    }
    if (fileInputVideo.value) {
      useUploadVideo(fileInputVideo.value, [], onUploadSuccess)
    }
  }

  /**
   * Триггерит загрузку изображения
   */
  const triggerImageUpload = () => {
    fileInput.value?.click()
  }

  /**
   * Триггерит загрузку видео
   */
  const triggerVideoUpload = () => {
    fileInputVideo.value?.click()
  }

  return {
    fileInput,
    fileInputVideo,
    setupUploadHandlers,
    triggerImageUpload,
    triggerVideoUpload
  }
}
