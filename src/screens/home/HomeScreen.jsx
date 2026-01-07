import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Mic, Users, Info } from '../../components/icons/SimpleIcons'
import logo from '/logo.jpeg'

export const HomeScreen = () => {
  const navigate = useNavigate()

  const navigationItems = [
    {
      icon: Calendar,
      title: 'Event Schedule',
      description: 'View the complete event schedule and timing.',
      action: () => navigate('/schedule'),
      color: 'from-[var(--brand-primary)] to-yellow-400'
    },
    {
      icon: Mic,
      title: 'Speakers',
      description: 'Meet our keynote speakers and presenters.',
      action: () => navigate('/speakers'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Network',
      description: 'Connect with other participants.',
      action: () => navigate('/networking'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Info,
      title: 'About Event',
      description: 'Learn more about the event.',
      action: () => {
        if (typeof window !== 'undefined') {
          window.open('https://www.foundationeep.org/', '_blank', 'noopener,noreferrer')
        } else {
          navigate('/info')
        }
      },
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  return (
    <div className="w-full px-4 pb-8 bg-gradient-to-b from-[var(--brand-bg)] to-[var(--brand-surface)]">
      <div className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
        <img
          src={logo}
          alt="FEEP Logo"
          className="w-40 h-auto drop-shadow-lg rounded-lg"
          loading="lazy"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--brand-text)] mb-1">Welcome to 2nd EE Conference</h1>
          <p className="text-[var(--brand-muted)] text-sm md:text-base">Foundation for Experiential Education and Practices</p>
        </div>
      </div>

      <div className="space-y-4">
        {navigationItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <button
              key={idx}
              onClick={item.action}
              className="w-full text-left rounded-3xl p-4 md:p-5 bg-[var(--brand-surface-2)]/60 border border-[var(--brand-border)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:bg-opacity-10 transition-all duration-300 active:scale-95 group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white flex-shrink-0 group-hover:shadow-lg`}>
                  <Icon size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg md:text-xl text-[var(--brand-text)] mb-1 group-hover:text-[var(--brand-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--brand-muted)] leading-snug">{item.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
