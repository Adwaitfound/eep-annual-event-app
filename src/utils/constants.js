export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const COLLECTIONS = {
  USERS: 'users',
  SCHEDULE: 'schedule',
  SPEAKERS: 'speakers',
  EVENT: 'event'
}

export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed',
  NETWORK_ERROR: 'Network connection error',
  UNKNOWN_ERROR: 'An unknown error occurred'
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Session tracks/categories
export const SESSION_TRACKS = [
  'Keynote',
  'Workshop',
  'Panel Discussion',
  'Networking',
  'Break',
  'Social Event',
];

// User roles
export const USER_ROLES = {
  ATTENDEE: 'attendee',
  SPEAKER: 'speaker',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
};

// Connection status
export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  MEETING_REQUEST: 'meeting_request',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'session_reminder',
  ANNOUNCEMENT: 'announcement',
  CONNECTION_REQUEST: 'connection_request',
  NEW_MESSAGE: 'new_message',
  SCHEDULE_CHANGE: 'schedule_change',
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  USERS: '/users',
  SESSIONS: '/sessions',
  SPEAKERS: '/speakers',
  CONNECTIONS: '/connections',
  MESSAGES: '/messages',
  ANNOUNCEMENTS: '/announcements',
};

// Date/Time formats
export const DATE_FORMATS = {
  FULL_DATE: 'MMMM dd, yyyy',
  SHORT_DATE: 'MMM dd',
  TIME: 'h:mm a',
  DATETIME: 'MMM dd, h:mm a',
};

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
  SESSIONS: 'sessions',
  SPEAKERS: 'speakers',
  VOTES: 'votes',
  CONNECTIONS: 'connections',
  MESSAGES: 'messages',
  ANNOUNCEMENTS: 'announcements',
};
