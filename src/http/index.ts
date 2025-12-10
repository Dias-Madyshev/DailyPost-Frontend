import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { AuthResponse } from '../models/response/AuthResponse'

const BASE_URL = 'http://localhost:3000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
})

// ---------- REQUEST INTERCEPTOR ----------
$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ---------- RESPONSE INTERCEPTOR ----------
$api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async error => {
    const originalRequest = error.config

    // если попытка уже была ⇒ не повторяем
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true

      try {
        const response = await axios.get<AuthResponse>(`${BASE_URL}/refresh`, {
          withCredentials: true,
        })

        localStorage.setItem('accessToken', response.data.Tokens.jwtAccessToken)

        return $api.request(originalRequest)
      } catch (e) {
        console.log('НЕ АВТОРИЗОВАН')
        throw e
      }
    }

    throw error
  },
)

export default $api
