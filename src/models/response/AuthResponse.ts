import { UserResponse } from '../user/UserResponse'

export interface AuthResponse {
  Tokens: {
    jwtAccessToken: string
    jwtRefreshToken: string
  }
  userDto: UserResponse
}
