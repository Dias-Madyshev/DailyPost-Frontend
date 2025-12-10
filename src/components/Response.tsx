import React, { FC } from 'react'
import { UserResponse } from '../models/user/UserResponse'

interface Props {
  user: UserResponse | null
}

const Response: FC<Props> = ({ user }) => {
  if (!user) {
    return <p>No user data</p>
  }
  return (
    <div>
      <h1>{user.username}</h1>
      <p>id:{user.id}</p>
      <p>{user ? 'Успешно вошли в систему' : 'Не удалось установить связь'}</p>
    </div>
  )
}

export default Response
