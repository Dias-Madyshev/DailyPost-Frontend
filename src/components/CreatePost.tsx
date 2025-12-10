import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createPost } from '../store/auth/postSlice'
import { getImageUrl } from '../store/auth/postSlice'

import $api from '../http'
import { stat } from 'fs'

interface CreatePostForm {
  title: string
  content: string
  image?: FileList
  id: number
}

const CreatePost = () => {
  //вытаскиваю image_url
  const dispatch = useAppDispatch()
  const { image_url } = useAppSelector(state => state.post)
  const { user } = useAppSelector(state => state.auth)

  //в форм дата кладу картинку и отправляю на сервер
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log(event?.target.files)
      const files = event.target.files
      if (!files) return
      const formData = new FormData()
      const formImage = files[0]
      formData.append('image', formImage)
      const { data } = await $api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      dispatch(getImageUrl(data.url))
    } catch (error) {
      console.log(error)
    }
  }
  //с помощью useForm()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostForm>()

  const onSubmit = (data: CreatePostForm) => {
    // Если нужно отправить картинку, она будет в data.image[0]
    dispatch(getImageUrl(null))
    dispatch(
      createPost({
        title: data.title,
        content: data.content,
        image_url: image_url ? image_url : '',
        user_id: Number(user?.id ?? 0),
      }),
    )
  }

  const removeImage = () => {
    dispatch(getImageUrl(null))
  }
  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Post</h2>
        {image_url && (
          <div>
            <img src={`http://localhost:3000/${image_url}`} alt="" />
            <button
              onClick={removeImage}
              className="bg-red-500 h-[60px] w-[200px] mt-[10px]"
            >
              Удалить
            </button>
          </div>
        )}
        <input onChange={handleFile} type="file" />
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Title"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <textarea
          {...register('content', { required: 'Content is required' })}
          placeholder="Content"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}

export default CreatePost
