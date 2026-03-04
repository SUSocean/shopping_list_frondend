import type { ItemDto } from "./item.types"

export interface SimpleList {
  id: string
  name: string
}

export interface OpenedList {
  id: string
  name: string
  items: ItemDto[]
  users: []
  creator: {
    id: number, 
    username: string
  }
}