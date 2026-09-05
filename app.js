/**
 * ============================================================================
 * HundApp - The Modern Swedish Dog Care & Lifestyle Platform
 * ============================================================================
 * @version 2.5.0
 * @author HundApp Core Team
 * @license MIT
 * 
 * TABLE OF CONTENTS:
 * ----------------------------------------------------------------------------
 * 01. Storage & Utility Engine (SafeStorage, Helpers, Toasts, Confetti)
 * 02. i18n Translation Engine & Swedish/English Dictionaries
 * 03. Global Navigation, Modals & Dropdowns Management
 * 04. Dog Profile State & Multi-Dog Management
 * 05. Home Page Engine (index.html - Stats Strip, Reviews, Age Calc)
 * 06. Tips Library Engine (tips.html - 25 Vetted Tips, Search, Progress)
 * 07. Walks & Live Tracker Engine (walks.html - Stopwatch, Goals, Streaks)
 * 08. Dog Health & Statistics Engine (statistics.html - SVG Charts, BCS)
 * 09. Dog Health Journal & Allergen Engine (portal.html - Routines, Foods)
 * 10. Dog Profiles & Vaccinations Engine (dogs.html - CRUD, Passports)
 * 11. Interactive Calendar & Routine Planner (calendar.html - Month Grid)
 * 12. Community Suggestions & Voting Engine (suggestions.html - Kanban)
 * 13. Authentication & Security Engine (login.html, register.html, OAuth)
 * 14. Global Bootstrapper, Event Bus & Error Boundary
 * ============================================================================
 */

'use strict';

/* ============================================================================
   SECTION 01: STORAGE & UTILITY ENGINE
   ============================================================================ */

/**
 * Storage keys used across HundApp modules
 */
const STORAGE_KEYS = {
  LANGUAGE: 'hundapp-language',
  THEME: 'hundapp-theme',
  USER_NAME: 'hundapp-user-name',
  AUTH_USER: 'hundapp-auth-user',
  REGISTERED_USERS: 'hundapp-registered-users',
  GOOGLE_CLIENT_ID: 'hundapp-google-client-id',
  REMEMBERED_EMAIL: 'hundapp-remembered-email',
  ACTIVE_DOG_ID: 'hundapp-active-dog-id',
  DOGS_LIST: 'hundapp-dogs-list',
  SAVED_TIPS: 'hundapp-saved-tips',
  CHECKED_TIPS: 'hundapp-checked-tips',
  WALK_LOGS: 'hundapp-walk-logs',
  ACTIVITY_LOGS: 'hundapp-activity-logs',
  WEIGHT_LOGS: 'hundapp-weight-logs',
  CALENDAR_EVENTS: 'hundapp-calendar-events',
  COMPLETED_ROUTINES: 'hundapp-completed-routines',
  REVIEWS: 'hundapp_user_reviews',
  COMMUNITY_POLL: 'hundapp-poll-votes',
  COMMUNITY_SUGGESTIONS: 'hundapp-community-suggestions',
  USER_VOTED_SUGGESTIONS: 'hundapp-user-voted-suggestions'
};

/**
 * Fallback in-memory storage if localStorage is restricted/unavailable
 */
const _memoryStorage = new Map();

/**
 * Safe localStorage wrapper with memory fallback, serialization safety, and change event dispatch
 */
const safeStorage = {
  get(key, defaultValue = null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item === null || item === undefined) return defaultValue;
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      }
    } catch (e) {
      console.warn(`[safeStorage] Read failed for "${key}", using fallback.`, e);
    }
    return _memoryStorage.has(key) ? _memoryStorage.get(key) : defaultValue;
  },

  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      }
      _memoryStorage.set(key, value);
      this.dispatchChange(key, value);
      return true;
    } catch (e) {
      console.warn(`[safeStorage] Write failed for "${key}", saving in memory.`, e);
      _memoryStorage.set(key, value);
      this.dispatchChange(key, value);
      return false;
    }
  },

  remove(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      _memoryStorage.delete(key);
      this.dispatchChange(key, null);
      return true;
    } catch (e) {
      _memoryStorage.delete(key);
      return false;
    }
  },

  clear() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      _memoryStorage.clear();
      return true;
    } catch (e) {
      _memoryStorage.clear();
      return false;
    }
  },

  dispatchChange(key, value) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(new CustomEvent('hundapp_storage_change', { detail: { key, value } }));
      } catch {}
    }
  }
};

/**
 * Debounce helper to limit high-frequency calls
 */
function debounce(fn, delay = 200) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * HTML Escaping for XSS prevention
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize text input removing trailing/leading control chars
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[
