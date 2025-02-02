import type { ISettings } from './settings.type'

export interface IUser {
  id: number
  username: string
  photo_url?: string
  display_name?: string
  biography?: string
  settings: ISettings
}
