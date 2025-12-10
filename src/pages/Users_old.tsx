import React, { useState } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '../styles/design-system'

// Временные данные пользователей (в реальном приложении это будет из API)
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    nickname: 'John Doe',
    isactivated: true,
    postsCount: 15,
    joinedDate: '2024-01-15',
    lastActive: '1 день назад',
  },
  {
    id: 2,
    username: 'jane_smith',
    nickname: 'Jane Smith',
    isactivated: true,
    postsCount: 8,
    joinedDate: '2024-02-03',
    lastActive: '3 дня назад',
  },
  {
    id: 3,
    username: 'mike_wilson',
    nickname: 'Mike Wilson',
    isactivated: false,
    postsCount: 2,
    joinedDate: '2024-03-10',
    lastActive: '1 неделю назад',
  },
  {
    id: 4,
    username: 'sarah_johnson',
    nickname: 'Sarah Johnson',
    isactivated: true,
    postsCount: 23,
    joinedDate: '2023-12-01',
    lastActive: '2 часа назад',
  },
  {
    id: 5,
    username: 'alex_brown',
    nickname: 'Alex Brown',
    isactivated: true,
    postsCount: 11,
    joinedDate: '2024-01-28',
    lastActive: '5 дней назад',
  },
]

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'posts' | 'date'>('name')

  // Фильтрация пользователей
  const filteredUsers = mockUsers.filter(
    user =>
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Сортировка пользователей
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nickname.localeCompare(b.nickname)
      case 'posts':
        return b.postsCount - a.postsCount
      case 'date':
        return (
          new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        )
      default:
        return 0
    }
  })

  const UserCard = ({ user }: { user: (typeof mockUsers)[0] }) => (
    <Card
      variant="default"
      padding="md"
      style={{
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow =
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
        {/* Аватар */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: colors.primary[100],
            border: `2px solid ${
              user.isactivated ? colors.success[200] : colors.gray[200]
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.primary[600],
            position: 'relative' as const,
            flexShrink: 0,
          }}
        >
          {user.nickname[0].toUpperCase()}

          {/* Индикатор статуса */}
          <div
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: user.isactivated
                ? colors.success[500]
                : colors.gray[400],
              border: `2px solid ${colors.background.primary}`,
            }}
          />
        </div>

        {/* Информация о пользователе */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[1],
            }}
          >
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.gray[900],
                margin: 0,
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
              {user.nickname}
            </h3>

            {user.isactivated && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10"
                  stroke={colors.success[500]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke={colors.success[500]}
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>

          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
              margin: `0 0 ${spacing[2]}`,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            @{user.username}
          </p>

          {/* Статистика */}
          <div
            style={{
              display: 'flex',
              gap: spacing[4],
              fontSize: typography.fontSize.sm,
              color: colors.gray[500],
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.828 14.828L21 21M16.5 10.5C16.5 13.5376 14.0376 16 11 16C7.96243 16 5.5 13.5376 5.5 10.5C5.5 7.46243 7.96243 5 11 5C14.0376 5 16.5 7.46243 16.5 10.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {user.postsCount} постов
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <polyline
                  points="12,6 12,12 16,14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {user.lastActive}
            </div>
          </div>
        </div>

        {/* Дата регистрации */}
        <div style={{ textAlign: 'right' as const }}>
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.gray[500],
              marginBottom: spacing[1],
            }}
          >
            Регистрация
          </div>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.gray[700],
            }}
          >
            {new Date(user.joinedDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <Layout>
      <div
        style={{
          maxWidth: '900px',
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
            Пользователи сообщества
          </h1>
          <p
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.gray[600],
              fontFamily: typography.fontFamily.sans.join(', '),
            }}
          >
            Познакомьтесь с авторами нашего блога
          </p>
        </div>

        {/* Панель фильтров */}
        <Card
          variant="default"
          padding="md"
          style={{ marginBottom: spacing[6] }}
        >
          <div
            style={{
              display: 'flex',
              gap: spacing[4],
              alignItems: 'center',
              flexWrap: 'wrap' as const,
            }}
          >
            {/* Поиск */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <Input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            {/* Сортировка */}
            <div>
              <label
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.gray[700],
                  marginRight: spacing[2],
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                Сортировка:
              </label>
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'posts' | 'date')
                }
                style={{
                  padding: `${spacing[2]} ${spacing[3]}`,
                  border: `1px solid ${colors.gray[200]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm,
                  backgroundColor: colors.background.primary,
                  color: colors.gray[700],
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="name">По имени</option>
                <option value="posts">По количеству постов</option>
                <option value="date">По дате регистрации</option>
              </select>
            </div>
          </div>

          {/* Статистика */}
          <div
            style={{
              marginTop: spacing[4],
              paddingTop: spacing[4],
              borderTop: `1px solid ${colors.gray[100]}`,
              display: 'flex',
              gap: spacing[6],
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
            }}
          >
            <div>
              <span style={{ fontWeight: typography.fontWeight.medium }}>
                Всего пользователей:
              </span>
              {sortedUsers.length}
            </div>
            <div>
              <span style={{ fontWeight: typography.fontWeight.medium }}>
                Активированных:
              </span>
              {sortedUsers.filter(u => u.isactivated).length}
            </div>
            <div>
              <span style={{ fontWeight: typography.fontWeight.medium }}>
                Всего постов:
              </span>
              {sortedUsers.reduce((sum, u) => sum + u.postsCount, 0)}
            </div>
          </div>
        </Card>

        {/* Список пользователей */}
        {sortedUsers.length === 0 ? (
          <div
            style={{
              textAlign: 'center' as const,
              padding: spacing[12],
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: spacing[4],
              }}
            >
              🔍
            </div>
            <h2
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.semibold,
                color: colors.gray[600],
                marginBottom: spacing[2],
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
              Пользователи не найдены
            </h2>
            <p
              style={{
                color: colors.gray[500],
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.sans.join(', '),
              }}
            >
              Попробуйте изменить поисковый запрос
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[4],
            }}
          >
            {sortedUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
