import type { Node } from '../types/grid.type'

export const useMakeSizeImage = (w: Node) => {
  const size = Math.max(w.w, w.h)
  const sizes = {
    1: 'xs',
    2: 'sm',
    3: 'md',
    4: 'original',
  }

  const sizeKey = Math.min(size, 4)

  if (w.image != undefined) {
    return w.image[sizes[sizeKey]]
  }

  return ''
}
