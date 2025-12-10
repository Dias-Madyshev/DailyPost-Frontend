// src/App.tsx
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { checkAuth } from './store/auth/authSlice'

import AuthForm from './components/AuthForm'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Profil from './pages/Profil'
import Create from './pages/Create'
import Users from './pages/Users'

function App() {
  const dispatch = useAppDispatch()
  const { isAuth, isLoading } = useAppSelector(state => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // Показываем загрузку пока проверяется токен
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  // Если не авторизован - показываем роуты для неавторизованных пользователей
  if (!isAuth) {
    return (
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        {/* Все остальные пути перенаправляем на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Если авторизован - показываем приложение с навигацией
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/create" element={<Create />} />
        <Route path="/users" element={<Users />} />
        {/* Перенаправляем все неизвестные пути на главную */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}

export default App
