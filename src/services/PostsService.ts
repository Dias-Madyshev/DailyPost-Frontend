import $api from '../http/index'
import { PostResponse } from '../models/posts/PostResponse'

import { AxiosResponse } from 'axios'

export default class PostService {
  static getPosts(): Promise<AxiosResponse<PostResponse[]>> {
    return $api.get<PostResponse[]>('/posts')
  }

  static getPostById(id: number): Promise<AxiosResponse<PostResponse>> {
    return $api.get<PostResponse>(`/posts/${id}`)
  }

  static getUserPosts(userId: number): Promise<AxiosResponse<PostResponse[]>> {
    return $api.get<PostResponse[]>(`/users/${userId}/posts`)
  }

  static createPost(
    title: string,
    content: string,
    image_url: string,
    user_id: number,
  ): Promise<AxiosResponse<PostResponse[]>> {
    return $api.post<PostResponse[]>('/createPost', {
      title,
      content,
      image_url,
      user_id,
    })
  }
}
