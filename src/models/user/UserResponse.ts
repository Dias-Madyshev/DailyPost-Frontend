export interface UserResponse {
  id: number
  username: string
  nickname?: string
  isactivated: boolean
  posts_count: number
  created_at?: string
}
