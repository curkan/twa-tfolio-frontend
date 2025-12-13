import { useOpenVideo } from '@/composables/handles/useOpenVideo'
import {useOpenImage} from '../handles/useOpenImage'
import type { Node } from '@/composables/types/grid.type'
import type {IUser} from '../types/user.type'

export function useMediaPreview() {
  const openImagePreview = (node: Node, user: IUser) => {
    useOpenImage(node, [], () => {})
  }

  const openVideoPreview = (node: Node) => {
    useOpenVideo(node, [], () => {})
  }

  return {
    openImagePreview,
    openVideoPreview
  }
}
