import { format, parseISO, isAfter, isBefore, addMinutes } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Format a date string or Date object
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string (from DATE_FORMATS)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = DATE_FORMATS.FULL_DATE) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Check if a session is currently happening
 * @param {Date|string} startTime - Session start time
 * @param {Date|string} endTime - Session end time
 * @returns {boolean} True if session is happening now
 */
export const isSessionActive = (startTime, endTime) => {
  const now = new Date();
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
  return isAfter(now, start) && isBefore(now, end);
};

/**
 * Check if two sessions overlap
 * @param {Object} session1 - First session
 * @param {Object} session2 - Second session
 * @returns {boolean} True if sessions overlap
 */
export const doSessionsOverlap = (session1, session2) => {
  const start1 = typeof session1.startTime === 'string' 
    ? parseISO(session1.startTime) 
    : session1.startTime;
  const end1 = typeof session1.endTime === 'string' 
    ? parseISO(session1.endTime) 
    : session1.endTime;
  const start2 = typeof session2.startTime === 'string' 
    ? parseISO(session2.startTime) 
    : session2.startTime;
  const end2 = typeof session2.endTime === 'string' 
    ? parseISO(session2.endTime) 
    : session2.endTime;

  return (
    (isAfter(start1, start2) && isBefore(start1, end2)) ||
    (isAfter(start2, start1) && isBefore(start2, end1))
  );
};

/**
 * Get reminder time (15 minutes before session)
 * @param {Date|string} startTime - Session start time
 * @returns {Date} Reminder time
 */
export const getReminderTime = (startTime) => {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  return addMinutes(start, -15);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone && phone.length >= 10 && phoneRegex.test(phone);
};

/**
 * Generate a random color for avatar background
 * @param {string} seed - Seed for color generation (e.g., user ID)
 * @returns {string} Hex color code
 */
export const generateAvatarColor = (seed) => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  const index = seed ? seed.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Group array items by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};
