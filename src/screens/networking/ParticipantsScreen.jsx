import React, { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { Input } from '../../components/common/Input'
import {
  Search,
  Filter,
  UserCheck,
  Mail,
  Phone,
  LinkIcon,
  MessageSquare
} from '../../components/icons/SimpleIcons'
import { updateUserProfile } from '../../services/firebase/firestore'

export const ParticipantsScreen = () => {
  const user = useAuthStore((state) => state.user)
  const participants = useAppStore((state) => state.participants)
  const loading = useAppStore((state) => state.loading)
  const loadParticipants = useAppStore((state) => state.loadParticipants)

  const [search, setSearch] = useState('')
  const [selectedInterest, setSelectedInterest] = useState('all')
  const [selectedIntent, setSelectedIntent] = useState('all')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [availabilityUpdating, setAvailabilityUpdating] = useState(false)

  useEffect(() => {
    loadParticipants()
  }, [loadParticipants])

  const interests = useMemo(() => {
    const set = new Set()
    participants.forEach((p) => {
      (p.interests || []).forEach((i) => set.add(i))
    })
    return Array.from(set).sort()
  }, [participants])

  const intents = useMemo(() => {
    const set = new Set()
    participants.forEach((p) => {
      (p.intents || []).forEach((i) => set.add(i))
    })
    return Array.from(set).sort()
  }, [participants])

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const available = p.available ?? p.availability ?? false
      if (showAvailableOnly && !available) return false
      if (selectedInterest !== 'all' && !(p.interests || []).includes(selectedInterest)) return false
      if (selectedIntent !== 'all' && !(p.intents || []).includes(selectedIntent)) return false
      const term = search.trim().toLowerCase()
      if (term) {
        const haystack = [p.displayName, p.company, p.bio].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [participants, showAvailableOnly, selectedInterest, selectedIntent, search])

  const toggleAvailability = async () => {
    if (!user) return
    setAvailabilityUpdating(true)
    try {
      const current = participants.find((p) => p.id === user.uid)
      const next = !(current?.available ?? current?.availability ?? false)
      await updateUserProfile(user.uid, { available: next })
    } finally {
      setAvailabilityUpdating(false)
    }
  }

  if (loading) return <Loading message="Loading participants..." />

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)] px-4 py-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1 className="text-3xl font-black">Networking</h1>
        <span className="text-sm text-[var(--brand-muted)]">{participants.length} people</span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur mb-5 text-white">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search size={16} className="text-white/70" />
            <Input
              placeholder="Search by name, org, or bio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 min-w-[160px]">
            <Filter size={16} className="text-white/70" />
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-white/20 text-sm"
            >
              <option value="all">All interests</option>
              {interests.map((interest) => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 min-w-[160px]">
            <span className="text-xs uppercase tracking-wide text-white/70">Intent</span>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-white/20 text-sm"
            >
              <option value="all">Any intent</option>
              {intents.map((intent) => (
                <option key={intent} value={intent}>{intent}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
              showAvailableOnly ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/10 text-white border-white/20'
            }`}
          >
            Available now
          </button>

          {user && (
            <button
              onClick={toggleAvailability}
              disabled={availabilityUpdating}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-slate-900 border border-white/20 disabled:opacity-70"
            >
              {availabilityUpdating ? 'Updating…' : 'Toggle my availability'}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600">No participants match these filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((participant) => {
            const available = participant.available ?? participant.availability ?? false
            return (
              <Card key={participant.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                    {participant.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold truncate">{participant.displayName || 'Anonymous'}</h3>
                      {available && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                          <UserCheck size={14} /> Available
                        </span>
                      )}
                    </div>
                    {participant.company && (
                      <p className="text-sm text-white/60 truncate">{participant.company}</p>
                    )}
                  </div>
                </div>

                {participant.interests && participant.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {participant.interests.map((interest, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-white/10 text-xs border border-white/10">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                {participant.intents && participant.intents.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {participant.intents.map((intent, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-blue-500/15 text-xs text-blue-100 border border-blue-500/30">
                        {intent}
                      </span>
                    ))}
                  </div>
                )}

                {participant.bio && (
                  <p className="text-sm text-white/70 mb-3 line-clamp-3">{participant.bio}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {participant.email && (
                    <a
                      href={`mailto:${participant.email}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                    >
                      <Mail size={16} /> Email
                    </a>
                  )}
                  {participant.phone && (
                    <a
                      href={`tel:${participant.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                    >
                      <Phone size={16} /> Call
                    </a>
                  )}
                  {participant.linkedin && (
                    <a
                      href={participant.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                    >
                      <LinkIcon size={16} /> LinkedIn
                    </a>
                  )}
                  {participant.phone && (
                    <a
                      href={`https://wa.me/${participant.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-500/40 text-sm"
                    >
                      <MessageSquare size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

            </div>
          )
        }
