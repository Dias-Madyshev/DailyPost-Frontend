import $api from '../http/index'
import { UserResponse } from '../models/user/UserResponse'
import { AxiosResponse } from 'axios'

export default class UserService {
  static getUsers(): Promise<AxiosResponse<UserResponse[]>> {
    return $api.get<UserResponse[]>('/users')
  }

  static getProfile(): Promise<AxiosResponse<UserResponse>> {
    return $api.get<UserResponse>('/profile')
  }

  static updateProfile(username: string): Promise<AxiosResponse<UserResponse>> {
    return $api.put<UserResponse>('/profile', { username })
  }
}
