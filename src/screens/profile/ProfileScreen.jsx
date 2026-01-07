import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { getUserProfile, updateUserProfile as updateProfile } from '../../services/firebase/firestore'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'

export const ProfileScreen = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.uid)
        setProfile(data)
        setPhone(data?.phone || '')
        setCompany(data?.company || '')
        setBio(data?.bio || '')
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(user.uid, {
        phone,
        company,
        bio,
        updatedAt: new Date()
      })
      setProfile({ ...profile, phone, company, bio })
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setPhone(profile?.phone || '')
    setCompany(profile?.company || '')
    setBio(profile?.bio || '')
    setEditing(false)
  }

  const handleLogout = async () => {
    navigate('/login')
    await logout()
  }

  if (loading) return <Loading message="Loading profile..." />

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-black mb-8 text-[var(--brand-text)]">My Profile</h1>
      
      <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
            <span className="text-black text-2xl font-bold">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--brand-text)]">{user?.displayName || 'User'}</h2>
            <p className="text-[var(--brand-muted)]">{user?.email}</p>
          </div>
        </div>
        
        {editing ? (
          <div className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          </div>
        ) : (
          <>
            {phone && (
              <div className="mb-4">
                <p className="text-sm text-[var(--brand-muted)]">Phone</p>
                <p className="text-lg font-semibold text-[var(--brand-text)]">{phone}</p>
              </div>
            )}
            {company && (
              <div className="mb-4">
                <p className="text-sm text-[var(--brand-muted)]">Company</p>
                <p className="text-lg font-semibold text-[var(--brand-text)]">{company}</p>
              </div>
            )}
            {bio && (
              <div className="mb-4">
                <p className="text-sm text-[var(--brand-muted)]">Bio</p>
                <p className="text-base text-[var(--brand-text)]">{bio}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex gap-4">
        {editing ? (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setEditing(true)}
              className="flex-1"
            >
              Edit Profile
            </Button>
            <Button
              variant="danger"
              size="lg"
              onClick={handleLogout}
              className="flex-1"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
