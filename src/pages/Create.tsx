import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createPost } from '../store/auth/postSlice'
import { getImageUrl } from '../store/auth/postSlice'
import Layout from '../components/layout/Layout'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '../styles/design-system'
import $api from '../http'
import { useState } from 'react'

interface CreatePostForm {
  title: string
  content: string
  image?: FileList
  id: number
}

interface ModalState {
  show: boolean
  type: 'success' | 'error'
  title: string
  message: string
}

export default function Create() {
  const dispatch = useAppDispatch()
  const { image_url, isLoading } = useAppSelector(state => state.post)
  const { user } = useAppSelector(state => state.auth)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [modal, setModal] = useState<ModalState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreatePostForm>()

  // Следим за изменениями в полях
  const title = watch('title')
  const content = watch('content')

  // Функция для показа модалки
  const showModal = (type: 'success' | 'error', title: string, message: string) => {
    setModal({
      show: true,
      type,
      title,
      message
    })
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }))
  }

  // Загрузка изображения
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files
      if (!files || files.length === 0) return

      setUploadingImage(true)
      const formData = new FormData()
      const formImage = files[0]

      // Проверяем размер файла (макс 5MB)
      if (formImage.size > 5 * 1024 * 1024) {
        showModal('error', 'Ошибка загрузки', 'Файл слишком большой. Максимальный размер: 5MB')
        return
      }

      // Проверяем тип файла
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (!allowedTypes.includes(formImage.type)) {
        showModal('error', 'Неподдерживаемый формат', 'Поддерживаются только изображения: JPG, PNG, GIF, WebP')
        return
      }

      formData.append('image', formImage)
      const { data } = await $api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      dispatch(getImageUrl(data.url))
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      showModal('error', 'Ошибка загрузки', 'Не удалось загрузить изображение')
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data: CreatePostForm) => {
    try {
      const result = await dispatch(
        createPost({
          title: data.title,
          content: data.content,
          image_url: image_url || '',
          user_id: Number(user?.id ?? 0),
        }),
      )

      if (result.meta.requestStatus === 'fulfilled') {
        // Очищаем форму после успешной отправки
        reset()
        dispatch(getImageUrl(null))
        showModal('success', 'Успех!', 'Пост успешно создан!')
      }
    } catch (error) {
      console.error('Ошибка создания поста:', error)
      showModal('error', 'Ошибка', 'Не удалось создать пост. Попробуйте еще раз.')
    }
  }

  const removeImage = () => {
    dispatch(getImageUrl(null))
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: spacing[4],
        }}
      >
        {/* Заголовок страницы */}
        <div style={{ marginBottom: spacing[8], textAlign: 'center' as const }}>
          <h1
            style={{
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              marginBottom: spacing[2],
              fontFamily: typography.fontFamily.sans.join(', '),
              letterSpacing: '-0.025em',
            }}
          >
            Создать новый пост
          </h1>
          <p
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.gray[600],
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Поделитесь своими мыслями с сообществом
          </p>
        </div>

        <Card variant="default" padding="none">
          <CardHeader
            style={{
              padding: spacing[6],
              borderBottom: `1px solid ${colors.gray[100]}`,
              marginBottom: 0,
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.primary[600],
                }}
              >
                ✍️
              </div>
              <div>
                <h2
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.gray[900],
                    margin: 0,
                    fontFamily: typography.fontFamily.sans.join(', '),
                  }}
                >
                  Новая публикация
                </h2>
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[600],
                    margin: 0,
                    fontFamily: typography.fontFamily.sans.join(', '),
                  }}
                >
                  Автор: {user?.nickname || 'Аноним'}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent style={{ padding: spacing[6] }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[6],
              }}
            >
              {/* Заголовок поста */}
              <div>
                <Input
                  {...register('title', {
                    required: 'Заголовок обязателен',
                    minLength: { value: 3, message: 'Минимум 3 символа' },
                    maxLength: { value: 100, message: 'Максимум 100 символов' },
                  })}
                  placeholder="Придумайте интересный заголовок..."
                  label="Заголовок поста"
                  error={errors.title?.message}
                  disabled={isLoading}
                  size="lg"
                  leftIcon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H16C17.1046 20 18 19.1046 18 18V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
                {title && (
                  <div
                    style={{
                      marginTop: spacing[1],
                      fontSize: typography.fontSize.xs,
                      color: colors.gray[500],
                    }}
                  >
                    {title.length}/100 символов
                  </div>
                )}
              </div>

              {/* Контент поста */}
              <div>
                <label
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[1],
                    display: 'block',
                    fontFamily: typography.fontFamily.sans.join(', '),
                  }}
                >
                  Содержание поста
                </label>
                <textarea
                  {...register('content', {
                    required: 'Содержание поста обязательно',
                    minLength: { value: 10, message: 'Минимум 10 символов' },
                    maxLength: {
                      value: 2000,
                      message: 'Максимум 2000 символов',
                    },
                  })}
                  placeholder="Поделитесь своими мыслями, идеями или историей..."
                  rows={6}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: spacing[4],
                    border: `1px solid ${
                      errors.content ? colors.error[500] : colors.gray[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.base,
                    fontFamily: typography.fontFamily.sans.join(', '),
                    lineHeight: typography.lineHeight.relaxed,
                    resize: 'vertical' as const,
                    minHeight: '120px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = colors.primary[500]
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = errors.content
                      ? colors.error[500]
                      : colors.gray[200]
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {errors.content && (
                  <div
                    style={{
                      marginTop: spacing[1],
                      fontSize: typography.fontSize.sm,
                      color: colors.error[600],
                    }}
                  >
                    {errors.content.message}
                  </div>
                )}
                {content && (
                  <div
                    style={{
                      marginTop: spacing[1],
                      fontSize: typography.fontSize.xs,
                      color: colors.gray[500],
                    }}
                  >
                    {content.length}/2000 символов
                  </div>
                )}
              </div>

              {/* Загрузка изображения */}
              <div>
                <label
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[2],
                    display: 'block',
                    fontFamily: typography.fontFamily.sans.join(', '),
                  }}
                >
                  Изображение (необязательно)
                </label>

                {!image_url ? (
                  <div
                    style={{
                      border: `2px dashed ${colors.gray[300]}`,
                      borderRadius: borderRadius.lg,
                      padding: spacing[8],
                      textAlign: 'center' as const,
                      position: 'relative',
                      backgroundColor: colors.gray[50],
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleFile}
                      accept="image/*"
                      disabled={uploadingImage || isLoading}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '3rem',
                        marginBottom: spacing[2],
                      }}
                    >
                      📸
                    </div>
                    <h3
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[900],
                        margin: `0 0 ${spacing[1]}`,
                      }}
                    >
                      {uploadingImage
                        ? 'Загружаем...'
                        : 'Загрузить изображение'}
                    </h3>
                    <p
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.gray[500],
                        margin: 0,
                      }}
                    >
                      JPG, PNG, GIF или WebP (макс. 5MB)
                    </p>
                    {uploadingImage && (
                      <div
                        style={{
                          marginTop: spacing[3],
                          width: '40px',
                          height: '40px',
                          border: `3px solid ${colors.gray[200]}`,
                          borderTop: `3px solid ${colors.primary[500]}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '12px auto 0',
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: borderRadius.lg,
                      overflow: 'hidden',
                      backgroundColor: colors.background.primary,
                    }}
                  >
                    <img
                      src={`http://localhost:3000/${image_url}`}
                      alt="Загруженное изображение"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'contain' as const,
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        padding: spacing[3],
                        backgroundColor: colors.gray[50],
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.gray[600],
                        }}
                      >
                        Изображение загружено
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        disabled={isLoading}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопка отправки */}
              <div
                style={{
                  paddingTop: spacing[4],
                  borderTop: `1px solid ${colors.gray[100]}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[500],
                  }}
                >
                  * Все поля, кроме изображения, обязательны
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!title?.trim() || !content?.trim() || isLoading}
                  style={{ minWidth: '150px' }}
                >
                  Опубликовать
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Модалка уведомлений */}
      {modal.show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl transform"
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            {/* Иконка и заголовок */}
            <div className="flex items-center mb-4">
              {modal.type === 'success' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{modal.title}</h3>
            </div>
            
            {/* Сообщение */}
            <p className="text-gray-600 mb-6">{modal.message}</p>
            
            {/* Кнопки */}
            <div className="flex justify-end">
              <Button
                onClick={closeModal}
                variant={modal.type === 'success' ? 'primary' : 'outline'}
                className="min-w-[100px]"
              >
                {modal.type === 'success' ? 'Отлично!' : 'Понятно'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </Layout>
  )
}
