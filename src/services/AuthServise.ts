import { AxiosResponse } from 'axios'
import $api from '../http'
import { AuthResponse } from '../models/response/AuthResponse'

export default class AuthService {
  static async login(
    username: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/login', {
      username,
      password,
    })
  }
  static async registration(
    username: string,
    password: string,
    nickname: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/regestration', {
      username,
      password,
      nickname,
    })
  }
  static async logout(): Promise<void> {
    return $api.post('/logout')
  }
}
