import { configureStore } from '@reduxjs/toolkit'
import AuthReduser from './auth/authSlice'
import postReducer from './auth/postSlice'

const store = configureStore({
  reducer: {
    auth: AuthReduser,
    post: postReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
