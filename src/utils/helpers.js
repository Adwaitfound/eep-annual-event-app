import { format, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy')
  } catch {
    return ''
  }
}

export const formatTime = (time) => {
  if (!time) return ''
  try {
    const timeObj = typeof time === 'string' ? parseISO(time) : time
    return format(timeObj, 'HH:mm')
  } catch {
    return ''
  }
}

export const truncateString = (str, length = 100) => {
  return str?.length > length ? str.substring(0, length) + '...' : str
}

export const getInitials = (name) => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const generateAvatarColor = (seed) => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]
  const index = seed ? seed.charCodeAt(0) % colors.length : 0
  return colors[index]
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

const timeStringToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

const minutesToTimeString = (minutes) => {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return null
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  const paddedHrs = String(hrs).padStart(2, '0')
  const paddedMins = String(mins).padStart(2, '0')
  return `${paddedHrs}:${paddedMins}`
}

const getSessionWindow = (session) => {
  if (!session?.startTime || !session?.date) return null
  const start = timeStringToMinutes(session.startTime)
  const end = session.endTime
    ? timeStringToMinutes(session.endTime)
    : session.duration
      ? start + session.duration
      : null

  if (start === null || end === null) return null
  return { date: session.date, start, end }
}

export const getSessionEndTime = (session) => {
  const window = getSessionWindow(session)
  if (!window) return null
  return minutesToTimeString(window.end)
}

export const sessionsOverlap = (sessionA, sessionB) => {
  const windowA = getSessionWindow(sessionA)
  const windowB = getSessionWindow(sessionB)

  if (!windowA || !windowB) return false
  if (windowA.date !== windowB.date) return false

  return windowA.start < windowB.end && windowA.end > windowB.start
}

export const findConflictingSessions = (targetSession, otherSessions = []) => {
  if (!targetSession) return []
  return otherSessions.filter((session) => session.id !== targetSession.id && sessionsOverlap(targetSession, session))
}
