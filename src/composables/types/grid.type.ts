export interface GridData {
  user: object
  grid: Node[]
}

export interface Node {
  id: number | string
  sort: number
  x: number
  y: number
  w: number
  h: number
  image: Image
  internalId?: number | string
}

export interface Image {
  original: string
  md: string
  sm: string
  xs: string
}

