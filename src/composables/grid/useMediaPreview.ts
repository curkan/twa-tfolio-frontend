import { useOpenVideo } from '@/composables/handles/useOpenVideo'
import {useOpenImage} from '../handles/useOpenImage'
import type { Node } from '@/composables/types/grid.type'

export function useMediaPreview() {
  const openImagePreview = (node: Node) => {
    useOpenImage(node, [], () => {
      // Callback после закрытия видео
      console.log('Node closed')
    })
  }

  const openVideoPreview = (node: Node) => {
    useOpenVideo(node, [], () => {})
  }

  return {
    openImagePreview,
    openVideoPreview
  }
}
