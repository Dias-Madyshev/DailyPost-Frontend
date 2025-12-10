export interface PostResponse {
  id: number
  title: string
  content: string
  image_url?: string
  user_id?: number
  created_at?: string
  updated_at?: string
  create_at?: string
  update_at?: string
  auth?: {
    id: number
    username: string
  }
}
