# Environment Variables для продакшена на Vercel

## Обязательные переменные для фронтенда на Vercel:

REACT_APP_SERVER_URL=https://daily-post-backend.onrender.com

## Инструкция:

1. Зайдите в настройки вашего проекта на Vercel
2. Перейдите в раздел Environment Variables
3. Добавьте переменную выше для всех окружений (Production, Preview, Development)
4. Пересоберите и передеплойте проект

## Важно:

- REACT_APP_SERVER_URL должен совпадать с URL вашего Render backend сервиса
- Переменная должна начинаться с REACT*APP* чтобы быть доступной в браузере
- После изменения переменных нужно передеплоить проект на Vercel
