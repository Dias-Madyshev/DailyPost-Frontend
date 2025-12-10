import React, { useState, useEffect } from 'react'
import { logout } from '../store/auth/authSlice'
import { useAppDispatch } from '../store/hooks'
import Layout from '../components/layout/Layout'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import UserService from '../services/UserService'
import { UserResponse } from '../models/user/UserResponse'

export default function Profil() {
  const dispatch = useAppDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [profile, setProfile] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile()
        setProfile(response.data)
        setNewUsername(response.data.username)
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) return

    try {
      setIsSaving(true)
      const response = await UserService.updateProfile(newUsername.trim())
      setProfile(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowLogoutModal(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Неизвестно'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ошибка загрузки
            </h2>
            <p className="text-gray-600">Не удалось загрузить данные профиля</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Мой профиль
            </h1>
            <p className="text-gray-600">
              Управление вашими данными и настройками
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная информация */}
            <div className="lg:col-span-2">
              <Card variant="elevated" padding="none" className="mb-6">
                <CardHeader className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Информация профиля
                  </h2>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Аватар и основные данные */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {profile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            className="text-2xl font-bold bg-gray-50 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Имя пользователя"
                          />
                        ) : (
                          <h3 className="text-2xl font-bold text-gray-900">
                            {profile.username}
                          </h3>
                        )}
                      </div>
                      {profile.nickname && (
                        <p className="text-gray-600 mt-1">
                          @{profile.nickname}
                        </p>
                      )}
                      <div className="flex items-center mt-2">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profile.isactivated
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {profile.isactivated
                            ? 'Активирован'
                            : 'Не активирован'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Кнопки управления */}
                  <div className="flex space-x-3 mb-6">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleUpdateProfile}
                          disabled={isSaving || !newUsername.trim()}
                          variant="primary"
                          size="sm"
                        >
                          {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false)
                            setNewUsername(profile.username)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Отмена
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        Редактировать
                      </Button>
                    )}
                  </div>

                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        ID пользователя
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        #{profile.id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Дата регистрации
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(profile.created_at)}
                      </dd>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Статистика */}
            <div className="space-y-6">
              <Card variant="elevated" padding="none">
                <CardHeader className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Статистика
                  </h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {profile.posts_count}
                      </div>
                      <div className="text-sm text-gray-500">
                        Постов опубликовано
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {profile.isactivated ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Статус активации
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Действия аккаунта */}
              <Card variant="elevated" padding="none">
                <CardHeader className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Управление аккаунтом
                  </h2>
                </CardHeader>
                <CardContent className="p-6">
                  <Button
                    onClick={() => setShowLogoutModal(true)}
                    variant="danger"
                    className="w-full"
                  >
                    Выйти из аккаунта
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Модалка выхода */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Подтверждение выхода
              </h3>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите выйти из аккаунта?
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  className="flex-1"
                >
                  Выйти
                </Button>
                <Button
                  onClick={() => setShowLogoutModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
