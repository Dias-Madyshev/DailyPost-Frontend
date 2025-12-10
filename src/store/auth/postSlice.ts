import { PostResponse } from '../../models/posts/PostResponse'
import PostService from '../../services/PostsService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'

interface PostState {
  post: PostResponse[]
  isLoading: boolean
  createUserId: number | null
  error: string | null
  isSubmiting: boolean
  image_url: string | null
}

const initialState: PostState = {
  post: [],
  isLoading: false,
  createUserId: null,
  error: null,
  isSubmiting: false,
  image_url: null,
}
export const createPost = createAsyncThunk(
  'createPost',
  async (
    {
      title,
      content,
      image_url,
      user_id,
    }: { title: string; content: string; image_url: string; user_id: number },
    thunkApi,
  ) => {
    try {
      const response = await PostService.createPost(
        title,
        content,
        image_url,
        user_id,
      )
      const data = response.data
      return data
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || 'Ошибка логина',
      )
    }
  },
)
const PostSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    resetForm(state) {
      state.post = []
      state.error = null
      state.isLoading = false
      state.isSubmiting = false
    },
    getImageUrl(state, action: PayloadAction<string | null>) {
      state.image_url = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createPost.pending, state => {
        state.isSubmiting = true
        state.error = null
        state.isLoading = true
        state.isSubmiting = false
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isSubmiting = false
        if (Array.isArray(action.payload)) {
          state.post.push(...action.payload) // если вдруг сервер вернул массив
        } else {
          state.post.push(action.payload) // обычный объект
        }
        state.isLoading = false
        state.isSubmiting = true
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isSubmiting = false
        state.error = action.payload as string
      })
  },
})

export const { resetForm } = PostSlice.actions
export default PostSlice.reducer
export const { getImageUrl } = PostSlice.actions
