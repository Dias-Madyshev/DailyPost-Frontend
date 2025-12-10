import { useEffect, useState } from 'react'
import PostService from '../services/PostsService'
import { PostResponse } from '../models/posts/PostResponse'
import { useAppSelector } from '../store/hooks'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Layout from '../components/layout/Layout'

export default function Home() {
  const [posts, setPosts] = useState<PostResponse[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAppSelector(state => state.auth)

  const getPosts = async () => {
    try {
      setIsLoading(true)
      const response = await PostService.getPosts()
      setPosts(response.data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  // Компонент загрузки
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px] flex-col space-y-4">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-base">Загружаем посты...</p>
    </div>
  )

  // Компонент пустого состояния
  const EmptyState = () => (
    <div className="text-center py-12 px-4">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Пока нет постов
      </h2>
      <p className="text-gray-500 text-base max-w-md mx-auto">
        Станьте первым, кто поделится своими мыслями!
      </p>
    </div>
  )

  return (
    <Layout>
      {/* Заголовок страницы */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Лента постов
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Откройте для себя интересные истории от нашего сообщества
        </p>
      </div>

      {/* Контент */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !posts || posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map(post => (
            <Card
              key={post.id}
              variant="default"
              padding="none"
              className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >
              <CardHeader className="p-6 pb-4 border-b-0 mb-0">
                <div className="flex items-center gap-3">
                  {/* Аватар пользователя */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-600 flex-shrink-0">
                    {user?.username?.[0]?.toUpperCase() || 'A'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user?.username || 'Анонимный пользователь'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.create_at
                        ? new Date(post.create_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Недавно'}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                {/* Заголовок поста */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                {/* Превью контента */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.content && post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content || 'Нет описания'}
                </p>

                {/* Изображение поста */}
                {post.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`${
                        process.env.REACT_APP_SERVER_URL ||
                        'http://localhost:3000'
                      }/${post.image_url}`}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Метаинформация */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      {post.content ? post.content.length : 0} символов
                    </span>
                    {post.image_url && (
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Изображение</span>
                      </span>
                    )}
                  </div>

                  <div className="text-blue-500 font-medium group-hover:text-blue-600">
                    Читать →
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
