import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { Card } from '../../components/common/Card'
import { Loading } from '../../components/common/Loading'
import { getInitials, generateAvatarColor, findConflictingSessions, getSessionEndTime, formatDate } from '../../utils/helpers'
import { CheckCircle, Circle, Search } from '../../components/icons/SimpleIcons'

// Track to gradient mapping for vibrant designs
const trackGradients = {
  'Masterclass': 'from-pink-500 to-rose-600',
  'K-12': 'from-blue-500 to-cyan-600',
  'Experience Based T&D': 'from-purple-500 to-indigo-600',
  'Nature Based Practices': 'from-green-500 to-emerald-600',
  'Inclusive Practices': 'from-amber-500 to-orange-600',
  'default': 'from-slate-500 to-slate-700',
}

const getTrackGradient = (track) => {
  return trackGradients[track] || trackGradients.default
}

// External reference links/summaries sourced from user-provided pages
const speakerExternalInfo = {
  'laurie-frank': {
    url: 'https://www.foundationeep.org/masterclasslauriefrank',
    summary:
      'Experiential educator; community-building, collaborative leadership, SEL, appreciative inquiry; author of Adventure in the Classroom and Journey Toward the Caring Classroom.',
  },
  'mark-collard': {
    url: 'https://www.foundationeep.org/master-class-mark-collard',
    summary:
      'Experiential trainer and “lazy facilitator”; founder of playmeo; 36+ years, 5 books, 800+ activities; focus on program design, trust/psych safety, facilitation mastery.',
  },
  default: {
    url: 'https://www.foundationeep.org/feepconference2026',
    summary: 'Conference presenter. Visit the conference page for full bio and workshop details.',
  },
}

export const SpeakersListScreen = () => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const speakers = useAppStore((state) => state.speakers)
  const loading = useAppStore((state) => state.loading)
  const loadSpeakers = useAppStore((state) => state.loadSpeakers)
  const schedule = useAppStore((state) => state.schedule)
  const loadSchedule = useAppStore((state) => state.loadSchedule)
  const registeredSessions = useAppStore((state) => state.registeredSessions)
  const registerForEvent = useAppStore((state) => state.registerForEvent)
  const unregisterFromEvent = useAppStore((state) => state.unregisterFromEvent)
  const loadUserRegistrations = useAppStore((state) => state.loadUserRegistrations)
  const [selectedSpeaker, setSelectedSpeaker] = useState(null)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name') // 'name' or 'sessions'

  const registeredSessionObjects = useMemo(() => {
    return registeredSessions
      .map((id) => schedule.find((session) => session.id === id))
      .filter(Boolean)
  }, [registeredSessions, schedule])

  // Precompute sessions per speaker for quick lookups/render
  const sessionsBySpeaker = useMemo(() => {
    const map = {}
    schedule.forEach((session) => {
      session.speakers?.forEach((name) => {
        if (!map[name]) map[name] = []
        map[name].push(session)
      })
    })
    return map
  }, [schedule])

  const speakersWithoutSessions = useMemo(() => {
    return speakers.filter((s) => !schedule.some((session) => session.speakers?.includes(s.name)))
  }, [speakers, schedule])

  useEffect(() => {
    loadSpeakers()
    loadSchedule()
  }, [loadSpeakers, loadSchedule])

  // Auto-focus a speaker when coming from schedule via state
  useEffect(() => {
    const focusName = location.state?.focusSpeaker
    if (!focusName) return
    const match = speakers.find((s) => s.name?.toLowerCase() === focusName.toLowerCase())
    if (match) {
      setSelectedSpeaker(match)
    }
  }, [location.state, speakers])

  useEffect(() => {
    if (user?.uid) {
      loadUserRegistrations(user.uid)
    }
  }, [user, loadUserRegistrations])

  const handleToggleRegistration = useCallback(async (sessionId) => {
    if (!user) {
      setError('Please sign in to add sessions to your schedule.')
      return
    }

    const targetSession = schedule.find((session) => session.id === sessionId)
    if (!targetSession) {
      setError('Session not found. Please refresh and try again.')
      return
    }

    try {
      if (registeredSessions.includes(sessionId)) {
        await unregisterFromEvent(user.uid, sessionId)
      } else {
        const conflicts = findConflictingSessions(targetSession, registeredSessionObjects)
        if (conflicts.length > 0) {
          const conflictTitles = conflicts.map((session) => `${session.title} (${session.startTime}-${session.endTime || '??'})`).join('\n')
          const shouldReplace = window.confirm(
            `This session overlaps with your existing schedule:\n\n${conflictTitles}\n\nDo you want to remove the overlapping sessions and add this one?`
          )

          if (!shouldReplace) {
            setError('Session not added because of a time conflict.')
            return
          }

          for (const conflict of conflicts) {
            await unregisterFromEvent(user.uid, conflict.id)
          }
        }

        await registerForEvent(user.uid, sessionId)
      }
      setError('')
    } catch (err) {
      setError(err?.message || 'Could not update schedule. Please try again.')
    }
  }, [user, schedule, registeredSessions, registeredSessionObjects, unregisterFromEvent, registerForEvent])

  // Filter and sort speakers
  const filteredAndSortedSpeakers = useMemo(() => {
    let result = [...speakers]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(speaker => 
        speaker.name.toLowerCase().includes(query) ||
        speaker.title?.toLowerCase().includes(query) ||
        speaker.track?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy === 'sessions') {
      result.sort((a, b) => {
        const aCount = sessionsBySpeaker[a.name]?.length || 0
        const bCount = sessionsBySpeaker[b.name]?.length || 0
        return bCount - aCount // Descending order
      })
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [speakers, searchQuery, sortBy, sessionsBySpeaker])

  if (loading) return <Loading message="Loading speakers..." />

  return (
    <>
      <div className="w-full px-0 py-0 bg-[var(--brand-bg)]">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-3xl font-black mb-1 text-[var(--brand-text)]">Speakers</h1>
          <p className="text-[var(--brand-muted)] text-sm">Meet the voices behind the sessions</p>
        </div>

        {/* Search and Sort Controls */}
        <div className="px-4 pb-4 flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search speakers by name, title, or track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          >
            <option value="name">Sort by Name</option>
            <option value="sessions">Sort by Sessions</option>
          </select>
        </div>

        {!user && (
          <div className="px-4 pb-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] text-sm text-[var(--brand-muted)]">
            Sign in to add sessions to your schedule.
          </div>
        )}

        {speakersWithoutSessions.length > 0 && (
          <div className="px-4 pb-4 text-xs text-[var(--brand-muted)]">
            {speakersWithoutSessions.length} speaker{speakersWithoutSessions.length !== 1 ? 's' : ''} do not yet have linked sessions. We can link them once their sessions are available.
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/15 text-sm text-[var(--brand-text)]">
            {error}
          </div>
        )}
      
      {filteredAndSortedSpeakers.length === 0 ? (
        <Card>
          <p className="text-center text-[var(--brand-muted)]">
            {searchQuery ? 'No speakers match your search' : 'No speakers found'}
          </p>
        </Card>
      ) : (
        <div className="px-4 pb-8 space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
          {filteredAndSortedSpeakers.map((speaker) => {
            const speakerSessions = sessionsBySpeaker[speaker.name] || []
            const sessionCount = speakerSessions.length
            const primarySession = speakerSessions[0]

            return (
            <div
              key={speaker.id}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-auto bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/40 text-white"
              onClick={() => setSelectedSpeaker(speaker)}
            >
              {/* Gradient Top Section - LARGER (60% height on mobile) */}
              <div className={`h-48 md:h-40 flex items-center justify-center bg-gradient-to-br ${getTrackGradient(speaker.track)} p-6`}>
                {speaker.image ? (
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-32 h-32 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div
                    className="w-32 h-32 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-black text-4xl md:text-3xl border-4 border-white shadow-xl"
                    style={{ backgroundColor: generateAvatarColor(speaker.name) }}
                  >
                    {getInitials(speaker.name)}
                  </div>
                )}
              </div>

              {/* Slate Content Area */}
              <div className="p-5 md:p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white min-h-48 md:min-h-auto flex flex-col justify-between">
                {/* Track Badge */}
                {speaker.track && (
                  <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-white/90 w-fit">
                    {speaker.track}
                  </span>
                )}

                {/* Speaker Name */}
                <h3 className="text-2xl md:text-xl font-black mb-2 leading-tight text-white">
                  {speaker.name}
                </h3>

                {/* Title/Role */}
                {speaker.title && (
                  <p className="text-sm md:text-xs text-white/70 mb-4 line-clamp-2">
                    {speaker.title}
                  </p>
                )}

                {speaker.bio && (
                  <p className="text-xs md:text-[11px] text-white/70 mb-3 leading-snug line-clamp-3">
                    {speaker.bio}
                  </p>
                )}

                {/* Primary session quick view */}
                {primarySession && (
                  <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/85">
                    <p className="font-semibold text-sm text-white line-clamp-2">{primarySession.title}</p>
                    <p className="mt-1 text-white/70">
                      {primarySession.date ? `${formatDate(primarySession.date)} · ` : ''}
                      {primarySession.startTime}{primarySession.endTime ? ` – ${primarySession.endTime}` : ''}
                    </p>
                  </div>
                )}

                {/* Session Count Badge */}
                {sessionCount > 0 && (
                  <div className="flex items-center gap-2 text-sm font-bold text-white mt-auto">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-xs text-white/90">
                      {sessionCount}
                    </span>
                    <span>Session{sessionCount !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
            )
          })}
        </div>
      )}
      </div>

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-text)] rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-[var(--brand-muted)] hover:text-[var(--brand-text)]"
              onClick={() => setSelectedSpeaker(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-4">
              {selectedSpeaker.image ? (
                <img
                  src={selectedSpeaker.image}
                  alt={selectedSpeaker.name}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: generateAvatarColor(selectedSpeaker.name) }}
                >
                  {getInitials(selectedSpeaker.name)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-[var(--brand-text)]">{selectedSpeaker.name}</h2>
                {selectedSpeaker.title && (
                  <p className="text-sm text-[var(--brand-muted)] mt-1">{selectedSpeaker.title}</p>
                )}
                {selectedSpeaker.track && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-text)] border border-[var(--brand-primary)]/40 text-xs font-semibold">
                    {selectedSpeaker.track}
                  </span>
                )}
              </div>
            </div>

            {selectedSpeaker.bio ? (
              <p className="text-sm text-[var(--brand-text)] leading-relaxed mb-4 whitespace-pre-line">
                {selectedSpeaker.bio}
              </p>
            ) : (
              <p className="text-sm text-[var(--brand-muted)] leading-relaxed mb-4 whitespace-pre-line">
                {(speakerExternalInfo[selectedSpeaker.id]?.summary || speakerExternalInfo.default.summary)}
              </p>
            )}

            {selectedSpeaker.sessionTitle && (
              <div className="mb-4 p-3 rounded-lg bg-[var(--brand-surface-2)] border border-[var(--brand-border)] text-sm text-[var(--brand-text)]">
                <span className="font-semibold">Session: </span>{selectedSpeaker.sessionTitle}
              </div>
            )}

            {selectedSpeaker.linkedin && (
              <div className="mb-4 text-sm">
                <a
                  className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:underline"
                  href={selectedSpeaker.linkedin.startsWith('http') ? selectedSpeaker.linkedin : `https://${selectedSpeaker.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
                  View LinkedIn profile
                </a>
              </div>
            )}

            <div className="space-y-3">
              {selectedSpeaker && (
                <div className="text-sm">
                  <a
                    className="text-[var(--brand-primary)] hover:underline"
                    href={(speakerExternalInfo[selectedSpeaker.id]?.url || speakerExternalInfo.default.url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more
                  </a>
                </div>
              )}

              <p className="text-xs font-semibold text-[var(--brand-text)] mb-2">Sessions featuring this speaker</p>
              {schedule.filter((session) => session.speakers?.includes(selectedSpeaker.name)).length === 0 ? (
                <p className="text-sm text-[var(--brand-muted)]">No linked sessions yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-auto pr-1">
                  {schedule
                    .filter((session) => session.speakers?.includes(selectedSpeaker.name))
                      .map((session) => {
                        const isRegistered = registeredSessions.includes(session.id)
                        const conflictingSessions = findConflictingSessions(session, registeredSessionObjects)
                        const hasConflict = conflictingSessions.length > 0 && !isRegistered
                        const endTime = getSessionEndTime(session)
                        const dateLabel = session.date ? formatDate(session.date) : null
                        return (
                          <div
                            key={session.id}
                            className={`p-3 rounded-lg flex items-start justify-between gap-3 border ${
                              hasConflict
                                ? 'bg-red-50/10 border-red-400 text-red-100'
                                : 'bg-[var(--brand-surface-2)] border-[var(--brand-border)]'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--brand-text)]">{session.title}</p>
                              <p className="text-xs text-[var(--brand-muted)]">{session.track || session.category || 'Session'}</p>
                              {session.startTime && (
                                <p className="text-xs text-[var(--brand-muted)] mt-1">
                                  {dateLabel ? `${dateLabel} · ` : ''}
                                  {endTime ? `${session.startTime} – ${endTime}` : session.startTime}
                                </p>
                              )}
                              {hasConflict && (
                                <p className="text-xs font-semibold text-red-200 mt-1">
                                  Conflicts with {conflictingSessions.map((s) => s.title).join(', ')}
                                </p>
                              )}
                            </div>
                            <button
                              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full border transition ${
                                isRegistered
                                  ? 'border-[var(--brand-primary)] text-[var(--brand-text)] bg-[var(--brand-primary)]/20'
                                  : hasConflict
                                    ? 'border-red-400 text-red-200 hover:text-red-100'
                                    : 'border-[var(--brand-border)] text-[var(--brand-muted)] hover:text-[var(--brand-text)]'
                              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!user}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleRegistration(session.id)
                              }}
                            >
                              {isRegistered ? <CheckCircle size={16} /> : <Circle size={16} />}
                              {isRegistered ? 'Added' : 'Add'}
                            </button>
                          </div>
                        )
                      })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
