import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Home, Calendar, Users, Mic, User } from './icons/SimpleIcons'
import logo from '/logo.jpeg'

export const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const menuItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/speakers', label: 'Speakers', icon: Mic },
    { path: '/networking', label: 'Network', icon: Users },
    { path: '/profile', label: 'Profile', icon: User }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-col h-screen bg-[var(--brand-bg)]">
      {/* Header */}
      <header className="bg-[var(--brand-surface)] border-b border-[var(--brand-border)] z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FEEP Logo" className="h-12 w-auto rounded-lg" />
            <div>
              <h1 className="text-lg font-black text-[var(--brand-primary)]">Annual Event</h1>
              <p className="text-xs text-[var(--brand-muted)]">{user?.displayName || 'Welcome'}</p>
            </div>
          </div>
          {user && (
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] text-black flex items-center justify-center font-bold text-lg">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-y-auto pb-20 bg-[var(--brand-bg)]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--brand-surface)] border-t border-[var(--brand-border)] z-50">
        <div className="flex justify-around">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                isActive(path)
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-text)]'
              }`}
            >
              <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
              <span className={`text-xs mt-1 ${
                isActive(path) ? 'font-black' : 'font-normal'
              }`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
