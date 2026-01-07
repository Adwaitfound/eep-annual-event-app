import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import logo from '/logo.jpeg'

export const LoginScreen = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="FEEP Logo" className="h-24 w-auto mx-auto mb-4 rounded-lg" />
          <p className="text-[var(--brand-muted)] text-sm">Welcome back!</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-[var(--brand-muted)] text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[var(--brand-primary)] hover:underline font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
