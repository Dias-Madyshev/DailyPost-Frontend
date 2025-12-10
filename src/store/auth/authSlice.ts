import { AuthResponse } from '../../models/response/AuthResponse'
import { UserResponse } from '../../models/user/UserResponse'
import AuthService from '../../services/AuthServise'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import $api from '../../http'

interface AuthState {
  user: UserResponse | null
  isLoading: boolean
  isAuth: boolean
  error: string | null
  status: null | string
  isCheckAuth: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isCheckAuth: true,
  error: null,
  isAuth: false,
  status: '',
}
export const login = createAsyncThunk(
  'login',
  async (
    { username, password }: { username: string; password: string },
    thunkApi,
  ) => {
    try {
      const response = await AuthService.login(username, password)
      const accessToken = response.data.Tokens.jwtAccessToken
      const refreshToken = response.data.Tokens.jwtRefreshToken
      const user = response.data.userDto

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return user
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Ошибка логина',
      )
    }
  },
)
export const regestration = createAsyncThunk(
  'regestration',
  async (
    {
      username,
      password,
      nickname,
    }: { username: string; password: string; nickname: string },
    thunkApi,
  ) => {
    try {
      const response = await AuthService.registration(
        username,
        password,
        nickname,
      )
      const accessToken = response.data.Tokens.jwtAccessToken
      const refreshToken = response.data.Tokens.jwtRefreshToken
      const user = response.data.userDto

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return user
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Ошибка логина',
      )
    }
  },
)
export const checkAuth = createAsyncThunk('checkAuth', async (_, thunkApi) => {
  try {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) return null

    const response = await $api.get<AuthResponse>('/refresh')

    const accessToken = response.data.Tokens.jwtAccessToken
    const refreshToken = response.data.Tokens.jwtRefreshToken
    const user = response.data.userDto

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    return user
  } catch (error: any) {
    return null
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuth = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: builder => {
    builder
      // ----Login----//
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuth = true
        state.status = 'Пользыватель '
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuth = false
        state.status = 'Ошибка при входе в аккаунт'
      })
      // ----Regestration----//
      .addCase(regestration.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(regestration.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuth = true
        state.status = 'Пользыватель зарегестрирован'
      })
      .addCase(regestration.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuth = false
      })
      // ----ChecAuth----//
      .addCase(checkAuth.pending, state => {
        state.isCheckAuth = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuth = Boolean(action.payload)
        state.isCheckAuth = false
      })
      .addCase(checkAuth.rejected, state => {
        state.user = null
        state.isAuth = false
        state.isCheckAuth = false
      })

    // ----ChecAuth----//
  },
})

export default authSlice.reducer
export const { logout } = authSlice.actions
