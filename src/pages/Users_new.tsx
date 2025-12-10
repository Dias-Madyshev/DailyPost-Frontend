import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Input from '../components/ui/Input'
import UserService from '../services/UserService'
import { UserResponse } from '../models/user/UserResponse'

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([])

  // Загрузка пользователей
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await UserService.getUsers()
      setUsers(response.data)
      setFilteredUsers(response.data)
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Фильтрация пользователей по поиску
  useEffect(() => {
    const filtered = users.filter(
      user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nickname &&
          user.nickname.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // Компонент загрузки
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px] flex-col space-y-4">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-base">Загружаем пользователей...</p>
    </div>
  )

  // Форматирование даты
  const getActivityStatus = (postsCount: number) => {
    if (postsCount === 0) return 'Новичок'
    if (postsCount < 5) return 'Начинающий автор'
    if (postsCount < 15) return 'Активный автор'
    return 'Опытный автор'
  }

  return (
    <Layout>
      {/* Заголовок и поиск */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Наше сообщество
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Познакомьтесь с авторами интересных постов
          </p>
        </div>

        {/* Поиск */}
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Статистика */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-gray-600">Всего пользователей</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isactivated).length}
            </div>
            <div className="text-sm text-gray-600">Активированных</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => parseInt(u.posts_count.toString()) > 0).length}
            </div>
            <div className="text-sm text-gray-600">С постами</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.reduce(
                (total, user) => total + parseInt(user.posts_count.toString()),
                0,
              )}
            </div>
            <div className="text-sm text-gray-600">Всего постов</div>
          </div>
        </div>
      )}

      {/* Список пользователей */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  {/* Аватар */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(user.nickname || user.username)[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.nickname || 'Пользователь'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {user.username}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Статус активации */}
                <div className="flex items-center space-x-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.isactivated ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      user.isactivated ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {user.isactivated ? 'Активирован' : 'Не активирован'}
                  </span>
                </div>

                {/* Статистика постов */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Постов:</span>
                    <span className="font-semibold text-gray-900">
                      {user.posts_count}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 text-center">
                    {getActivityStatus(parseInt(user.posts_count.toString()))}
                  </div>
                </div>

                {/* Индикатор активности */}
                {parseInt(user.posts_count.toString()) > 0 && (
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (parseInt(user.posts_count.toString()) / 20) * 100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Сообщение о пустом результате поиска */}
      {!isLoading && filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Пользователи не найдены
          </h3>
          <p className="text-gray-500">Попробуйте изменить критерии поиска</p>
        </div>
      )}
    </Layout>
  )
}
