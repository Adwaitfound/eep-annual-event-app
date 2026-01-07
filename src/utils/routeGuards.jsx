import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Loading } from '../components/common/Loading'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { RegisterScreen } from '../screens/auth/RegisterScreen'
import { ProfileSetupScreen } from '../screens/auth/ProfileSetupScreen'

export const AuthLayout = ({ children }) => {
  return <>{children}</>
}

export const PrivateRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  if (loading) return <Loading />

  return user ? children : <Navigate to="/login" />
}

export const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  if (loading) return <Loading />

  return user ? <Navigate to="/home" /> : children
}
