import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { Button } from '../../components/common/Button'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, MapPin, Users, CheckCircle, Circle, Filter, AlertTriangle } from '../../components/icons/SimpleIcons'
import { submitSessionFeedback } from '../../services/firebase/firestore'
import { getInitials, generateAvatarColor, getSessionEndTime, sessionsOverlap } from '../../utils/helpers'

// Track color configurations (matching Meller design)
const trackColors = {
  'Masterclass': { bg: 'from-pink-500 to-rose-600', label: 'text-white', accent: 'bg-pink-600', badge: 'bg-pink-100 text-pink-900' },
  'K-12': { bg: 'from-blue-500 to-cyan-600', label: 'text-white', accent: 'bg-blue-600', badge: 'bg-blue-100 text-blue-900' },
  'Experience Based T&D': { bg: 'from-purple-500 to-indigo-600', label: 'text-white', accent: 'bg-purple-600', badge: 'bg-purple-100 text-purple-900' },
  'Nature Based Practices': { bg: 'from-green-500 to-emerald-600', label: 'text-white', accent: 'bg-green-600', badge: 'bg-green-100 text-green-900' },
  'Inclusive Practices': { bg: 'from-amber-500 to-orange-600', label: 'text-white', accent: 'bg-amber-600', badge: 'bg-amber-100 text-amber-900' },
  'default': { bg: 'from-slate-500 to-slate-700', label: 'text-white', accent: 'bg-slate-600', badge: 'bg-slate-100 text-slate-900' },
}

const getTrackColor = (track) => {
  return trackColors[track] || trackColors.default
}

export const ScheduleScreen = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const schedule = useAppStore((state) => state.schedule)
  const loading = useAppStore((state) => state.loading)
  const registeredSessions = useAppStore((state) => state.registeredSessions)
  const loadSchedule = useAppStore((state) => state.loadSchedule)
  const subscribeToScheduleUpdates = useAppStore((state) => state.subscribeToScheduleUpdates)
  const loadUserRegistrations = useAppStore((state) => state.loadUserRegistrations)
  const registerForEvent = useAppStore((state) => state.registerForEvent)
  const unregisterFromEvent = useAppStore((state) => state.unregisterFromEvent)

  const [feedbackSession, setFeedbackSession] = useState(null)
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  const [selectedDay, setSelectedDay] = useState(null)
  const [filterTrack, setFilterTrack] = useState('all')
  const [showRegisteredOnly, setShowRegisteredOnly] = useState(false)
  const [sortBy, setSortBy] = useState('time') // 'time' | 'track'

  useEffect(() => {
    loadSchedule()
    const unsubscribe = subscribeToScheduleUpdates()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [loadSchedule, subscribeToScheduleUpdates])

  useEffect(() => {
    if (user?.uid) {
      loadUserRegistrations(user.uid)
    }
  }, [user, loadUserRegistrations])

  // Group sessions by day
  const sessionsByDay = useMemo(() => {
    const grouped = {}
    schedule.forEach((session) => {
      if (session.date) {
        const dateKey = session.date
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(session)
      }
    })
    
    // Sort sessions within each day by start time
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => {
        return (a.startTime || '').localeCompare(b.startTime || '')
      })
    })
    
    return grouped
  }, [schedule])

  const days = useMemo(() => Object.keys(sessionsByDay).sort(), [sessionsByDay])
  
  // Get unique tracks
  const tracks = useMemo(() => {
    const trackSet = new Set()
    schedule.forEach(session => {
      if (session.track) trackSet.add(session.track)
    })
    return Array.from(trackSet)
  }, [schedule])

  useEffect(() => {
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0])
    }
  }, [days, selectedDay])

  const handleToggleRegistration = async (sessionId) => {
    if (!user) return
    
    try {
      if (registeredSessions.includes(sessionId)) {
        await unregisterFromEvent(user.uid, sessionId)
      } else {
        await registerForEvent(user.uid, sessionId)
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  const openFeedback = (session) => {
    setFeedbackSession(session)
    setFeedbackRating(5)
    setFeedbackText('')
    setFeedbackError('')
    setFeedbackMessage('')
  }

  const closeFeedback = () => {
    setFeedbackSession(null)
    setFeedbackText('')
    setFeedbackError('')
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    if (!user || !feedbackSession) return
    setFeedbackSubmitting(true)
    setFeedbackError('')
    try {
      await submitSessionFeedback(user.uid, feedbackSession.id, {
        rating: feedbackRating,
        comment: feedbackText.trim(),
        sessionTitle: feedbackSession.title || '',
        sessionDate: feedbackSession.date || null,
      })
      setFeedbackMessage('Thank you! Feedback saved.')
      closeFeedback()
    } catch (err) {
      console.error('Feedback error:', err)
      setFeedbackError('Could not submit feedback. Please try again.')
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  const filteredSessions = useMemo(() => {
    if (!selectedDay) return []
    
    let sessions = sessionsByDay[selectedDay] || []
    
    if (filterTrack !== 'all') {
      sessions = sessions.filter(s => s.track === filterTrack)
    }
    
    if (showRegisteredOnly) {
      sessions = sessions.filter(s => registeredSessions.includes(s.id))
    }

    // Sort by selected criterion
    const sorted = [...sessions]
    if (sortBy === 'track') {
      sorted.sort((a, b) => {
        const trackA = (a.track || 'zzz').toLowerCase()
        const trackB = (b.track || 'zzz').toLowerCase()
        if (trackA === trackB) {
          return (a.startTime || '').localeCompare(b.startTime || '')
        }
        return trackA.localeCompare(trackB)
      })
    }
    // Default 'time' keeps existing ordering from sessionsByDay (already time-sorted)
    return sorted
  }, [selectedDay, sessionsByDay, filterTrack, showRegisteredOnly, registeredSessions, sortBy])

  if (loading) return <Loading message="Loading schedule..." />

  return (
    <div className="w-full px-0 py-0 pb-24 bg-gradient-to-b from-[var(--brand-bg)] to-[var(--brand-surface)] text-[var(--brand-text)]">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-3xl font-black mb-1">Event Schedule</h1>
        <p className="text-sm text-[var(--brand-muted)]">Select sessions you want to attend</p>
      </div>

      {!user && (
        <Card className="mb-4 border-[var(--brand-primary)] bg-[var(--brand-primary)]/20 backdrop-blur">
          <div className="flex items-start gap-2 text-sm text-yellow-800">
            <div className="mt-1">
              <Circle size={16} />
            </div>
            <div>
              <p className="font-semibold">Sign in to save your picks</p>
              <p className="text-yellow-700">You can browse everything, but you need to log in to add sessions to your schedule.</p>
            </div>
          </div>
        </Card>
      )}

      {schedule.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600">No events scheduled yet</p>
        </Card>
      ) : (
        <>
          {/* Day Selector */}
          <div className="mb-6 px-4">
            <div className="flex gap-3 pb-2 overflow-x-auto">
              {days.map((day) => {
                const date = parseISO(day)
                const isSelected = selectedDay === day
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all shadow-lg border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                        : 'bg-white/10 text-white border-white/15 hover:bg-white/15 backdrop-blur'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium uppercase tracking-wide opacity-80">{format(date, 'EEE')}</div>
                      <div className={`text-xl font-black ${isSelected ? 'text-slate-900' : 'text-blue-300'}`}>
                        {format(date, 'd')}
                      </div>
                      <div className="text-xs opacity-80">{format(date, 'MMM')}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-5 px-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap gap-3 items-center backdrop-blur">
              <div className="flex items-center gap-2">
              <Filter size={16} className="text-white/70" />
              <select
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/90 text-sm text-slate-900"
              >
                <option value="all">All Tracks</option>
                {tracks.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>

              <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-white/20 rounded-lg bg-white/90 text-sm text-slate-900"
              >
                <option value="time">By Time</option>
                <option value="track">By Track / Area</option>
              </select>
            </div>
            
              {user && (
                <button
                  onClick={() => setShowRegisteredOnly(!showRegisteredOnly)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                    showRegisteredOnly
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/90 text-slate-900 hover:bg-white'
                  }`}
                >
                  {showRegisteredOnly ? 'Show All' : 'My Schedule'}
                </button>
              )}
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600">
                {showRegisteredOnly ? 'No registered sessions for this day' : 'No sessions available'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-8">
              {filteredSessions.map((session) => {
                const isRegistered = registeredSessions.includes(session.id)
                const endTime = getSessionEndTime(session)
                const masterclassCity = session.track === 'Masterclass' && session.location
                  ? session.location.split('-')[0].trim()
                  : null
                const cleanedDescription = session.description
                  ? session.description
                      .replace(/\b(morning|afternoon|evening)\b/gi, '')
                      .replace(/\s+/g, ' ')
                      .trim()
                  : ''
                const overlapping = user
                  ? schedule.filter((s) =>
                      registeredSessions.includes(s.id) &&
                      s.id !== session.id &&
                      sessionsOverlap(s, session)
                    )
                  : []
                const hasConflict = overlapping.length > 0
                return (
                  <div
                    key={session.id}
                    className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-slate-700 to-slate-800 text-white border ${
                      hasConflict ? 'border-red-500/60 ring-2 ring-red-400/60 shadow-red-500/30' : 'border-slate-600/40'
                    }`}
                  >
                    {/* Top accent bar with track badge */}
                    <div className="px-4 pt-4 pb-2 bg-white/5 flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white/90">
                        {session.track || 'Session'}
                      </span>
                      {masterclassCity && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900">
                          <MapPin size={14} className="text-blue-600" />
                          <span>{masterclassCity}</span>
                        </span>
                      )}
                      {hasConflict && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                          <AlertTriangle size={14} />
                          <span>Time conflict</span>
                        </span>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-lg font-black mb-2 leading-tight line-clamp-2">
                        {session.title}
                      </h3>

                      {/* Description */}
                      {cleanedDescription && (
                        <p className="text-white/70 text-sm mb-3 line-clamp-2 flex-1">
                          {cleanedDescription}
                        </p>
                      )}

                      {/* Session Info */}
                      <div className="space-y-2 text-sm mb-4">
                        {session.startTime && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span className="font-semibold">
                              {endTime ? `${session.startTime} – ${endTime}` : session.startTime}
                            </span>
                          </div>
                        )}
                        {session.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{session.location}</span>
                            {hasConflict && (
                              <span className="ml-2 text-xs font-semibold text-red-200">Conflicts with your schedule</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Speakers */}
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-white/70 mb-2">Presenters</p>
                          <div className="flex flex-wrap gap-2">
                            {session.speakers.slice(0, 3).map((speaker, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => navigate('/speakers', { state: { focusSpeaker: speaker } })}
                                className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs hover:bg-white/30 transition"
                                aria-label={`View details for ${speaker}`}
                              >
                                <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-xs font-bold">
                                  {getInitials(speaker)[0]}
                                </div>
                                <span className="truncate max-w-[9rem]">{speaker}</span>
                              </button>
                            ))}
                            {session.speakers.length > 3 && (
                              <span className="text-xs text-white/70">+{session.speakers.length - 3}</span>
                            )}
                          </div>
                          <p className="text-xs text-white/60 mt-2">Tea and Lunch included for all.</p>
                        </div>
                      )}
                    </div>

                    {/* Register Button */}
                    {user && (
                      <div className="mx-4 mb-4 flex flex-col gap-2">
                        <button
                          onClick={() => handleToggleRegistration(session.id)}
                          className={`px-4 py-3 rounded-full font-black text-sm transition-all flex items-center justify-center gap-2 ${
                            isRegistered
                              ? 'bg-[var(--brand-primary)] text-black shadow-lg shadow-[var(--brand-primary)]/50'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {isRegistered ? <CheckCircle size={16} /> : <Circle size={16} />}
                          {isRegistered ? 'Added' : 'Add to Schedule'}
                        </button>
                        {isRegistered && (
                          <button
                            onClick={() => openFeedback(session)}
                            className="px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-900 border border-white/70 shadow hover:shadow-lg hover:bg-white/90 transition"
                          >
                            Leave feedback for this session
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {feedbackSession && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur flex items-center justify-center px-4">
          <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[var(--brand-muted)]">Feedback</p>
                <h3 className="text-xl font-bold text-[var(--brand-text)]">{feedbackSession.title}</h3>
              </div>
              <button onClick={closeFeedback} className="text-2xl leading-none text-[var(--brand-muted)] hover:text-[var(--brand-text)]" aria-label="Close feedback">
                ×
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmitFeedback}>
              <div>
                <label className="block text-sm font-semibold mb-1">Rating</label>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--brand-bg)] border border-[var(--brand-border)] text-[var(--brand-text)]"
                >
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>{r} - {r === 5 ? 'Excellent' : r === 4 ? 'Good' : r === 3 ? 'Okay' : r === 2 ? 'Poor' : 'Very Poor'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Comments (optional)</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--brand-bg)] border border-[var(--brand-border)] text-[var(--brand-text)] resize-none"
                  placeholder="What worked well? What can be improved?"
                />
              </div>

              {feedbackError && (
                <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {feedbackError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFeedback}
                  className="px-4 py-2 rounded-full border border-[var(--brand-border)] text-[var(--brand-text)] hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="px-4 py-2 rounded-full bg-[var(--brand-primary)] text-black font-semibold disabled:opacity-60"
                >
                  {feedbackSubmitting ? 'Submitting…' : 'Submit feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
