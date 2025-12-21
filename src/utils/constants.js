// App constants
export const COLORS = {
  primary: '#1E3A8A', // Deep blue - from foundationeep.org theme
  secondary: '#3B82F6', // Bright blue
  accent: '#10B981', // Green
  background: '#F9FAFB',
  surface: '#FFFFFF',
  error: '#EF4444',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const DARK_COLORS = {
  primary: '#3B82F6',
  secondary: '#60A5FA',
  accent: '#34D399',
  background: '#111827',
  surface: '#1F2937',
  error: '#F87171',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
};

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
