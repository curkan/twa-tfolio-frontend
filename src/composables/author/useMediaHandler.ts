import { showImagePreview } from 'vant'
import { useOpenVideo } from '@/composables/handles/useOpenVideo'
import type { Node } from '@/composables/types/grid.type'

export function useMediaHandler() {
  /**
   * Открывает превью изображения
   * @param link - Ссылка на оригинальное изображение
   * @param startPosition - Позиция в галерее
   */
  const openImagePreview = (link: string, startPosition: number) => {
    showImagePreview({
      images: [link], // Показываем одно изображение
      closeOnClickOverlay: true,
      startPosition: startPosition ?? 0,
      closeable: true,
      showIndex: false,
    })
  }

  /**
   * Открывает видео-плеер
   * @param node - Данные видео
   */
  const openVideoPreview = (node: Node) => {
    useOpenVideo(node, [], () => {
      // Callback после закрытия видео
      console.log('Video closed')
    })
  }

  /**
   * Обрабатывает клик по медиа в зависимости от типа
   * @param node - Узел с медиа
   * @param index - Позиция в сетке
   */
  const handleMediaClick = (node: Node, index?: number) => {
    switch (node.type) {
      case 'image':
        openImagePreview(node.image.original, index ?? 0)
        break
      case 'video':
        openVideoPreview(node)
        break
      default:
        console.warn('Unknown media type:', node.type)
    }
  }

  return {
    openImagePreview,
    openVideoPreview,
    handleMediaClick
  }
}
