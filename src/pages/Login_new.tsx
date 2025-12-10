import { useState } from 'react'
import { login } from '../store/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useNavigate, Link } from 'react-router-dom'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { colors, typography, spacing } from '../styles/design-system'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(state => state.auth)

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return
    }

    const result = await dispatch(login({ username, password }))
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/home')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.background.secondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
        fontFamily: typography.fontFamily.sans.join(', '),
      }}
    >
      {/* Фоновые декоративные элементы */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: colors.primary[100],
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: colors.primary[200],
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      <Card
        variant="elevated"
        padding="none"
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardHeader
          style={{
            textAlign: 'center' as const,
            padding: `${spacing[8]} ${spacing[8]} ${spacing[6]}`,
            borderBottom: 'none',
            marginBottom: 0,
          }}
        >
          {/* Логотип/иконка */}
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: colors.primary[500],
              borderRadius: '50%',
              margin: `0 auto ${spacing[4]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typography.fontSize['2xl'],
            }}
          >
            🔐
          </div>

          <h1
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              margin: `0 0 ${spacing[2]}`,
              letterSpacing: '-0.025em',
            }}
          >
            Добро пожаловать
          </h1>

          <p
            style={{
              fontSize: typography.fontSize.base,
              color: colors.gray[600],
              margin: 0,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Войдите в свою учетную запись для продолжения
          </p>
        </CardHeader>

        <CardContent style={{ padding: `0 ${spacing[8]} ${spacing[8]}` }}>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleLogin()
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[6],
            }}
          >
            <div>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите имя пользователя"
                label="Имя пользователя"
                disabled={isLoading}
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            <div>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите пароль"
                label="Пароль"
                disabled={isLoading}
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="10"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                    <path
                      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            {/* Ошибка */}
            {error && (
              <div
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.error[50],
                  border: `1px solid ${colors.error[500]}`,
                  borderRadius: '6px',
                  color: colors.error[700],
                  fontSize: typography.fontSize.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="15"
                    y1="9"
                    x2="9"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="9"
                    y1="9"
                    x2="15"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!username.trim() || !password.trim() || isLoading}
              style={{ width: '100%' }}
            >
              Войти
            </Button>
          </form>

          {/* Ссылка на регистрацию */}
          <div
            style={{
              textAlign: 'center' as const,
              marginTop: spacing[6],
              paddingTop: spacing[6],
              borderTop: `1px solid ${colors.gray[200]}`,
            }}
          >
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.gray[600],
                margin: 0,
              }}
            >
              Еще нет аккаунта?{' '}
              <Link
                to="/registration"
                style={{
                  color: colors.primary[600],
                  textDecoration: 'none',
                  fontWeight: typography.fontWeight.medium,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = colors.primary[700]
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = colors.primary[600]
                }}
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
