import { showImagePreview } from 'vant'
import { useOpenVideo } from '@/composables/handles/useOpenVideo'
import { gridData } from '@/composables/grid/useGetGridData'

export function useMediaPreview() {
  const openImagePreview = (link: string, startPosition: number) => {
    showImagePreview({
      images: gridData.value?.grid.map(a => a.image.original),
      closeOnClickOverlay: true,
      startPosition: startPosition ?? 1,
      closeable: true,
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
