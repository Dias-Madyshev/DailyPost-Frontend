import { useState } from 'react'
import { regestration } from '../store/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useNavigate, Link } from 'react-router-dom'
import Card, { CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { colors, typography, spacing } from '../styles/design-system'

export default function Registration() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(state => state.auth)

  const [username, setUsername] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  // Валидация формы
  const [errors, setErrors] = useState<{
    email?: string
    nickname?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!username.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!emailRegex.test(username)) {
      newErrors.email = 'Введите корректный email'
    }

    // Валидация nickname
    if (!nickname.trim()) {
      newErrors.nickname = 'Никнейм обязателен'
    } else if (nickname.trim().length < 3) {
      newErrors.nickname = 'Никнейм должен содержать минимум 3 символа'
    }

    // Валидация пароля
    if (!password.trim()) {
      newErrors.password = 'Пароль обязателен'
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    // Валидация подтверждения пароля
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegistration = async () => {
    if (!validateForm()) {
      return
    }

    const result = await dispatch(
      regestration({
        username: username.trim(),
        password,
        nickname: nickname.trim(),
      }),
    )

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegistration()
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
          top: '15%',
          right: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: colors.success[500],
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: colors.primary[300],
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Card
        variant="elevated"
        padding="none"
        style={{
          width: '100%',
          maxWidth: '450px',
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
              backgroundColor: colors.success[500],
              borderRadius: '50%',
              margin: `0 auto ${spacing[4]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typography.fontSize['2xl'],
            }}
          >
            ✨
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
            Создать аккаунт
          </h1>

          <p
            style={{
              fontSize: typography.fontSize.base,
              color: colors.gray[600],
              margin: 0,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Присоединяйтесь к нашему сообществу авторов
          </p>
        </CardHeader>

        <CardContent style={{ padding: `0 ${spacing[8]} ${spacing[8]}` }}>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleRegistration()
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[5],
            }}
          >
            {/* Email */}
            <div>
              <Input
                type="email"
                value={username}
                onChange={e => {
                  setUsername(e.target.value)
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }))
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Введите ваш email"
                label="Email адрес"
                error={errors.email}
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
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            {/* Nickname */}
            <div>
              <Input
                type="text"
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value)
                  if (errors.nickname) {
                    setErrors(prev => ({ ...prev, nickname: undefined }))
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Придумайте никнейм"
                label="Никнейм"
                error={errors.nickname}
                disabled={isLoading}
                helperText="Будет отображаться в ваших постах"
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

            {/* Password */}
            <div>
              <Input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }))
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Создайте пароль"
                label="Пароль"
                error={errors.password}
                disabled={isLoading}
                helperText="Минимум 6 символов"
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

            {/* Confirm Password */}
            <div>
              <Input
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Повторите пароль"
                label="Подтверждение пароля"
                error={errors.confirmPassword}
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
                      d="M9 12L11 14L15 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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

            {/* Ошибка сервера */}
            {error && (
              <div
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.error[50],
                  border: `1px solid ${colors.error[200]}`,
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
              disabled={
                !username.trim() ||
                !nickname.trim() ||
                !password.trim() ||
                !confirmPassword.trim() ||
                isLoading
              }
              style={{
                width: '100%',
                backgroundColor: colors.success[500],
              }}
            >
              Создать аккаунт
            </Button>
          </form>

          {/* Ссылка на вход */}
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
              Уже есть аккаунт?{' '}
              <Link
                to="/login"
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
                Войти
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
