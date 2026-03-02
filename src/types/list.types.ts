export interface SimpleList {
  id: string
  name: string
}

export interface OpenedList {
  id: string
  name: string
  items: []
  users: []
  creator: {
    id: number, 
    username: string
  }
}