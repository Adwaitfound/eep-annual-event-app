import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import logo from '/logo.jpeg'

export const RegisterScreen = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password, displayName, phone)
      navigate('/profile-setup')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="FEEP Logo" className="h-24 w-auto mx-auto mb-4 rounded-lg" />
          <p className="text-[var(--brand-muted)] text-sm">Create your account</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            label="Phone Number (WhatsApp)"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-[var(--brand-muted)] text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[var(--brand-primary)] hover:underline font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
