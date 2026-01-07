import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { createUserProfile } from '../../services/firebase/firestore'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'

export const ProfileSetupScreen = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSetup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        phone,
        company,
        bio,
        createdAt: new Date(),
        role: 'participant'
      })
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[var(--brand-primary)] mb-2">Complete Your Profile</h1>
          <p className="text-[var(--brand-muted)] text-sm">Help us know more about you</p>
        </div>
        
        <form onSubmit={handleSetup} className="space-y-5">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          
          <Input
            label="Company/Organization"
            type="text"
            placeholder="Your company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">Bio</label>
            <textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--brand-border)] bg-white text-black placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              rows="4"
            />
          </div>
          
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
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </div>
    </div>
  )
}
