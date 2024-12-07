import type {Node} from "../types/grid.type"

export const useMakeSizeImage = (w: Node) => {
  if (w.w === 1 || w.h === 1) {
    return w.image.xs
  }

  if (w.w === 2 || w.h === 2) {
    return w.image.sm
  }

  if (w.w === 3 || w.h === 3) {
    return w.image.md
  }

  if (w.w === 4 || w.h === 4) {
    return w.image.original
  }
}

