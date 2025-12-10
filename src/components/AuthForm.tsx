import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthForm: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div
        className="
          flex flex-col gap-4 w-full max-w-sm p-8
          bg-white 
          rounded-2xl 
          border border-gray-200
          shadow-xl
        "
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome
        </h2>

        <button
          onClick={() => navigate('/login')}
          className="
            w-full py-3 
            bg-blue-600 
            text-white 
            rounded-xl 
            shadow-md 
            hover:bg-blue-700 
            hover:shadow-lg 
            active:scale-[0.98] 
            transition-all
          "
        >
          Login
        </button>

        <button
          onClick={() => navigate('/registration')}
          className="
            w-full py-3 
            bg-green-600 
            text-white 
            rounded-xl 
            shadow-md 
            hover:bg-green-700 
            hover:shadow-lg 
            active:scale-[0.98] 
            transition-all
          "
        >
          Registration
        </button>
      </div>
    </div>
  )
}

export default AuthForm
