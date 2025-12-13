import type { Node } from '../types/grid.type'

type ImageSize = 'xs' | 'sm' | 'md' | 'original'
type SizeMap = {
  [key: number]: ImageSize
}

const SIZE_MAPPING: SizeMap = {
  1: 'xs',
  2: 'sm',
  3: 'md',
  4: 'original'
} as const

const DEFAULT_SIZE: ImageSize = 'md'
const MAX_SIZE = 4

export const useMakeSizeImage = (node?: Node): string => {
  if (!node || !node.image) {
    return ''
  }

  try {
    // Защитные проверки для размеров
    const width = node.w ?? 1
    const height = node.h ?? 1
    const size = Math.max(width, height)

    // Определение ключа размера с ограничением по MAX_SIZE
    const sizeKey = Math.min(Math.max(Math.floor(size), 1), MAX_SIZE)
    const sizeType = SIZE_MAPPING[sizeKey] ?? DEFAULT_SIZE

    return node.image[sizeType] ?? node.image.original ?? ''
  } catch (error) {
    console.error('Error in useMakeSizeImage:', error)
    return node.image.original ?? ''
  }
}
