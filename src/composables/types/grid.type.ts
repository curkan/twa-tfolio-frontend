export interface GridData {
  user: object
  grid: Node[]
}

export enum NodeType {
  image = 'image',
  video = 'video'
}

export interface Node {
  id: number | string
  sort: number
  x: number
  y: number
  w: number
  h: number
  type: NodeType
  video_url?: string
  image: Image
  internalId?: number | string
  description: string
  likes_count: number
  user: IUserNode
  meta: {
    owner: boolean
    is_liked: boolean
  }
}

export interface IUserNode {
  id: number
  username: string
  photo_url?: string
  display_name?: string
}


export interface Image {
  original: string
  md: string
  sm: string
  xs: string
}
