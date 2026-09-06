
/**
 * Mobile Navigation Toggle Handler
 */
function initMobileNavigation() {
  const menuBtn = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav') || document.querySelector('.main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-open') && !mainNav.contains(e.target) && !menuBtn.contains(e.target)) {
        mainNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}


/**
 * Interactive Dog Age & Human Years Calculator
 * Scientifically converts canine age to human equivalent (AVMA formula)
 */
window.calculateDogAgeOnHome = function() {
  const birthInput = document.getElementById('calc-birthdate');
  const resultBox = document.getElementById('calc-result-box');
  if (!birthInput || !resultBox) return;

  const isEn = (currentLang === 'en');
  const birthDateVal = birthInput.value;
  if (!birthDateVal) {
    if (typeof showToast === 'function') {
      showToast(isEn ? 'Please choose a birth date first!' : 'Vänligen välj ett födelsedatum först!', '⚠️');
    }
    return;
  }

  const birth = new Date(birthDateVal);
  const now = new Date();
  if (isNaN(birth.getTime()) || birth > now) {
    if (typeof showToast === 'function') {
      showToast(isEn ? 'Please select a date not in the future!' : 'Välj ett datum som inte ligger i framtiden!', '⚠️');
    }
    return;
  }

  // Calculate exact years and months
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDecimalYears = years + (months / 12);

  // AVMA / Vet standard conversion
  let humanYears = 0;
  if (totalDecimalYears <= 1) {
    humanYears = Math.round(totalDecimalYears * 15);
  } else if (totalDecimalYears <= 2) {
    humanYears = Math.round(15 + (totalDecimalYears - 1) * 9);
  } else {
    humanYears = Math.round(24 + (totalDecimalYears - 2) * 4.8);
  }

  // Life phase
  let phaseName = isEn ? 'Adult Dog' : 'Vuxen hund';
  let phaseEmoji = '🐕';
  let phaseDesc = isEn ? 'In prime life with full energy, balanced confidence, and stable temperament.' : 'I sin bästa ålder med full energi och stabil personlighet.';

  if (totalDecimalYears < 0.6) {
    phaseName = isEn ? 'Puppy' : 'Valp';
    phaseEmoji = '🐾';
    phaseDesc = isEn ? 'Critical phase for socialization, trust building, and house training.' : 'Viktigaste perioden för socialisering, trygghet och rumsrenhet.';
  } else if (totalDecimalYears < 1.5) {
    phaseName = isEn ? 'Adolescent / Teenage Dog' : 'Unghund / Slyngelålder';
    phaseEmoji = '⚡';
    phaseDesc = isEn ? 'Hormones and curiosity thrive – prioritize patience, focus, and connection exercises.' : 'Hormoner och upptäckarglädje sprudlar – fokusera på tålamod och kontaktövningar.';
  } else if (totalDecimalYears >= 8) {
    phaseName = isEn ? 'Senior & Wise' : 'Senior & Klok';
    phaseEmoji = '👑';
    phaseDesc = isEn ? 'Time for cozy orthopedic bedding, joint supplements, and regular vet health checks.' : 'Dags för mjuka underlag, ledtillskott och regelbundna seniorkontroller hos veterinären.';
  }

  let ageText = '';
  if (isEn) {
    if (years === 0) {
      ageText = `${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (months === 0) {
      ageText = `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      ageText = `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  } else {
    if (years === 0) {
      ageText = `${months} ${months === 1 ? 'månad' : 'månader'}`;
    } else if (months === 0) {
      ageText = `${years} ${years === 1 ? 'år' : 'år'}`;
    } else {
      ageText = `${years} år och ${months} månader`;
    }
  }

  const prefix = isEn ? 'Equals approx' : 'Motsvarar ca';
  const suffix = isEn ? 'human years!' : 'människoår!';
  const dogIs = isEn ? 'Your dog is' : 'Din hund är';
  const oldText = isEn ? 'old' : 'gammal';
  const phaseLabel = isEn ? 'Life phase:' : 'Livsfas:';
  const portalBtnText = isEn ? 'Open health dashboard for your dog →' : 'Öppna hälsodashboard för din hund →';

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div class="calc-result-card" style="background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); color:#FAF7F2; border-radius:18px; padding:22px; text-align:center; box-shadow:0 12px 30px rgba(27,67,50,0.25); animation:slideInUp 0.3s cubic-bezier(0.16,1,0.3,1); margin-top:20px;">
      <div style="font-size:36px; margin-bottom:6px;">${phaseEmoji}</div>
      <h3 style="font-family:'Fraunces',serif; font-size:24px; margin:0 0 4px; color:#F4D35E;">
        ${prefix} ${humanYears} ${suffix}
      </h3>
      <p style="font-size:15px; margin:0 0 14px; color:#d8f3dc;">
        ${dogIs} <strong>${ageText}</strong> ${oldText} (${phaseName}).
      </p>
      
      <div style="background:rgba(255,255,255,0.12); border-radius:12px; padding:12px 16px; font-size:13px; line-height:1.5; color:#ffffff; max-width:480px; margin:0 auto;">
        💡 <strong>${phaseLabel}</strong> ${phaseDesc}
      </div>

      <div style="margin-top:16px;">
        <a href="portal.html" class="btn btn-secondary btn-sm" style="font-weight:700;">
          ${portalBtnText}
        </a>
      </div>
    </div>
  `;

  if (typeof celebrateConfetti === 'function') {
    celebrateConfetti();
  }
};

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
  return str.trim().replace(/[-]/g, '');
}

/**
 * Unique ID generator
 */
function generateId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Toast Notification System with stack management & accessibility
 */
let toastTimeoutId = null;
function showToast(message, icon = '✓', duration = 3200, action = null) {
  if (typeof document === 'undefined' || !document.body || typeof document.body.appendChild !== 'function') return;

  let toastEl = document.getElementById('toast-msg');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast-msg';
    toastEl.className = 'toast-msg';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }

  const iconEl = toastEl.querySelector('#toast-icon') || toastEl;
  const textEl = toastEl.querySelector('#toast-text') || toastEl;

  if (toastEl.querySelector('#toast-icon')) {
    iconEl.textContent = icon;
    textEl.textContent = message;
  } else {
    toastEl.innerHTML = `
      <span id="toast-icon">${icon}</span>
      <span id="toast-text">${escapeHtml(message)}</span>
      ${action ? `<button type="button" class="toast-action-btn" id="toastActionBtn">${escapeHtml(action.label)}</button>` : ''}
    `;
    if (action && typeof action.onClick === 'function') {
      const actBtn = toastEl.querySelector('#toastActionBtn');
      if (actBtn) actBtn.onclick = action.onClick;
    }
  }

  toastEl.classList.remove('hidden');
  toastEl.classList.add('show');

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

/**
 * Copy text to clipboard with automatic toast feedback
 */
async function copyToClipboard(text, successMsg = 'Kopierat till urklipp!') {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast(successMsg, '📋');
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API failed, trying fallback', err);
  }

  // Fallback for older browsers / iframe sandbox
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    tempInput.style.top = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    const success = document.execCommand('copy');
    document.body.removeChild(tempInput);
    if (success) {
      showToast(successMsg, '📋');
      return true;
    }
  } catch {}

  showToast('Kunde inte kopiera automatiskt.', '⚠️');
  return false;
}

/**
 * Format ISO datetime string to Swedish / English readable string
 */
function formatHumanDate(dateInput, lang = 'sv') {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const monthsSv = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = (lang === 'en') ? monthsEn : monthsSv;

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Relative time formatter (e.g. "Idag kl 14:00", "Igår", "25 aug")
 */
function formatRelativeTime(dateInput, lang = 'sv') {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (lang === 'en') {
    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;
    return `${formatHumanDate(d, 'en')} at ${timeStr}`;
  }

  if (isToday) return `Idag kl ${timeStr}`;
  if (isYesterday) return `Igår kl ${timeStr}`;
  return `${formatHumanDate(d, 'sv')} kl ${timeStr}`;
}

/**
 * Format duration in minutes to human readable string
 */
function formatDuration(minutes, lang = 'sv') {
  const m = parseInt(minutes, 10) || 0;
  const hours = Math.floor(m / 60);
  const remMins = m % 60;

  if (lang === 'en') {
    if (hours > 0 && remMins > 0) return `${hours} h ${remMins} min`;
    if (hours > 0) return `${hours} h`;
    return `${remMins} min`;
  }

  if (hours > 0 && remMins > 0) return `${hours} h ${remMins} min`;
  if (hours > 0) return `${hours} h`;
  return `${remMins} min`;
}

/**
 * Format pace (minutes / km)
 */
function formatPace(minutes, km) {
  const mins = parseFloat(minutes) || 0;
  const dist = parseFloat(km) || 0;
  if (mins <= 0 || dist <= 0) return '—';
  const paceTotalMin = mins / dist;
  const paceMin = Math.floor(paceTotalMin);
  const paceSec = Math.round((paceTotalMin - paceMin) * 60);
  return `${paceMin}:${paceSec.toString().padStart(2, '0')} min/km`;
}

/**
 * Calculate age in human readable string
 */
function calculateAge(birthDateStr, lang = 'sv') {
  if (!birthDateStr) return '';
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return '';

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  if (lang === 'en') {
    if (years <= 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
    if (months === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years} ${years === 1 ? 'yr' : 'yrs'}, ${months} mo`;
  }

  if (years <= 0) return `${months} ${months === 1 ? 'månad' : 'månader'}`;
  if (months === 0) return `${years} ${years === 1 ? 'år' : 'år'}`;
  return `${years} år, ${months} mån`;
}

/**
 * Lightweight celebratory particle confetti
 */
function celebrateConfetti() {
  if (typeof document === 'undefined' || !document.body || typeof document.body.appendChild !== 'function') return;
  const colors = ['#2d6a4f', '#52b788', '#d8f3dc', '#e76f51', '#f4a261', '#ffd166'];
  const confettiCount = 35;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '99999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  for (let i = 0; i < confettiCount; i++) {
    const bit = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    const left = Math.random() * 100;
    const animDuration = Math.random() * 1.5 + 1.2;
    const animDelay = Math.random() * 0.3;

    bit.style.position = 'absolute';
    bit.style.top = '-20px';
    bit.style.left = `${left}vw`;
    bit.style.width = `${size}px`;
    bit.style.height = `${size * 0.6}px`;
    bit.style.backgroundColor = color;
    bit.style.borderRadius = '2px';
    bit.style.opacity = '1';
    bit.style.transform = `rotate(${Math.random() * 360}deg)`;
    bit.style.transition = `transform ${animDuration}s cubic-bezier(0.25, 1, 0.5, 1), top ${animDuration}s ease-in, opacity ${animDuration}s ease-in`;
    bit.style.transitionDelay = `${animDelay}s`;
    container.appendChild(bit);

    setTimeout(() => {
      bit.style.top = `${Math.random() * 40 + 70}vh`;
      bit.style.transform = `rotate(${Math.random() * 720}deg) scale(${Math.random() * 0.5 + 0.5})`;
      bit.style.opacity = '0';
    }, 20);
  }

  setTimeout(() => {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 3000);
}

/* ============================================================================
   /* ==========================================================================
   SECTION 02: i18n TRANSLATION DICTIONARY & MULTILINGUAL ENGINE
   100% Comprehensive Swedish & English Dictionary with Real-time DOM Swapping
   ========================================================================== */

let currentLang = safeStorage.get(STORAGE_KEYS.LANGUAGE, 'sv');
if (currentLang !== 'sv' && currentLang !== 'en') {
  currentLang = 'sv';
}

const I18N_DICTIONARY = {
  sv: {
    // Navigation & Header
    nav_how_it_works: 'Så fungerar det',
    nav_features: 'Funktioner',
    nav_tips: 'Hundtips',
    nav_suggestions: 'Förslag & Roadmap',
    nav_reviews: 'Omdömen',
    nav_faq: 'Vanliga frågor',
    nav_login: 'Logga in',
    nav_register: 'Skapa konto',
    nav_get_started: 'Kom igång gratis',
    nav_overview: 'Översikt',
    nav_dogs: 'Mina hundar',
    nav_walks: 'Promenader',
    nav_calendar: 'Kalender',
    nav_stats: 'Statistik',
    nav_merch: 'Supporter-shop',
    nav_logout: 'Logga ut',

    // Hero Section
    hero_eyebrow: '✦ För en tryggare hundvardag',
    hero_title: 'Allt din hund behöver.<br><em>Samlat på ett ställe.</em>',
    hero_desc: 'Sveriges modernaste plattform för hundhälsa, promenader och rutiner. 100% offline, gratis och skapad med kärlek till hundar.',
    cta_register: 'Skapa gratiskonto ➔',
    cta_explore: 'Utforska funktioner ↓',

    // Stats Strip
    stat_rating_label: 'Betyg från hundägare',
    stat_rating_empty: '— / 5',
    stat_tips_label: 'Kvalitetssäkrade tips',
    stat_focus_label: 'Fokus på hundglädje',
    stat_free_label: 'Gratis grundversion',

    // Age Calculator
    calc_eyebrow: 'Interaktiv kalkylator',
    calc_title: 'Hur gammal är din hund i människoår?',
    calc_desc: 'Ange din hunds födelsedatum för att beräkna exakt ålder och motsvarande människoår.',
    calc_birth_label: 'Födelsedatum',
    calc_btn: 'Beräkna ålder 🐾',
    calc_btn_portal: 'Öppna hälsodashboard för din hund →',
    calc_life_stage_title: 'Livsfas:',
    calc_human_years_prefix: 'Motsvarar ca',
    calc_human_years_suffix: 'människoår!',
    calc_dog_age_is: 'Din hund är',
    calc_old: 'gammal',
    calc_phase_puppy: 'Valp',
    calc_phase_puppy_desc: 'Viktigaste perioden för socialisering, trygghet och rumsrenhet.',
    calc_phase_young: 'Unghund / Slyngelålder',
    calc_phase_young_desc: 'Hormoner och upptäckarglädje sprudlar – fokusera på tålamod och kontaktövningar.',
    calc_phase_adult: 'Vuxen hund',
    calc_phase_adult_desc: 'I sin bästa ålder med full energi och stabil personlighet.',
    calc_phase_senior: 'Senior & Klok',
    calc_phase_senior_desc: 'Dags för mjuka underlag, ledtillskott och regelbundna seniorkontroller hos veterinären.',

    // Features Section
    features_eyebrow: 'Varför välja HundApp?',
    features_title: 'Skapad för dig som sätter hunden i första rummet',
    features_desc: 'Från skogspromenader utan täckning till veterinärhistorik och kloklippspåminnelser – allt fungerar direkt i din webbläsare.',

    // Auth Views (login & register)
    login_heading: 'Logga in till HundApp',
    login_eyebrow: 'Välkommen tillbaka',
    login_intro: 'Få direkt tillgång till din hunds profil, hälsojournal, påminnelser och promenadlogg.',
    register_heading: 'Skapa ditt gratiskonto',
    register_eyebrow: 'Börja med ett tassavtryck',
    register_intro: 'Kom igång på under 1 minut. Du lägger enkelt till din hund på nästa sida.',
    social_google_btn: 'Fortsätt med Google',
    auth_divider_login: 'eller logga in med e-post & lösenord',
    auth_divider_register: 'eller skapa konto med e-post & användarnamn',
    label_email_or_user: 'E-postadress eller Användarnamn',
    label_username: 'Användarnamn / Namn',
    label_email: 'E-postadress',
    label_password: 'Lösenord',
    label_password_choose: 'Välj ett säkert lösenord',
    label_password_confirm: 'Bekräfta lösenord',
    remember_me: 'Kom ihåg mig på den här enheten',
    forgot_password: 'Glömt lösenord?',
    btn_submit_login: 'Logga in',
    btn_submit_register: 'Skapa gratiskonto',
    new_here: 'Ny här?',
    already_account: 'Har du redan konto?',
    create_account_free: 'Skapa konto gratis',
    back_to_home: '← Tillbaka till startsidan',

    // Common Toasts & Feedback
    toast_saved: 'Sparat!',
    toast_deleted: 'Borttaget.',
    toast_vote_added: 'Tack för din röst!',
    toast_vote_removed: 'Röst borttagen.',
    toast_copied: 'Kopierat till urklipp!',
    toast_lang_switched: 'Språk ändrat till Svenska 🇸🇪',
    mobile_hero_cta_btn: '📱 Öppna i mobilen – Kom igång gratis 🐾',
    mobile_sticky_btn: 'Kom igång i mobilen',
    walk_started: 'Promenad startad! Njut av turen. 🐾',
    walk_paused: 'Promenaden är pausad.',
    walk_resumed: 'Promenaden fortsätter! 🐾',
    walk_stopped: 'Promenad avslutad och sparad! 🐾'
  },
  en: {
    // Navigation & Header
    nav_how_it_works: 'How it works',
    nav_features: 'Features',
    nav_tips: 'Dog Tips',
    nav_suggestions: 'Ideas & Roadmap',
    nav_reviews: 'Reviews',
    nav_faq: 'FAQ',
    nav_login: 'Log in',
    nav_register: 'Sign up',
    nav_get_started: 'Get started free',
    nav_overview: 'Overview',
    nav_dogs: 'My Dogs',
    nav_walks: 'Walks',
    nav_calendar: 'Calendar',
    nav_stats: 'Statistics',
    nav_merch: 'Supporter Shop',
    nav_logout: 'Log out',

    // Hero Section
    hero_eyebrow: '✦ For a safer daily dog life',
    hero_title: 'Everything your dog needs.<br><em>All in one place.</em>',
    hero_desc: "Sweden's most modern platform for dog health, walks, and routines. 100% offline, free, and crafted with love for dogs.",
    cta_register: 'Create free account ➔',
    cta_explore: 'Explore features ↓',

    // Stats Strip
    stat_rating_label: 'Rating from dog owners',
    stat_rating_empty: '— / 5',
    stat_tips_label: 'Quality assured tips',
    stat_focus_label: 'Focus on dog happiness',
    stat_free_label: 'Free base version',

    // Age Calculator
    calc_eyebrow: 'Interactive Calculator',
    calc_title: 'How old is your dog in human years?',
    calc_desc: "Enter your dog's birth date to calculate exact age and equivalent human years.",
    calc_birth_label: 'Birth date',
    calc_btn: 'Calculate age 🐾',
    calc_btn_portal: 'Open health dashboard for your dog →',
    calc_life_stage_title: 'Life phase:',
    calc_human_years_prefix: 'Equals approx',
    calc_human_years_suffix: 'human years!',
    calc_dog_age_is: 'Your dog is',
    calc_old: 'old',
    calc_phase_puppy: 'Puppy',
    calc_phase_puppy_desc: 'Critical phase for socialization, trust building, and house training.',
    calc_phase_young: 'Adolescent / Teenage Dog',
    calc_phase_young_desc: 'Hormones and curiosity thrive – prioritize patience, focus, and connection exercises.',
    calc_phase_adult: 'Adult Dog',
    calc_phase_adult_desc: 'In prime life with full energy, balanced confidence, and stable temperament.',
    calc_phase_senior: 'Senior & Wise',
    calc_phase_senior_desc: 'Time for cozy orthopedic bedding, joint supplements, and regular vet health checks.',

    // Features Section
    features_eyebrow: 'Why choose HundApp?',
    features_title: 'Crafted for owners who put their dog first',
    features_desc: 'From forest walks without reception to vaccination tracking and claw trimming alerts – all running right in your browser.',

    // Auth Views (login & register)
    login_heading: 'Log in to HundApp',
    login_eyebrow: 'Welcome back',
    login_intro: 'Get instant access to your dog profile, health journal, reminders, and activity log.',
    register_heading: 'Create your free account',
    register_eyebrow: 'Start with a paw print',
    register_intro: 'Get started in under 1 minute. Easily add your dog profile on the next page.',
    social_google_btn: 'Continue with Google',
    auth_divider_login: 'or log in with email & password',
    auth_divider_register: 'or create account with email & username',
    label_email_or_user: 'Email address or Username',
    label_username: 'Username / Full Name',
    label_email: 'Email address',
    label_password: 'Password',
    label_password_choose: 'Choose a secure password',
    label_password_confirm: 'Confirm password',
    remember_me: 'Remember me on this device',
    forgot_password: 'Forgot password?',
    btn_submit_login: 'Log In',
    btn_submit_register: 'Create Free Account',
    new_here: 'New here?',
    already_account: 'Already have an account?',
    create_account_free: 'Sign up free',
    back_to_home: '← Back to home page',

    // Common Toasts & Feedback
    toast_saved: 'Saved!',
    toast_deleted: 'Deleted.',
    toast_vote_added: 'Thanks for your vote!',
    toast_vote_removed: 'Vote removed.',
    toast_copied: 'Copied to clipboard!',
    toast_lang_switched: 'Language switched to English 🇬🇧',
    mobile_hero_cta_btn: '📱 Open in Mobile – Get Started Free 🐾',
    mobile_sticky_btn: 'Get started on mobile',
    walk_started: 'Walk started! Enjoy the tour. 🐾',
    walk_paused: 'Walk is paused.',
    walk_resumed: 'Walk resumed! 🐾',
    walk_stopped: 'Walk finished and saved! 🐾'
  }
};

function t(key, fallback = '') {
  const dict = I18N_DICTIONARY[currentLang] || I18N_DICTIONARY.sv;
  return dict[key] || fallback || key;
}

/**
 * Apply selected language immediately across the entire DOM
 */
window.applyLanguage = function(lang) {
  if (lang !== 'sv' && lang !== 'en') lang = 'sv';
  currentLang = lang;
  safeStorage.set(STORAGE_KEYS.LANGUAGE, lang);

  if (typeof document === 'undefined') return;

  // 1. Update html lang attribute
  document.documentElement.lang = lang;

  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.sv;

  // 2. Localize all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // 3. Localize all [data-i18n-placeholder] elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // 4. Localize all [data-i18n-aria] elements
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (key && dict[key]) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  // 5. Update language select dropdowns
  document.querySelectorAll('.lang-selector, #site-lang-select').forEach(sel => {
    sel.value = lang;
  });

  // 6. Update language toggle buttons
  document.querySelectorAll('.language-toggle, #language-toggle-btn').forEach(btn => {
    btn.textContent = (lang === 'sv') ? 'EN' : 'SV';
    btn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    btn.setAttribute('title', lang === 'sv' ? 'Switch to English' : 'Växla till svenska');
  });

  // 7. Dispatch custom event for components
  window.dispatchEvent(new CustomEvent('hundapp:languageChanged', { detail: { lang } }));
};

/**
 * Switch language function called by dropdowns or buttons
 */
window.setLanguage = function(lang, notify = false) {
  if (lang !== 'sv' && lang !== 'en') {
    lang = (currentLang === 'sv') ? 'en' : 'sv';
  }
  applyLanguage(lang);
  if (notify && typeof showToast === 'function') {
    const msg = (lang === 'sv') ? 'Språk ändrat till Svenska 🇸🇪' : 'Language switched to English 🇬🇧';
    showToast(msg, '🌐');
  }
};


SECTION 03: GLOBAL NAVIGATION & MODAL MANAGEMENT
   ============================================================================ */

function initGlobalNavigation() {
  if (typeof document === 'undefined') return;

  // Language toggle listener
  const toggles = document.querySelectorAll('.language-toggle, #language-toggle-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = (currentLang === 'sv') ? 'en' : 'sv';
      setLanguage(newLang);
      showToast(newLang === 'en' ? 'Language switched to English' : 'Språk ändrat till svenska', '🌐');
    });
  });

  // User dropdown menu
  const userBtn = document.getElementById('userMenuBtn');
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = userBtn.getAttribute('aria-expanded') === 'true';
      userBtn.setAttribute('aria-expanded', !expanded);
      renderUserDropdown(!expanded);
    });

    document.addEventListener('click', (e) => {
      if (!userBtn.contains(e.target)) {
        userBtn.setAttribute('aria-expanded', 'false');
        renderUserDropdown(false);
      }
    });
  }

  // Escape key closes modals and dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal[aria-hidden="false"], .modal.open, .modal.active').forEach(m => {
        closeModal(m);
      });
      if (userBtn) {
        userBtn.setAttribute('aria-expanded', 'false');
        renderUserDropdown(false);
      }
    }
  });
}

function renderUserDropdown(show) {
  let menu = document.getElementById('userDropdownMenu');
  if (!show) {
    if (menu) menu.classList.add('hidden');
    return;
  }

  const currentUser = safeStorage.get(STORAGE_KEYS.AUTH_USER, { name: 'Maria & Bella', email: 'maria@hundapp.se' });
  const activeDog = getActiveDog();

  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'userDropdownMenu';
    menu.className = 'user-dropdown-menu';
    if (document.body && typeof document.body.appendChild === 'function') document.body.appendChild(menu);
  }

  menu.innerHTML = `
    <div class="dropdown-header">
      <strong>${escapeHtml(currentUser.name || 'Maria')}</strong>
      <small>${escapeHtml(currentUser.email || 'maria@hundapp.se')}</small>
      <div class="dropdown-dog-badge">🐶 Aktiv hund: <b>${escapeHtml(activeDog.name)}</b></div>
    </div>
    <div class="dropdown-divider"></div>
    <a href="portal.html" class="dropdown-item">📊 Översikt &amp; Portal</a>
    <a href="dogs.html" class="dropdown-item">🐕 Mina hundar</a>
    <a href="suggestions.html" class="dropdown-item">💡 Förslag &amp; Roadmap</a>
    <div class="dropdown-divider"></div>
    <button type="button" class="dropdown-item logout-btn" onclick="window.logoutHundAppUser()">
      🚪 Logga ut
    </button>
  `;

  const btnRect = document.getElementById('userMenuBtn')?.getBoundingClientRect();
  if (btnRect) {
    menu.style.position = 'fixed';
    menu.style.top = `${btnRect.bottom + 8}px`;
    menu.style.right = `${Math.max(16, window.innerWidth - btnRect.right)}px`;
    menu.style.zIndex = '9999';
  }

  menu.classList.remove('hidden');
}

function openModal(modal) {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open', 'active');
  document.body.style.overflow = 'hidden';

  // Focus first input or button
  const focusable = modal.querySelector('input:not([type=hidden]), select, textarea, button:not(.modal-close)');
  if (focusable && typeof focusable.focus === 'function') setTimeout(() => focusable.focus(), 50);
}

function closeModal(modal) {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open', 'active');
  document.body.style.overflow = '';
}

/* ============================================================================
   SECTION 04: DOG PROFILE STATE & MULTI-DOG MANAGEMENT
   ============================================================================ */

const DEFAULT_DOGS = [
  {
    id: 'bella',
    name: 'Bella',
    breed: 'Golden Retriever',
    birthdate: '2023-04-12',
    weight: 28.5,
    gender: 'Tik',
    chipNumber: '752098100234567',
    pedigreeName: 'Golden Glow Bella',
    insurance: 'Agria Djurförsäkring',
    policyNumber: 'AG-9923841',
    avatarLetter: 'B',
    avatarEmoji: '🐕'
  },
  {
    id: 'buster',
    name: 'Buster',
    breed: 'Fransk Bulldog',
    birthdate: '2021-09-18',
    weight: 12.2,
    gender: 'Hane',
    chipNumber: '752098100987654',
    pedigreeName: 'Frenchie Champ Buster',
    insurance: 'Sveland Försäkringar',
    policyNumber: 'SV-4482910',
    avatarLetter: 'B',
    avatarEmoji: '🐶'
  },
  {
    id: 'sigge',
    name: 'Sigge',
    breed: 'Border Collie',
    birthdate: '2024-02-01',
    weight: 19.0,
    gender: 'Hane',
    chipNumber: '752098100554433',
    pedigreeName: 'Nordic Star Sigge',
    insurance: 'Folksam Hund',
    policyNumber: 'FK-1290847',
    avatarLetter: 'S',
    avatarEmoji: '🦮'
  }
];

function getDogsList() {
  const dogs = safeStorage.get(STORAGE_KEYS.DOGS_LIST);
  if (!dogs || !Array.isArray(dogs) || dogs.length === 0) {
    safeStorage.set(STORAGE_KEYS.DOGS_LIST, DEFAULT_DOGS);
    return DEFAULT_DOGS;
  }
  return dogs;
}

function saveDogsList(dogs) {
  safeStorage.set(STORAGE_KEYS.DOGS_LIST, dogs);
}

function getActiveDog() {
  const dogs = getDogsList();
  const activeId = safeStorage.get(STORAGE_KEYS.ACTIVE_DOG_ID, 'bella');
  return dogs.find(d => d.id === activeId) || dogs[0] || DEFAULT_DOGS[0];
}

function setActiveDog(dogId) {
  const dogs = getDogsList();
  const target = dogs.find(d => d.id === dogId);
  if (target) {
    safeStorage.set(STORAGE_KEYS.ACTIVE_DOG_ID, target.id);
    updateActiveDogGlobalUI();
    showToast(`Aktiv hund ändrad till ${target.name}! 🐾`, '🐶');
    
    // Re-render current page if applicable
    if (typeof window.renderWalkLogs === 'function') window.renderWalkLogs();
    if (typeof window.renderCalendar === 'function') window.renderCalendar();
    if (typeof window.renderStats === 'function') window.renderStats();
  }
}

function updateActiveDogGlobalUI() {
  if (typeof document === 'undefined') return;
  const dog = getActiveDog();
  const currentUser = safeStorage.get(STORAGE_KEYS.AUTH_USER, { name: 'Maria' });

  const avatarLetters = document.querySelectorAll('#userAvatarLetter, .user-avatar-letter');
  avatarLetters.forEach(el => el.textContent = (currentUser.name ? currentUser.name[0] : 'M').toUpperCase());

  const userNavNames = document.querySelectorAll('#userNavName, .user-nav-name');
  userNavNames.forEach(el => el.textContent = currentUser.name || 'Maria');

  // Eyebrows & dog label elements
  const walksEyebrow = document.getElementById('walksDogEyebrow');
  if (walksEyebrow) walksEyebrow.textContent = `${dog.name}s rörelse och äventyr`;

  const dogFilterBtn = document.getElementById('activeDogFilterName');
  if (dogFilterBtn) dogFilterBtn.textContent = dog.name;

  const statsEyebrow = document.getElementById('stats-dog-eyebrow');
  if (statsEyebrow) statsEyebrow.textContent = `Hälsa och statistik för ${dog.name}`;

  const calEyebrow = document.getElementById('calEyebrow');
  if (calEyebrow) calEyebrow.textContent = `Kalender & påminnelser för ${dog.name}`;
}

/* ============================================================================
   SECTION 05: HOME PAGE ENGINE (index.html)
   ============================================================================ */

function initHomePage() {
  if (typeof document === 'undefined') return;
  const reviewsContainer = document.getElementById('reviews-container');
  const liveRatingVal = document.getElementById('live-rating-value');
  const liveRatingLabel = document.getElementById('live-rating-label');
  const openReviewModalBtn = document.getElementById('open-review-modal-btn');
  const reviewModal = document.getElementById('review-modal');
  const reviewForm = document.getElementById('review-form');

  function renderHomeReviews() {
    const reviews = safeStorage.get(STORAGE_KEYS.REVIEWS, []);
    
    // Rating strip in hero/stats
    if (reviews.length === 0) {
      if (liveRatingVal) liveRatingVal.textContent = '— / 5';
      if (liveRatingLabel) liveRatingLabel.textContent = 'Betyg från hundägare (inga recensioner än)';
      if (reviewsContainer) {
        reviewsContainer.innerHTML = `
          <div class="empty-reviews-notice" style="text-align:center; padding:40px 20px; background:#fff; border-radius:16px; border:1px dashed var(--border);">
            <span style="font-size:36px; display:block; margin-bottom:8px;">🐾</span>
            <h3 style="margin:0 0 6px; font-family:'Fraunces',serif;">Bli först med att lämna ett omdöme!</h3>
            <p style="margin:0; color:var(--muted); font-size:14px;">Vi visar endast äkta omdömen från riktiga hundägare. Klicka på knappen nedan för att dela dina erfarenheter.</p>
          </div>
        `;
      }
    } else {
      const avg = (reviews.reduce((acc, cur) => acc + (cur.rating || 5), 0) / reviews.length).toFixed(1);
      if (liveRatingVal) liveRatingVal.textContent = `${avg.replace('.', ',')} / 5`;
      if (liveRatingLabel) liveRatingLabel.textContent = `Betyg från ${reviews.length} hundägare`;

      if (reviewsContainer) {
        reviewsContainer.innerHTML = reviews.map(r => `
          <div class="review-card">
            <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
            <p class="review-comment">"${escapeHtml(r.comment)}"</p>
            <div class="review-author-row">
              <span class="review-avatar-mark">🐕</span>
              <div>
                <strong>${escapeHtml(r.name)}</strong>
                <small>${escapeHtml(r.dogName ? `${r.dogName} (${r.breed || 'Hund'})` : 'Verifierad ägare')}</small>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Open review modal
  if (openReviewModalBtn && reviewModal) {
    openReviewModalBtn.addEventListener('click', () => {
      if (reviewForm) reviewForm.reset();
      openModal(reviewModal);
    });
  }

  // Review Form Submit
  if (reviewForm && reviewModal) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('review-author-name')?.value.trim() || 'Hundägare';
      const dogName = document.getElementById('review-dog-name')?.value.trim() || '';
      const rating = parseInt(document.getElementById('review-rating-select')?.value || '5', 10);
      const comment = document.getElementById('review-comment-text')?.value.trim() || '';

      if (!comment) {
        showToast('Skriv gärna en kort kommentar!', '⚠️');
        return;
      }

      const reviews = safeStorage.get(STORAGE_KEYS.REVIEWS, []);
      reviews.unshift({
        id: generateId('rev'),
        name,
        dogName,
        rating,
        comment,
        date: new Date().toISOString()
      });
      safeStorage.set(STORAGE_KEYS.REVIEWS, reviews);

      closeModal(reviewModal);
      showToast('Tack för ditt fina omdöme! 🐾', '⭐');
      celebrateConfetti();
      renderHomeReviews();
    });
  }

  // Dog Age & Milestone Calculator on homepage
  const calcBtn = document.getElementById('calc-age-btn');
  const calcBirthInput = document.getElementById('calc-birthdate');
  const calcResultBox = document.getElementById('calc-result-box');
  if (calcBtn && calcBirthInput && calcResultBox) {
    calcBtn.addEventListener('click', () => {
      const birth = calcBirthInput.value;
      if (!birth) {
        showToast('Välj ett födelsedatum först!', '⚠️');
        return;
      }
      const ageStr = calculateAge(birth, currentLang);
      calcResultBox.innerHTML = `
        <div class="calc-badge">
          <span>🎂 Din hund är <strong>${ageStr}</strong> gammal</span>
          <small>Ungefär ${(parseFloat(ageStr) * 7 || 14).toFixed(0)} hundår i mänsklig motsvarighet.</small>
        </div>
      `;
      calcResultBox.style.display = 'block';
    });
  }

  renderHomeReviews();
}

/* ============================================================================
   SECTION 06: TIPS LIBRARY ENGINE (tips.html)
   ============================================================================ */

const DOG_TIPS_DATABASE = [
  {
    id: 'tip-01',
    category: 'nutrition',
    categoryName: 'Kost & Foder',
    title: 'Undvik tillagade märg- och tuggben',
    summary: 'Koka eller stek aldrig råhudsben eller märgben – tillagade ben splittras lätt till vassa flisor som kan orsaka livshotande skador.',
    content: 'Ge alltid ben råa eller använd kvalitetstestade tuggben av naturmaterial. Tillagning förändrar benstrukturen och gör den spröd, vilket kan leda till tarmvred och kvävning.',
    vettedBy: 'Leg. Veterinär',
    badge: 'Livsviktigt ⚠️',
    readTime: '2 min'
  },
  {
    id: 'tip-02',
    category: 'nutrition',
    categoryName: 'Kost & Foder',
    title: 'Farliga livsmedel i hemmet',
    summary: 'Choklad, vindruvor/russin, lök, vitlök, xylitol (björksocker) och avokado är mycket giftiga för hundar.',
    content: 'Spara numret till Giftinformationscentralen (010-456 6700). Xylitol kan orsaka akut hypoglykemi på under 30 minuter.',
    vettedBy: 'Leg. Veterinär',
    badge: 'Giftvarning 🍫',
    readTime: '3 min'
  },
  {
    id: 'tip-03',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Kloklippning utan stress',
    summary: 'Klipp lite och ofta (en klo per dag om det behövs) och belöna rikligt för att bygga en positiv förväntan.',
    content: 'Använd en vass tång och ha blodstoppande pulver eller potatismjöl till hands ifall du klipper i pulpan. Tvinga aldrig hunden utan ta pauser.',
    vettedBy: 'Hundinstruktör',
    badge: 'Vardagsvård ✂️',
    readTime: '2 min'
  },
  {
    id: 'tip-04',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Tandborstning är guldstandarden',
    summary: 'Att borsta hundens tänder dagligen med enzymtandkräm för hund är det enda säkra sättet att förebygga tandsten och parodontit.',
    content: 'Använd aldrig människotandkräm då den innehåller fluor och xylitol. Börja med att låta hunden slicka tandkräm från ditt finger.',
    vettedBy: 'Tandveterinär',
    badge: 'Tandhälsa 🪥',
    readTime: '3 min'
  },
  {
    id: 'tip-05',
    category: 'behavior',
    categoryName: 'Beteende & Vardag',
    title: 'Passivitetsträning i vardagen',
    summary: 'En hund som kan slappna av på signal och hantera miljöer utan att gå upp i varv är en trygg och harmonisk hund.',
    content: 'Träna på en specifik fäll eller matta hemma i lugn och ro, och ta sedan med mattan till caféer, tågstationer och nya miljöer.',
    vettedBy: 'Cert. Etolog',
    badge: 'Trygghet 🧘',
    readTime: '4 min'
  },
  {
    id: 'tip-06',
    category: 'safety',
    categoryName: 'Säkerhet & Första Hjälpen',
    title: 'Sommarhetta och varma bilar',
    summary: 'Lämna ALDRIG hunden i bilen under varma dagar. Temperaturen stiger till 50°C på bara några minuter.',
    content: 'Asfalt kan också bränna tassarna. Testa med handryggen mot marken i 7 sekunder – är det för varmt för dig är det för varmt för tassarna.',
    vettedBy: 'Djurambulansen',
    badge: 'Sommarsäkerhet ☀️',
    readTime: '2 min'
  },
  {
    id: 'tip-07',
    category: 'activity',
    categoryName: 'Aktivering & Lek',
    title: 'Nosaktivering tröttar ut på rätt sätt',
    summary: '15 minuters nosarbete (godissök eller personspår) ger mer mental tillfredsställelse än 1 timmes löpning.',
    content: 'Hundens luktsinne aktiverar stora delar av hjärnan och frigör lugnande endorfiner. Testa att sprida kvällsmaten på en gräsmatta.',
    vettedBy: 'Spårinstruktör',
    badge: 'Hjärngympa 👃',
    readTime: '3 min'
  },
  {
    id: 'tip-08',
    category: 'safety',
    categoryName: 'Säkerhet & Första Hjälpen',
    title: 'Fästingkoll och fästingburna sjukdomar',
    summary: 'Gå igenom pälsen dagligen under säsongen (mars–november). TBE och Borrelia överförs inom 24–48 timmar.',
    content: 'Använd fästingplockare med jämn dragrörelse. Rengör med klorhexidin eller sårtvätt efteråt.',
    vettedBy: 'Leg. Veterinär',
    badge: 'Parasitskydd 🕷️',
    readTime: '3 min'
  },
  {
    id: 'tip-09',
    category: 'nutrition',
    categoryName: 'Kost & Foder',
    title: 'Gradvis foderbyte skonar magen',
    summary: 'Byt foder gradvis över 7–10 dagar genom att blanda det gamla och nya fodret.',
    content: 'Dag 1-3: 75% gammalt, 25% nytt. Dag 4-6: 50/50. Dag 7-9: 25% gammalt, 75% nytt. Dag 10: 100% nytt foder.',
    vettedBy: 'Foderrådgivare',
    badge: 'Maghälsa 🥣',
    readTime: '2 min'
  },
  {
    id: 'tip-10',
    category: 'behavior',
    categoryName: 'Beteende & Vardag',
    title: 'Belöningens tajming är allt',
    summary: 'Hunden kopplar belöningen till det beteende den utförde inom 1,3 sekunder.',
    content: 'Använd en klicker eller en tydlig belöningssignal ("Bra!") för att markera exakt rätt millisekund innan du ger godisen.',
    vettedBy: 'Hundpsykolog',
    badge: 'Inlärning ⏱️',
    readTime: '3 min'
  },
  {
    id: 'tip-11',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Håll koll på vikten och midjan',
    summary: 'Övervikt förkortar hundens livslängd med i genomsnitt 2 år och belastar lederna kraftigt.',
    content: 'Du ska lätt kunna känna revbenen med ett lätt tryck över bröstkorgen utan ett tjockt fettskikt, och hunden ska ha en tydlig midja sedd ovanifrån.',
    vettedBy: 'Agria Hälsa',
    badge: 'Viktkoll ⚖️',
    readTime: '3 min'
  },
  {
    id: 'tip-12',
    category: 'activity',
    categoryName: 'Aktivering & Lek',
    title: 'Variera promenadunderlaget',
    summary: 'Att gå i obanad terräng, mossa, blåbärsris och på stock och sten bygger stabiliserande coremuskulatur.',
    content: 'Undvik enformig asfaltsvandring som sliter på trampdynor och leder. Skogsstigar ger naturlig sjukgymnastik.',
    vettedBy: 'Hundfysioterapeut',
    badge: 'Rörelseglädje 🌲',
    readTime: '2 min'
  },
  {
    id: 'tip-13',
    category: 'safety',
    categoryName: 'Säkerhet & Första Hjälpen',
    title: 'Första hjälpen vid huggormsbett',
    summary: 'Håll hunden helt stilla och bär den om möjligt. Åk omedelbart till veterinär.',
    content: 'Ge inte kortison om inte veterinär uttryckligen ordinerat det via telefon. Håll bettstället lågt i förhållande till hjärtat.',
    vettedBy: 'Djursjukhuset',
    badge: 'Akutvård 🐍',
    readTime: '4 min'
  },
  {
    id: 'tip-14',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Rengör öronen skonsamt',
    summary: 'Använd aldrig bomullspinnar (tops) i hörselgången. Droppa öronrens, massera örats bas och torka ur med bomullsrondell.',
    content: 'Röda, illaluktande eller kliande öron är ofta tecken på svamp eller bakterieinfektion som kräver veterinärkoll.',
    vettedBy: 'Dermatolog',
    badge: 'Öronvård 👂',
    readTime: '2 min'
  },
  {
    id: 'tip-15',
    category: 'behavior',
    categoryName: 'Beteende & Vardag',
    title: 'Ensamträning i mikrosteg',
    summary: 'Börja med att stänga en dörr i 10 sekunder och bygg upp tryggheten successivt.',
    content: 'Filma hunden med en surfplatta för att se om den verkligen sover eller visar tysta stressignaler (gässlar, vandrar, slickar sig runt munnen).',
    vettedBy: 'Etolog',
    badge: 'Trygghet 🏠',
    readTime: '4 min'
  },
  {
    id: 'tip-16',
    category: 'nutrition',
    categoryName: 'Kost & Foder',
    title: 'Färskt vatten alltid tillgängligt',
    summary: 'En vuxen hund behöver dricka cirka 0,5 dl vatten per kilo kroppsvikt och dygn.',
    content: 'Ökad törst (polydipsi) kan vara ett tidigt tecken på diabetes, njursjukdom eller livmoderinflammation (pyometra).',
    vettedBy: 'Leg. Veterinär',
    badge: 'Vätskebalans 💧',
    readTime: '2 min'
  },
  {
    id: 'tip-17',
    category: 'safety',
    categoryName: 'Säkerhet & Första Hjälpen',
    title: 'Reflexer räddar liv i mörkret',
    summary: 'En bilist med halvljus upptäcker en mörk hund utan reflex på 25 meters avstånd – med reflex på 125 meters avstånd.',
    content: 'Kombinera reflexväst med ett fast blinkande LED-halsband så hunden syns från alla vinklar och i snödrivor.',
    vettedBy: 'NTF Trafiksäkerhet',
    badge: 'Synlighet 🦺',
    readTime: '2 min'
  },
  {
    id: 'tip-18',
    category: 'activity',
    categoryName: 'Aktivering & Lek',
    title: 'Kombinera lek med stadga',
    summary: 'Låt hunden sitta kvar och vänta medan du kastar bollen, och ge frikommando först när bollen landat.',
    content: 'Detta tränar impulskontroll och minskar risken för hetsiga bollfixeringar.',
    vettedBy: 'Brukshundklubben',
    badge: 'Impulskontroll 🎾',
    readTime: '3 min'
  },
  {
    id: 'tip-19',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Tassvård vid kyla och vägsalt',
    summary: 'Smörj trampdynorna med vattenfri tassalva före promenaden och skölj av vägsalt efteråt.',
    content: 'Salt och grus torkar ut och orsakar sprickor som svider kraftigt när hunden slickar på tassarna.',
    vettedBy: 'Hundfrisör',
    badge: 'Vintertassar 🐾',
    readTime: '2 min'
  },
  {
    id: 'tip-20',
    category: 'behavior',
    categoryName: 'Beteende & Vardag',
    title: 'Hundmöten i en mjuk båge',
    summary: 'Direkt frontala möten upplevs som hotfulla på hundspråk. Ta ut en liten båge åt sidan när ni möter andra hundar.',
    content: 'Låt kopplet vara slakt och belöna när hunden vänder blicken mot dig istället för den mötande hunden.',
    vettedBy: 'Hundinstruktör',
    badge: 'Hundspråk 🐕',
    readTime: '3 min'
  },
  {
    id: 'tip-21',
    category: 'nutrition',
    categoryName: 'Kost & Foder',
    title: 'Nyttiga grönsaker som hundgodis',
    summary: 'Morotsstavar, gurkbitar, kokt pumpa och blåbär är kalorisnåla och fiberrika belöningar.',
    content: 'Perfekt för hundar som behöver hålla vikten eller som tuggstimulans under sommaren när bitarna fryses in.',
    vettedBy: 'Kostspecialist',
    badge: 'Hälsosnacks 🥕',
    readTime: '2 min'
  },
  {
    id: 'tip-22',
    category: 'safety',
    categoryName: 'Säkerhet & Första Hjälpen',
    title: 'Kvävningsrisk vid tennisbollar',
    summary: 'Vanliga tennisbollar är slipande för tandemaljen och kan fastna i svalget på medelstora och stora hundar.',
    content: 'Välj bollar av naturgummi med snöre eller genomgående lufthål som tillåter andning ifall bollen hamnar långt bak i munnen.',
    vettedBy: 'Akutveterinär',
    badge: 'Leksäkerhet ⚠️',
    readTime: '2 min'
  },
  {
    id: 'tip-23',
    category: 'care',
    categoryName: 'Skötsel & Hälsa',
    title: 'Regelbundna vaccinationer',
    summary: 'Håll vaccinationsskyddet mot parvo, valpsjuka, HCC och kennelhosta uppdaterat.',
    content: 'Kennelhosta rekommenderas årligen för hundar som träffar andra hundar på kurser, hunddagis eller rastgårdar.',
    vettedBy: 'SVA',
    badge: 'Smittskydd 💉',
    readTime: '3 min'
  },
  {
    id: 'tip-24',
    category: 'activity',
    categoryName: 'Aktivering & Lek',
    title: 'Balansövningar i naturen',
    summary: 'Låt hunden sätta framtassarna på en stubbe, balansera över en liggande trädstam eller krypa under en gren.',
    content: 'Det stärker hundens kroppskontroll, självförtroende och bakbensmedvetenhet.',
    vettedBy: 'Agilitytränare',
    badge: 'Proprioception 🌲',
    readTime: '3 min'
  },
  {
    id: 'tip-25',
    category: 'behavior',
    categoryName: 'Beteende & Vardag',
    title: 'Sömn och återhämtning',
    summary: 'En vuxen hund behöver sova 12–14 timmar per dygn, och en valp upp till 18–20 timmar.',
    content: 'Sömnbrist leder ofta till stress, överstimulering och koncentrationssvårigheter. Ge hunden en ostörd sovplats.',
    vettedBy: 'Sömnforskare',
    badge: 'Återhämtning 💤',
    readTime: '3 min'
  }
];

function initTipsPage() {
  if (typeof document === 'undefined') return;
  const grid = document.getElementById('tips-grid');
  if (!grid) return;

  const searchInput = document.getElementById('tips-search');
  const clearSearchBtn = document.getElementById('tips-clear-search');
  const catButtons = document.querySelectorAll('.cat-pill, [data-category]');
  const progressBarFill = document.getElementById('tipsProgressBarFill');
  const progressText = document.getElementById('tipsProgressText');
  const spotlightCard = document.getElementById('dailySpotlightCard');
  const randomizeBtn = document.getElementById('randomize-tip-btn');

  let activeCategory = 'all';
  let searchTerm = '';

  function getSavedTips() {
    return safeStorage.get(STORAGE_KEYS.SAVED_TIPS, []);
  }

  function getCheckedTips() {
    return safeStorage.get(STORAGE_KEYS.CHECKED_TIPS, []);
  }

  function updateReadingProgress() {
    const checked = getCheckedTips();
    const total = DOG_TIPS_DATABASE.length;
    const percent = Math.round((checked.length / total) * 100);
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${checked.length} av ${total} tips utforskade (${percent}%)`;
  }

  function updateCategoryCounts() {
    const saved = getSavedTips();
    const countSavedEl = document.getElementById('count-saved');
    if (countSavedEl) countSavedEl.textContent = saved.length;

    const countAllEl = document.getElementById('count-all');
    if (countAllEl) countAllEl.textContent = DOG_TIPS_DATABASE.length;
  }

  function setSpotlightTip(tip) {
    if (!spotlightCard || !tip) return;
    const titleEl = document.getElementById('spotlightTitle');
    const descEl = document.getElementById('spotlightDesc');
    const badgeEl = document.getElementById('spotlightBadge');
    const catTagEl = document.getElementById('spotlightCatTag');

    if (titleEl) titleEl.textContent = tip.title;
    if (descEl) descEl.textContent = tip.summary;
    if (badgeEl) badgeEl.textContent = tip.badge;
    if (catTagEl) catTagEl.textContent = tip.categoryName;
    spotlightCard.setAttribute('data-tip-id', tip.id);
  }

  function highlightText(text, term) {
    if (!term || !text) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${term.replace(/[-[\]{}()*+?.,\^$|#\s]/g, '\$&')})`, 'gi');
    return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function renderTips() {
    const saved = getSavedTips();
    const checked = getCheckedTips();

    const filtered = DOG_TIPS_DATABASE.filter(tip => {
      // Category check
      if (activeCategory === 'saved') {
        if (!saved.includes(tip.id)) return false;
      } else if (activeCategory !== 'all') {
        if (tip.category !== activeCategory) return false;
      }

      // Search check
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = tip.title.toLowerCase().includes(query);
        const matchesSummary = tip.summary.toLowerCase().includes(query);
        const matchesContent = tip.content.toLowerCase().includes(query);
        const matchesCat = tip.categoryName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesContent && !matchesCat) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 48px 16px; background:#fff; border-radius:16px; border:1px dashed var(--border);">
          <span style="font-size:36px; display:block; margin-bottom:8px;">🔍</span>
          <h3 style="margin:0 0 6px; font-family:'Fraunces',serif;">Inga tips matchade din sökning</h3>
          <p style="margin:0; color:var(--muted); font-size:14px;">Testa ett annat sökord eller byt kategori ovan.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(tip => {
      const isSaved = saved.includes(tip.id);
      const isChecked = checked.includes(tip.id);

      return `
        <article class="tip-card ${isChecked ? 'completed-tip' : ''}" id="tip-card-${tip.id}">
          <div class="tip-card-header">
            <span class="tip-cat-badge">${escapeHtml(tip.categoryName)}</span>
            <span class="tip-time-badge">⏱️ ${tip.readTime}</span>
          </div>

          <h3 class="tip-card-title">${highlightText(tip.title, searchTerm)}</h3>
          <p class="tip-card-summary">${highlightText(tip.summary, searchTerm)}</p>

          <div class="tip-content-expandable">
            <p>${highlightText(tip.content, searchTerm)}</p>
          </div>

          <div class="tip-card-footer">
            <div class="tip-vetted-by">
              <span>🩺</span>
              <small>${escapeHtml(tip.vettedBy)}</small>
            </div>

            <div class="tip-actions-row">
              <button type="button" class="btn-icon bookmark-btn ${isSaved ? 'active' : ''}" onclick="window.toggleTipSave('${tip.id}')" title="${isSaved ? 'Ta bort bokmärke' : 'Spara tipset'}" aria-label="Bokmärk tipset">
                ${isSaved ? '★' : '☆'}
              </button>
              <button type="button" class="btn-icon check-btn ${isChecked ? 'active' : ''}" onclick="window.toggleTipCheck('${tip.id}')" title="${isChecked ? 'Klarmarkerat' : 'Markera som läst'}" aria-label="Markera som läst">
                ${isChecked ? '✓' : '○'}
              </button>
              <button type="button" class="btn-icon share-btn" onclick="window.shareTip('${tip.id}')" title="Dela tipset" aria-label="Dela tipset">
                ↗
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    updateReadingProgress();
    updateCategoryCounts();
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchTerm = e.target.value.trim();
      if (clearSearchBtn) clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
      renderTips();
    }, 150));
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.style.display = 'none';
      renderTips();
      if (searchInput) searchInput.focus();
    });
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category') || 'all';
      catButtons.forEach(b => b.classList.toggle('active', b === btn));
      renderTips();
    });
  });

  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', () => {
      const randIndex = Math.floor(Math.random() * DOG_TIPS_DATABASE.length);
      setSpotlightTip(DOG_TIPS_DATABASE[randIndex]);
      showToast('Nytt spotlight-tips laddat!', '✨');
    });
  }

  // Global Tip Helpers
  window.toggleTipSave = (id) => {
    let saved = getSavedTips();
    if (saved.includes(id)) {
      saved = saved.filter(i => i !== id);
      showToast('Tipset togs bort från sparade.', '☆');
    } else {
      saved.push(id);
      showToast('Tipset sparat bland dina favoriter! ⭐', '★');
    }
    safeStorage.set(STORAGE_KEYS.SAVED_TIPS, saved);
    renderTips();
  };

  window.toggleTipCheck = (id) => {
    let checked = getCheckedTips();
    if (checked.includes(id)) {
      checked = checked.filter(i => i !== id);
      showToast('Markering borttagen.');
    } else {
      checked.push(id);
      showToast('Bra jobbat! Tips markerat som läst. 🎉', '✓');
      celebrateConfetti();
    }
    safeStorage.set(STORAGE_KEYS.CHECKED_TIPS, checked);
    renderTips();
  };

  window.shareTip = async (id) => {
    const tip = DOG_TIPS_DATABASE.find(t => t.id === id);
    if (!tip) return;
    const shareText = `HundApp Tips: ${tip.title} - ${tip.summary}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tip.title,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {}
    }
    copyToClipboard(`${shareText} (${window.location.href})`, 'Tipslänk kopierad till urklipp!');
  };

  // Set initial daily spotlight tip
  setSpotlightTip(DOG_TIPS_DATABASE[0]);
  renderTips();
}

/* ============================================================================
   SECTION 07: WALKS & ACTIVITY TRACKER ENGINE (walks.html)
   ============================================================================ */

function initWalksPage() {
  if (typeof document === 'undefined') return;
  const walksList = document.getElementById('walks-log-list');
  if (!walksList) return;

  const logWalkBtn = document.getElementById('log-walk-button');
  const logActivityBtn = document.getElementById('log-activity-button');
  const walkModal = document.getElementById('walk-modal');
  const activityModal = document.getElementById('activity-modal');
  const walkForm = document.getElementById('walk-log-form');
  const activityForm = document.getElementById('activity-log-form');

  // Stats badges
  const statWalkCount = document.getElementById('stat-walk-count');
  const statWalkTime = document.getElementById('stat-walk-time');
  const statWalkDistance = document.getElementById('stat-walk-distance');
  const statActivityCount = document.getElementById('stat-activity-count');
  const statActivityTime = document.getElementById('stat-activity-time');

  // Filter & Dog header elements
  const walksDogEyebrow = document.getElementById('walksDogEyebrow');
  const activeDogFilterName = document.getElementById('activeDogFilterName');
  const filterBtns = document.querySelectorAll('.log-filter-btn, [data-filter]');

  let activeFilter = 'all';

  /* ==========================================
     1. LIVE WALK TRACKER (STOPWATCH & METRICS)
     ========================================== */
  const timerDisplay = document.getElementById('liveTrackerTimerDisplay');
  const distDisplay = document.getElementById('liveTrackerDistDisplay');
  const paceDisplay = document.getElementById('liveTrackerPaceDisplay');
  const toggleBtn = document.getElementById('liveTrackerToggleBtn');
  const finishBtn = document.getElementById('liveTrackerFinishBtn');
  const statusText = document.getElementById('liveTrackerStatusText');

  let trackerRunning = false;
  let trackerPaused = false;
  let trackerSeconds = 0;
  let trackerTimerId = null;

  function formatStopwatchTime(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }

  function updateTrackerUI() {
    if (timerDisplay) timerDisplay.textContent = formatStopwatchTime(trackerSeconds);
    const estDistKm = ((trackerSeconds / 3600) * 4.5);
    if (distDisplay) distDisplay.textContent = `~${estDistKm.toFixed(1)} km`;
    if (paceDisplay) paceDisplay.textContent = '4.5 km/h';

    if (toggleBtn) {
      if (!trackerRunning && !trackerPaused) {
        toggleBtn.textContent = '▶ Starta tur';
        toggleBtn.className = 'btn btn-primary btn-sm';
        if (statusText) statusText.textContent = 'REDO FÖR NÄSTA TUR';
        if (finishBtn) finishBtn.disabled = true;
      } else if (trackerRunning) {
        toggleBtn.textContent = '⏸ Pausa';
        toggleBtn.className = 'btn btn-outline btn-sm';
        if (statusText) statusText.textContent = 'PROMENAD PÅGÅR JUST NU';
        if (finishBtn) finishBtn.disabled = false;
      } else if (trackerPaused) {
        toggleBtn.textContent = '▶ Fortsätt';
        toggleBtn.className = 'btn btn-primary btn-sm';
        if (statusText) statusText.textContent = 'PROMENAD PAUSAD';
        if (finishBtn) finishBtn.disabled = false;
      }
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!trackerRunning && !trackerPaused) {
        // Start
        trackerRunning = true;
        trackerPaused = false;
        trackerSeconds = 0;
        clearInterval(trackerTimerId);
        trackerTimerId = setInterval(() => {
          trackerSeconds++;
          updateTrackerUI();
        }, 1000);
        showToast('Promenad startad! Njut av turen. 🐾', '🦮');
      } else if (trackerRunning) {
        // Pause
        trackerRunning = false;
        trackerPaused = true;
        clearInterval(trackerTimerId);
        showToast('Promenaden är pausad.');
      } else if (trackerPaused) {
        // Resume
        trackerRunning = true;
        trackerPaused = false;
        clearInterval(trackerTimerId);
        trackerTimerId = setInterval(() => {
          trackerSeconds++;
          updateTrackerUI();
        }, 1000);
        showToast('Promenaden fortsätter! 🐾');
      }
      updateTrackerUI();
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      // Pause tracker
      trackerRunning = false;
      trackerPaused = false;
      clearInterval(trackerTimerId);

      const elapsedMinutes = Math.max(1, Math.round(trackerSeconds / 60));
      const estDistKm = parseFloat(((trackerSeconds / 3600) * 4.5).toFixed(1));

      // Reset stopwatch
      trackerSeconds = 0;
      updateTrackerUI();

      // Open walk modal pre-filled
      if (walkModal) {
        const durInput = document.getElementById('walk-duration');
        const distInput = document.getElementById('walk-distance');
        const dtInput = document.getElementById('walk-datetime');
        if (durInput) durInput.value = elapsedMinutes;
        if (distInput) distInput.value = estDistKm > 0 ? estDistKm : 1.0;
        if (dtInput) dtInput.value = new Date().toISOString().slice(0, 16);
        openModal(walkModal);
      }
    });
  }

  /* ==========================================
     2. DEFAULT LOGGAR & DATAFUNKTIONER
     ========================================== */
  const DEFAULT_WALKS = [
    {
      id: 'w-1',
      dogId: 'bella',
      type: 'Morgonpromenad',
      duration: 45,
      distance: 3.4,
      surface: '🌲 Skogsstig',
      mood: '⚡ Superpigg & glad',
      datetime: '2026-08-29T08:30',
      note: 'Morgonrunda i motionsspåret. Bella var pigg och nosade nyfiket på allt!'
    },
    {
      id: 'w-2',
      dogId: 'bella',
      type: 'Skogspromenad',
      duration: 35,
      distance: 2.5,
      surface: '🌲 Skogsstig',
      mood: '👃 Mycket nosig & fokuserad',
      datetime: '2026-08-28T14:15',
      note: 'Luktade efter rådjursspår vid gläntan.'
    },
    {
      id: 'w-3',
      dogId: 'bella',
      type: 'Kvällspromenad',
      duration: 25,
      distance: 1.8,
      surface: '🪨 Grusväg',
      mood: '🐾 Lugn & harmonisk',
      datetime: '2026-08-27T19:00',
      note: 'Lugn kvällsrunda med fint slakt koppel.'
    },
    {
      id: 'w-4',
      dogId: 'bella',
      type: 'Långpromenad',
      duration: 60,
      distance: 5.2,
      surface: '🏖️ Strand / Bad',
      mood: '⚡ Superpigg & glad',
      datetime: '2026-08-26T11:00',
      note: 'Härligt bad och bus vid hundstranden.'
    }
  ];

  const DEFAULT_ACTIVITIES = [
    {
      id: 'act-1',
      dogId: 'bella',
      type: 'Nosarbete hemma',
      category: 'scent',
      duration: 20,
      datetime: '2026-08-29T16:00',
      note: 'Godissök i vardagsrummet och under filtar.'
    },
    {
      id: 'act-2',
      dogId: 'bella',
      type: 'Lydnadsträning',
      category: 'training',
      duration: 15,
      datetime: '2026-08-28T11:00',
      note: 'Tränade inkallning och passivitet på gräsmattan.'
    },
    {
      id: 'act-3',
      dogId: 'bella',
      type: 'Bolllek i parken',
      category: 'play',
      duration: 10,
      datetime: '2026-08-27T16:30',
      note: 'Kastade tennisboll med mjuk avlämning.'
    }
  ];

  function getWalkLogs() {
    const list = safeStorage.get(STORAGE_KEYS.WALK_LOGS);
    if (!list || !Array.isArray(list) || list.length === 0) {
      safeStorage.set(STORAGE_KEYS.WALK_LOGS, DEFAULT_WALKS);
      return DEFAULT_WALKS;
    }
    return list;
  }

  function getActivityLogs() {
    const list = safeStorage.get(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!list || !Array.isArray(list) || list.length === 0) {
      safeStorage.set(STORAGE_KEYS.ACTIVITY_LOGS, DEFAULT_ACTIVITIES);
      return DEFAULT_ACTIVITIES;
    }
    return list;
  }

  /* ==========================================
     3. RENDERING AV LOGGLISTA & STATISTIK
     ========================================== */
  function renderWalkLogs() {
    const activeDog = getActiveDog();
    const walks = getWalkLogs().filter(w => !w.dogId || w.dogId === activeDog.id);
    const activities = getActivityLogs().filter(a => !a.dogId || a.dogId === activeDog.id);

    // Update active dog labels
    if (walksDogEyebrow) walksDogEyebrow.textContent = `${activeDog.name}s rörelse och äventyr`;
    if (activeDogFilterName) activeDogFilterName.textContent = activeDog.name;

    // Calculate stats
    const totalWalks = walks.length;
    const totalWalkMinutes = walks.reduce((acc, cur) => acc + (cur.duration || 0), 0);
    const totalWalkDist = walks.reduce((acc, cur) => acc + (cur.distance || 0), 0);
    const totalActCount = activities.length;
    const totalActMinutes = activities.reduce((acc, cur) => acc + (cur.duration || 0), 0);

    const hours = Math.floor(totalWalkMinutes / 60);
    const mins = totalWalkMinutes % 60;
    const timeFormatted = hours > 0 ? `${hours} h ${mins} min totalt` : `${mins} min totalt`;

    if (statWalkCount) statWalkCount.innerHTML = `${totalWalks} <em>promenader</em>`;
    if (statWalkTime) statWalkTime.textContent = timeFormatted;
    if (statWalkDistance) statWalkDistance.innerHTML = `${totalWalkDist.toFixed(1).replace('.', ',')} <em>km</em>`;
    if (statActivityCount) statActivityCount.innerHTML = `${totalActCount} <em>st</em>`;
    if (statActivityTime) statActivityTime.textContent = `${totalActMinutes} min mental stimulans`;

    // Weekly Goal (target: 15.0 km)
    const goalTargetKm = 15.0;
    const goalPercent = Math.min(100, Math.round((totalWalkDist / goalTargetKm) * 100));
    const goalNumbersEl = document.getElementById('goalStatNumbers');
    const goalBarFill = document.getElementById('goalProgressBarFill');
    if (goalNumbersEl) goalNumbersEl.textContent = `${totalWalkDist.toFixed(1)} av ${goalTargetKm.toFixed(1)} km (${goalPercent}%)`;
    if (goalBarFill) goalBarFill.style.width = `${goalPercent}%`;

    // Combine and unify walk + activity items into single feed
    const combinedFeed = [
      ...walks.map(w => ({ ...w, itemType: 'walk' })),
      ...activities.map(a => ({ ...a, itemType: 'activity' }))
    ];

    // Sort by datetime descending
    combinedFeed.sort((a, b) => new Date(b.datetime || 0) - new Date(a.datetime || 0));

    // Filter feed
    const filteredFeed = combinedFeed.filter(item => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'walk') return item.itemType === 'walk';
      if (activeFilter === 'activity') return item.itemType === 'activity';
      if (activeFilter === 'scent') return item.category === 'scent' || item.type?.toLowerCase().includes('nos');
      if (activeFilter === 'play') return item.category === 'play' || item.type?.toLowerCase().includes('lek');
      if (activeFilter === 'training') return item.category === 'training' || item.type?.toLowerCase().includes('träning');
      return true;
    });

    if (filteredFeed.length === 0) {
      walksList.innerHTML = `
        <div style="text-align:center; padding:36px 16px; color:var(--muted);">
          <span style="font-size:36px; display:block; margin-bottom:8px;">🦮</span>
          <strong>Inga loggade händelser i denna kategori ännu.</strong>
          <p style="margin:4px 0 0; font-size:12.5px;">Starta en live-promenad eller klicka på "Logga promenad" ovan!</p>
        </div>
      `;
      return;
    }

    walksList.innerHTML = filteredFeed.map(item => {
      const isWalk = item.itemType === 'walk';
      const icon = isWalk ? '🦮' : (item.category === 'scent' ? '👃' : (item.category === 'training' ? '🏆' : '🎾'));
      const humanDate = formatHumanDate(item.datetime, currentLang);
      const timePart = item.datetime ? item.datetime.slice(11, 16) : '';

      return `
        <article class="walk-card-item">
          <div class="walk-card-icon-wrap ${!isWalk ? 'activity-icon' : ''}">
            ${icon}
          </div>

          <div class="walk-card-content">
            <div class="walk-card-header-row">
              <h3 class="walk-card-title">${escapeHtml(item.type)}</h3>
              
              <div class="walk-badges-row">
                ${item.distance ? `<span class="walk-metric-tag distance-tag">📍 ${item.distance} km</span>` : ''}
                <span class="walk-metric-tag">⏱️ ${item.duration} min</span>
                ${item.surface ? `<span class="walk-metric-tag surface-tag">${escapeHtml(item.surface)}</span>` : ''}
                ${item.mood ? `<span class="walk-metric-tag mood-tag">${escapeHtml(item.mood)}</span>` : ''}
              </div>
            </div>

            ${item.note ? `<p class="walk-card-note">"${escapeHtml(item.note)}"</p>` : ''}

            <div class="walk-card-footer-row">
              <span>📅 ${humanDate} ${timePart ? `kl ${timePart}` : ''}</span>
              <button type="button" class="btn-icon delete-log-btn" onclick="${isWalk ? `window.deleteWalkLog('${item.id}')` : `window.deleteActivityLog('${item.id}')`}" title="Ta bort logg">
                🗑️
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Filter button event listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderWalkLogs();
    });
  });

  // Modal Open Handlers
  if (logWalkBtn && walkModal) {
    logWalkBtn.addEventListener('click', () => {
      if (walkForm) walkForm.reset();
      const dt = document.getElementById('walk-datetime');
      if (dt) dt.value = new Date().toISOString().slice(0, 16);
      openModal(walkModal);
    });
  }

  if (logActivityBtn && activityModal) {
    logActivityBtn.addEventListener('click', () => {
      if (activityForm) activityForm.reset();
      const dt = document.getElementById('activity-datetime');
      if (dt) dt.value = new Date().toISOString().slice(0, 16);
      openModal(activityModal);
    });
  }

  // Modal Close Handlers
  const closeWalkBtn = document.getElementById('close-walk-modal-btn');
  const closeActBtn = document.getElementById('close-activity-modal-btn');
  if (closeWalkBtn && walkModal) closeWalkBtn.addEventListener('click', () => closeModal(walkModal));
  if (closeActBtn && activityModal) closeActBtn.addEventListener('click', () => closeModal(activityModal));

  // Pill Selector Bindings for Walk Form
  function setupPillGroup(containerId, inputId, attr = 'data-type') {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;
    container.querySelectorAll('.pill-option').forEach(pill => {
      pill.addEventListener('click', () => {
        input.value = pill.getAttribute(attr) || pill.textContent.trim();
        container.querySelectorAll('.pill-option').forEach(p => p.classList.toggle('active', p === pill));
      });
    });
  }

  setupPillGroup('walk-type-pills', 'walk-type-input', 'data-type');
  setupPillGroup('walk-surface-pills', 'walk-surface-input', 'data-surface');
  setupPillGroup('walk-mood-pills', 'walk-mood-input', 'data-mood');
  setupPillGroup('activity-type-pills', 'activity-type-input', 'data-type');

  // Activity category sync
  const actPills = document.getElementById('activity-type-pills');
  const actCatInput = document.getElementById('activity-category-input');
  if (actPills && actCatInput) {
    actPills.querySelectorAll('.pill-option').forEach(pill => {
      pill.addEventListener('click', () => {
        actCatInput.value = pill.getAttribute('data-category') || 'scent';
      });
    });
  }

  // Walk Form Submit
  if (walkForm && walkModal) {
    walkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('walk-type-input')?.value || 'Morgonpromenad';
      const duration = parseInt(document.getElementById('walk-duration')?.value || '0', 10);
      const distance = parseFloat(document.getElementById('walk-distance')?.value || '0');
      const surface = document.getElementById('walk-surface-input')?.value || '🌲 Skogsstig';
      const mood = document.getElementById('walk-mood-input')?.value || '⚡ Superpigg & glad';
      const datetime = document.getElementById('walk-datetime')?.value || new Date().toISOString();
      const note = document.getElementById('walk-note')?.value.trim() || '';

      if (duration <= 0 && distance <= 0) {
        showToast('Ange giltig distans eller tid.', '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const newWalk = {
        id: 'w-' + Date.now(),
        dogId: activeDog.id,
        type,
        duration,
        distance,
        surface,
        mood,
        datetime,
        note
      };

      const logs = getWalkLogs();
      logs.unshift(newWalk);
      safeStorage.set(STORAGE_KEYS.WALK_LOGS, logs);

      closeModal(walkModal);
      showToast(`Promenad loggad för ${activeDog.name}! 🐾`, '🎉');
      renderWalkLogs();
    });
  }

  // Activity Form Submit
  if (activityForm && activityModal) {
    activityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('activity-type-input')?.value || 'Nosarbete hemma';
      const category = document.getElementById('activity-category-input')?.value || 'scent';
      const duration = parseInt(document.getElementById('activity-duration')?.value || '0', 10);
      const datetime = document.getElementById('activity-datetime')?.value || new Date().toISOString();
      const note = document.getElementById('activity-note')?.value.trim() || '';

      if (duration <= 0) {
        showToast('Ange giltig aktivitetstid.', '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const activities = getActivityLogs();
      activities.unshift({
        id: 'act-' + Date.now(),
        dogId: activeDog.id,
        type,
        category,
        duration,
        datetime,
        note
      });
      safeStorage.set(STORAGE_KEYS.ACTIVITY_LOGS, activities);

      closeModal(activityModal);
      showToast(`Aktivitet loggad för ${activeDog.name}! 🧠`, '🎉');
      renderWalkLogs();
    });
  }

  window.deleteWalkLog = (id) => {
    let logs = getWalkLogs();
    logs = logs.filter(w => w.id !== id);
    safeStorage.set(STORAGE_KEYS.WALK_LOGS, logs);
    showToast('Promenad borttagen.');
    renderWalkLogs();
  };

  window.deleteActivityLog = (id) => {
    let activities = getActivityLogs();
    activities = activities.filter(a => a.id !== id);
    safeStorage.set(STORAGE_KEYS.ACTIVITY_LOGS, activities);
    showToast('Aktivitet borttagen.');
    renderWalkLogs();
  };

  // Export
  window.renderWalkLogs = renderWalkLogs;

  // Initial render
  updateTrackerUI();
  renderWalkLogs();
}

/* ============================================================================
   SECTION 08: DOG HEALTH & STATISTICS ENGINE (statistics.html)
   ============================================================================ */

function initStatisticsPage() {
  if (typeof document === 'undefined') return;
  const statsContainer = document.getElementById('walkChartContainer') || document.querySelector('.stats-main');
  if (!statsContainer) return;

  const dogSelect = document.getElementById('stat-dog-select');
  const printBtn = document.getElementById('print-stats-btn');
  const openWeightBtn = document.getElementById('open-weight-modal-btn');
  const weightModal = document.getElementById('weight-modal');
  const weightForm = document.getElementById('weight-form');

  function renderStats() {
    const activeDog = getActiveDog();
    updateActiveDogGlobalUI();

    const walks = safeStorage.get(STORAGE_KEYS.WALK_LOGS, []).filter(w => !w.dogId || w.dogId === activeDog.id);
    const totalDist = walks.reduce((a, b) => a + (b.distance || 0), 0);
    const totalTime = walks.reduce((a, b) => a + (b.duration || 0), 0);

    const statWalksCount = document.getElementById('stat-walks-count');
    const statTimeCount = document.getElementById('stat-time-count');
    const statDistanceTotal = document.getElementById('stat-distance-total');

    if (statWalksCount) statWalksCount.innerHTML = `${walks.length} <em>promenader</em>`;
    if (statTimeCount) statTimeCount.innerHTML = `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`;
    if (statDistanceTotal) statDistanceTotal.innerHTML = `${totalDist.toFixed(1).replace('.', ',')} <em>km</em>`;

    // Render SVG Bar Chart for weekly walk distance
    const chartBox = document.getElementById('walkChartContainer');
    if (chartBox) {
      const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
      const values = [2.5, 3.4, 1.8, 4.2, 3.0, 5.5, 2.0]; // sample distribution
      const maxVal = Math.max(...values, 6);

      chartBox.innerHTML = `
        <div class="stat-chart-svg-wrap" style="padding:16px 0;">
          <svg viewBox="0 0 400 160" width="100%" height="160" style="overflow:visible;">
            ${values.map((v, i) => {
              const barHeight = (v / maxVal) * 110;
              const x = 30 + i * 52;
              const y = 130 - barHeight;
              return `
                <rect x="${x}" y="${y}" width="32" height="${barHeight}" rx="6" fill="url(#barGradient)" opacity="0.9" />
                <text x="${x + 16}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="#2d6a4f">${v}k</text>
                <text x="${x + 16}" y="148" text-anchor="middle" font-size="12" fill="#6c757d">${days[i]}</text>
              `;
            }).join('')}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#52b788" />
                <stop offset="100%" stop-color="#2d6a4f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      `;
    }
  }

  if (dogSelect) {
    dogSelect.value = getActiveDog().id;
    dogSelect.addEventListener('change', (e) => {
      setActiveDog(e.target.value);
      renderStats();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (openWeightBtn && weightModal) {
    openWeightBtn.addEventListener('click', () => {
      if (weightForm) weightForm.reset();
      openModal(weightModal);
    });
  }

  if (weightForm && weightModal) {
    weightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weightVal = parseFloat(document.getElementById('new-weight-val')?.value || '0');
      if (weightVal > 0) {
        const dog = getActiveDog();
        dog.weight = weightVal;
        const dogs = getDogsList().map(d => d.id === dog.id ? dog : d);
        saveDogsList(dogs);
        closeModal(weightModal);
        showToast(`Ny vikt (${weightVal} kg) sparad för ${dog.name}! ⚖️`, '🎉');
        renderStats();
      }
    });
  }

  window.renderStats = renderStats;
  renderStats();
}

/* ============================================================================
   SECTION 09: DOG HEALTH JOURNAL & ALLERGEN ENGINE (portal.html)
   ============================================================================ */

function initPortalPage() {
  if (typeof document === 'undefined') return;
  const portalMain = document.querySelector('.portal-main') || document.getElementById('portalGreetingHeading');
  if (!portalMain) return;

  const dateEl = document.getElementById('portalCurrentDate');
  const greetingEl = document.getElementById('portalGreetingHeading');
  const greetingSub = document.getElementById('portalGreetingSub');
  const activeDogEmoji = document.getElementById('activeDogEmoji');
  const activeDogNameEl = document.getElementById('activeDogName');
  const switchDogBtn = document.getElementById('switchDogBtn');
  const dogSwitchModal = document.getElementById('dog-switch-modal');
  const closeDogSwitchBtn = document.getElementById('close-dog-switch-modal-btn');
  const confirmDogSwitchBtn = document.getElementById('confirm-dog-switch-btn');

  // Allergy Modal
  const openAllergyModalBtn = document.getElementById('openAllergyModalBtn');
  const editAllergyBtn = document.getElementById('editAllergyBtn');
  const allergyModal = document.getElementById('allergy-modal');
  const closeAllergyBtn = document.getElementById('close-allergy-modal-btn');
  const cancelAllergyBtn = document.getElementById('cancel-allergy-modal-btn');
  const allergyForm = document.getElementById('allergy-form');

  /* ==========================================
     1. HÄLSNING & AKTIV HUND RENDERING
     ========================================== */
  function renderPortalDashboard() {
    const now = new Date();
    if (dateEl) dateEl.textContent = formatHumanDate(now, currentLang);

    const hour = now.getHours();
    let greeting = 'God morgon';
    if (hour >= 12 && hour < 17) greeting = 'God eftermiddag';
    else if (hour >= 17 || hour < 5) greeting = 'God kväll';

    const activeDog = getActiveDog();
    const currentUser = safeStorage.get(STORAGE_KEYS.AUTH_USER, { name: 'Maria' });

    if (greetingEl) greetingEl.innerHTML = `${greeting}, <span id="portalGreetingName">${escapeHtml(currentUser.name || 'Maria')}</span> <span>👋</span>`;
    if (greetingSub) greetingSub.textContent = `Här är en samlad överblick över ${activeDog.name}s dag, rutiner och välmående.`;
    if (activeDogEmoji) activeDogEmoji.textContent = activeDog.avatarEmoji || '🐶';
    if (activeDogNameEl) activeDogNameEl.textContent = activeDog.name;

    // Update Dog Tag
    const dogSubTag = document.querySelector('.dog-sub-tag');
    if (dogSubTag) dogSubTag.textContent = `${activeDog.breed} · ${calculateAge(activeDog.birthdate, currentLang)}`;

    // 2. Render Allergy & Diet Box
    renderAllergyBox(activeDog);

    // 3. Render Upcoming Routines
    renderPortalRoutines(activeDog);

    // 4. Render Week Movement Stats
    renderPortalWeekStats(activeDog);

    // 5. Render Recent Activities Feed
    renderPortalRecentFeed(activeDog);
    const portalBadgesBox = document.getElementById("portalBadgesShowcase");
    if (portalBadgesBox) renderBadgesShowcase(portalBadgesBox, activeDog.id);
  }

  function renderAllergyBox(dog) {
    const allergyTagsWrap = document.getElementById('portalAllergyTags');
    const dietText = document.getElementById('portalDietText');
    const allergyNotes = document.getElementById('portalAllergyNotes');
    const quickSummary = document.getElementById('quickAllergySummary');

    const allergies = dog.allergies || (dog.id === 'bella' ? 'Kycklingprotein, Spannmålsfritt' : 'Inga kända allergier');
    const diet = dog.food || (dog.id === 'bella' ? 'Veterinärfoder: Hypoallergent Lamm & Ris (Spannmålsfritt).' : 'Standard fullfoder');
    const notes = dog.dietNotes || 'Ge inte godisbitar med kycklingbuljong eller vetemjöl. Vid belöning: använd lammgodis.';

    if (allergyTagsWrap) {
      if (allergies.includes('Inga')) {
        allergyTagsWrap.innerHTML = '<span class="allergy-badge" style="background:#eef7ee; color:#2d6a4f;">✓ Inga kända allergier</span>';
        if (quickSummary) quickSummary.textContent = 'Inga kända allergier';
      } else {
        const list = allergies.split(',');
        allergyTagsWrap.innerHTML = list.map(a => `
          <span class="allergy-badge ${a.toLowerCase().includes('kyckling') ? 'danger-badge' : 'warning-badge'}">
            ⚠️ ${escapeHtml(a.trim())}
          </span>
        `).join('');
        if (quickSummary) quickSummary.textContent = `${list.length} registrerade allergier`;
      }
    }

    if (dietText) dietText.textContent = diet;
    if (allergyNotes) allergyNotes.textContent = notes;
  }

  function renderPortalRoutines(dog) {
    const routinesList = document.getElementById('upcomingRoutinesList');
    if (!routinesList) return;

    const events = safeStorage.get(STORAGE_KEYS.CALENDAR_EVENTS, []).filter(e => !e.dogId || e.dogId === dog.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events.filter(e => new Date(e.date + 'T00:00:00') >= today).slice(0, 3);

    if (upcoming.length === 0) {
      routinesList.innerHTML = '<p class="text-muted" style="font-size:13px; margin:8px 0;">Inga kommande rutiner schemalagda. Klicka på "+ Ny påminnelse" ovan!</p>';
      return;
    }

    routinesList.innerHTML = upcoming.map(e => {
      const eDate = new Date(e.date + 'T00:00:00');
      const diffDays = Math.round((eDate - today) / (1000 * 60 * 60 * 24));
      const dayNum = eDate.getDate();
      const monthShort = eDate.toLocaleString('sv-SE', { month: 'short' }).toUpperCase();

      let dueText = `om ${diffDays} dagar`;
      if (diffDays === 0) dueText = 'Idag';
      else if (diffDays === 1) dueText = 'Imorgon';

      const isCare = e.category === 'care';
      const isHealth = e.category === 'health';
      const icon = isCare ? '✂' : (isHealth ? '🩺' : '♥');
      const iconClass = isCare ? 'pink-icon' : (isHealth ? 'yellow-icon' : 'green-icon');

      return `
        <article class="routine-item" id="portal-routine-${e.id}">
          <span class="date-chip">
            <b>${dayNum}</b>
            <small>${monthShort}</small>
          </span>
          <span class="routine-icon ${iconClass}">${icon}</span>
          <div class="routine-info">
            <strong>${escapeHtml(e.title)}</strong>
            <small>För ${escapeHtml(dog.name)} · <span class="due-tag">${dueText}</span></small>
          </div>
          <button type="button" class="btn-check-routine" onclick="window.completePortalRoutine('${e.id}')" title="Markera som klar">
            <span class="check-box-icon">○</span>
            <span class="check-text">Klar</span>
          </button>
        </article>
      `;
    }).join('');
  }

  function renderPortalWeekStats(dog) {
    const walks = safeStorage.get(STORAGE_KEYS.WALK_LOGS, []).filter(w => !w.dogId || w.dogId === dog.id);
    const totalDist = walks.reduce((a, b) => a + (b.distance || 0), 0);
    const totalMins = walks.reduce((a, b) => a + (b.duration || 0), 0);

    const weekWalksCount = document.getElementById('portalWeekWalksCount');
    const weekDistance = document.getElementById('portalWeekDistanceKm');
    const weekHours = document.getElementById('portalWeekActiveHours');

    if (weekWalksCount) weekWalksCount.textContent = walks.length;
    if (weekDistance) weekDistance.textContent = totalDist.toFixed(1).replace('.', ',');
    if (weekHours) weekHours.textContent = formatDuration(totalMins, currentLang);
  }

  function renderPortalRecentFeed(dog) {
    const recentContainer = document.getElementById('portalRecentList');
    if (!recentContainer) return;

    const walks = safeStorage.get(STORAGE_KEYS.WALK_LOGS, []).filter(w => !w.dogId || w.dogId === dog.id);
    const activities = safeStorage.get(STORAGE_KEYS.ACTIVITY_LOGS, []).filter(a => !a.dogId || a.dogId === dog.id);

    const combined = [
      ...walks.map(w => ({ ...w, kind: 'walk' })),
      ...activities.map(a => ({ ...a, kind: 'activity' }))
    ].sort((a, b) => new Date(b.datetime || 0) - new Date(a.datetime || 0)).slice(0, 3);

    if (combined.length === 0) {
      recentContainer.innerHTML = '<p class="text-muted" style="font-size:13px; margin:8px 0;">Inga loggade händelser ännu.</p>';
      return;
    }

    recentContainer.innerHTML = combined.map(item => {
      const isWalk = item.kind === 'walk';
      const icon = isWalk ? '🐾' : (item.category === 'scent' ? '👃' : '✦');
      const dotClass = isWalk ? 'green-dot' : 'purple-dot';
      const sub = isWalk ? `${item.duration} min · ${item.distance} km` : `${item.duration} min · Mental berikning`;
      const timeStr = formatRelativeTime(item.datetime, currentLang);

      return `
        <article class="recent-item">
          <span class="recent-icon ${dotClass}">${icon}</span>
          <div class="recent-text">
            <strong>${escapeHtml(item.type)}</strong>
            <small>${sub}</small>
          </div>
          <time>${timeStr}</time>
        </article>
      `;
    }).join('');
  }

  /* ==========================================
     2. EVENT HANDLERS & MODALER
     ========================================== */
  window.completePortalRoutine = (id) => {
    let events = safeStorage.get(STORAGE_KEYS.CALENDAR_EVENTS, []);
    const target = events.find(e => e.id === id);
    if (target && target.repeat && target.repeat !== 'none') {
      const d = new Date(target.date);
      d.setDate(d.getDate() + 14);
      target.date = d.toISOString().slice(0, 10);
    } else {
      events = events.filter(e => e.id !== id);
    }
    safeStorage.set(STORAGE_KEYS.CALENDAR_EVENTS, events);

    showToast('Rutinen klarmarkerad! Snyggt jobbat! 🐾', '✓');
    celebrateConfetti();
    renderPortalDashboard();
  };

  // Dog Switch Modal
  function populateDogSwitchModal() {
    const listContainer = document.querySelector('.dog-select-list');
    if (!listContainer) return;

    const dogs = getDogsList();
    const activeDog = getActiveDog();

    listContainer.innerHTML = dogs.map(dog => {
      const isActive = dog.id === activeDog.id;
      return `
        <button type="button" class="dog-select-item ${isActive ? 'active' : ''}" onclick="window.selectDogInPortal('${dog.id}')">
          <span style="font-size: 28px;">${dog.avatarEmoji || '🐕'}</span>
          <div style="text-align: left; flex: 1;">
            <strong>${escapeHtml(dog.name)}</strong>
            <small style="display: block; color: var(--muted);">${escapeHtml(dog.breed)} · ${calculateAge(dog.birthdate, currentLang)}</small>
          </div>
          <span style="color: ${isActive ? 'var(--green)' : 'var(--muted)'}; font-weight: 700; font-size:12px;">
            ${isActive ? 'Aktiv ✓' : 'Välj'}
          </span>
        </button>
      `;
    }).join('');
  }

  window.selectDogInPortal = (dogId) => {
    setActiveDog(dogId);
    celebrateConfetti();
    closeModal(dogSwitchModal);
    renderPortalDashboard();
  };

  if (switchDogBtn && dogSwitchModal) {
    switchDogBtn.addEventListener('click', () => {
      populateDogSwitchModal();
      openModal(dogSwitchModal);
    });
  }

  if (closeDogSwitchBtn && dogSwitchModal) closeDogSwitchBtn.addEventListener('click', () => closeModal(dogSwitchModal));
  if (confirmDogSwitchBtn && dogSwitchModal) confirmDogSwitchBtn.addEventListener('click', () => closeModal(dogSwitchModal));

  // Allergy Modal Handlers
  if (openAllergyModalBtn && allergyModal) {
    openAllergyModalBtn.addEventListener('click', () => openModal(allergyModal));
  }
  if (editAllergyBtn && allergyModal) {
    editAllergyBtn.addEventListener('click', () => openModal(allergyModal));
  }
  if (closeAllergyBtn && allergyModal) closeAllergyBtn.addEventListener('click', () => closeModal(allergyModal));
  if (cancelAllergyBtn && allergyModal) cancelAllergyBtn.addEventListener('click', () => closeModal(allergyModal));

  if (allergyForm && allergyModal) {
    allergyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkboxes = allergyForm.querySelectorAll('input[name="allergens"]:checked');
      const selectedAllergens = Array.from(checkboxes).map(cb => cb.value);
      const customAllergy = document.getElementById('custom-allergy-input')?.value.trim();
      if (customAllergy) selectedAllergens.push(customAllergy);

      const diet = document.getElementById('diet-name-input')?.value.trim() || 'Standard foder';
      const safetyNotes = document.getElementById('safety-notes-input')?.value.trim() || '';

      const activeDog = getActiveDog();
      activeDog.allergies = selectedAllergens.length > 0 ? selectedAllergens.join(', ') : 'Inga kända allergier';
      activeDog.food = diet;
      activeDog.dietNotes = safetyNotes;

      const dogs = getDogsList().map(d => d.id === activeDog.id ? activeDog : d);
      saveDogsList(dogs);

      closeModal(allergyModal);
      showToast(`Hälso- och foderinformation sparad för ${activeDog.name}! 🌾`, '✓');
      celebrateConfetti();
      renderPortalDashboard();
    });
  }

  // Food Safety & Allergen Quick Search
  const foodSearchInput = document.getElementById('food-search-input');
  const foodResultsBox = document.getElementById('food-search-results');

  const FOOD_SAFETY_DB = [
    { name: 'Morot', safe: true, note: 'Superbra tugg och kalorisnål belöning rik på fibrer och betakaroten.' },
    { name: 'Äpple (utan kärnor)', safe: true, note: 'Gott och krispigt. Undvik alltid kärnorna som innehåller cyanid.' },
    { name: 'Blåbär', safe: true, note: 'Antioxidantrik supermat för hundar som stärker immunförsvaret.' },
    { name: 'Gurka', safe: true, note: 'Kalorifattig och vätskegivande sommarsnacks.' },
    { name: 'Kokt pumpa', safe: true, note: 'Skonsamt för känsliga magar och reglerar tarmfloran.' },
    { name: 'Choklad', safe: false, note: 'GIFTIGT! Innehåller teobromin som hundar inte kan bryta ner.' },
    { name: 'Vindruvor & Russin', safe: false, note: 'LIVSFARLIGT! Kan orsaka akut och plötslig njursvikt.' },
    { name: 'Lök & Vitlök', safe: false, note: 'GIFTIGT! Innehåller tiosulfat som förstör de röda blodkropparna.' },
    { name: 'Xylitol (Björksocker)', safe: false, note: 'AKUT GIFTIGT! Orsakar kraftigt blodsockerfall och leverskador.' },
    { name: 'Avokado', safe: false, note: 'Innehåller persin som kan orsaka magproblem och andningssvårigheter.' }
  ];

  if (foodSearchInput && foodResultsBox) {
    foodSearchInput.addEventListener('input', debounce((e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        foodResultsBox.innerHTML = '';
        foodResultsBox.style.display = 'none';
        return;
      }

      const matches = FOOD_SAFETY_DB.filter(f => f.name.toLowerCase().includes(q));
      if (matches.length === 0) {
        foodResultsBox.innerHTML = '<p class="text-muted" style="padding:10px; margin:0; font-size:13px;">Inget resultat hittat. Rådfråga alltid veterinär eller Giftinformationscentralen (010-456 6700) vid osäkerhet.</p>';
      } else {
        foodResultsBox.innerHTML = matches.map(m => `
          <div class="food-result-item ${m.safe ? 'food-safe' : 'food-toxic'}" style="padding:10px 14px; margin:4px 0; border-radius:10px; background:${m.safe ? '#d8f3dc' : '#fee2e2'}; border:1px solid ${m.safe ? '#86efac' : '#fca5a5'};">
            <strong style="color:${m.safe ? '#166534' : '#991b1b'}; font-size:13.5px;">${m.safe ? '✅ Ätbart & Hälsosamt: ' : '❌ GIFTIGT / FARLIGT: '} ${escapeHtml(m.name)}</strong>
            <p style="margin:3px 0 0; font-size:12.5px; color:${m.safe ? '#1b4332' : '#7f1d1d'};">${escapeHtml(m.note)}</p>
          </div>
        `).join('');
      }
      foodResultsBox.style.display = 'block';
    }, 150));
  }

  // Initial render
  renderPortalDashboard();
}

/* ============================================================================
   SECTION 10: DOG PROFILES & VACCINATIONS ENGINE (dogs.html)
   ============================================================================ */

function initDogsPage() {
  if (typeof document === 'undefined') return;
  const dogProfilesContainer = document.getElementById('dogProfilesContainer');
  if (!dogProfilesContainer) return;

  const addDogBtn = document.getElementById('add-dog-button');
  const addDogModal = document.getElementById('add-dog-modal');
  const addDogForm = document.getElementById('add-dog-form');
  const closeAddDogBtn = document.getElementById('close-add-dog-modal');
  const cancelAddDogBtn = document.getElementById('cancel-add-dog-btn');

  // Edit Modal
  const editDogModal = document.getElementById('edit-dog-modal');
  const editDogForm = document.getElementById('edit-dog-form');
  const closeEditDogBtn = document.getElementById('close-edit-dog-modal');
  const deleteDogBtn = document.getElementById('delete-dog-btn');

  // Weight Modal
  const openWeightBtn = document.getElementById('open-weight-log-modal-btn');
  const weightModal = document.getElementById('weight-modal');
  const weightForm = document.getElementById('dog-weight-form');
  const closeWeightBtn = document.getElementById('close-weight-modal-btn');

  // Default historical weight logs if none exist
  const DEFAULT_WEIGHT_LOGS = {
    'bella': [
      { date: '2026-03-15', weight: 27.8 },
      { date: '2026-04-20', weight: 28.0 },
      { date: '2026-05-18', weight: 28.2 },
      { date: '2026-06-25', weight: 28.1 },
      { date: '2026-07-20', weight: 28.4 },
      { date: '2026-08-30', weight: 28.5 }
    ],
    'buster': [
      { date: '2026-05-10', weight: 12.0 },
      { date: '2026-06-12', weight: 12.1 },
      { date: '2026-07-15', weight: 12.3 },
      { date: '2026-08-30', weight: 12.2 }
    ],
    'sigge': [
      { date: '2026-04-10', weight: 18.2 },
      { date: '2026-06-01', weight: 18.7 },
      { date: '2026-08-30', weight: 19.0 }
    ]
  };

  function getWeightLogs(dogId) {
    const all = safeStorage.get(STORAGE_KEYS.WEIGHT_LOGS, DEFAULT_WEIGHT_LOGS);
    return all[dogId] || [
      { date: '2026-08-30', weight: getActiveDog().weight || 20.0 }
    ];
  }

  function saveWeightLog(dogId, newEntry) {
    const all = safeStorage.get(STORAGE_KEYS.WEIGHT_LOGS, DEFAULT_WEIGHT_LOGS);
    if (!all[dogId]) all[dogId] = [];
    all[dogId].push(newEntry);
    safeStorage.set(STORAGE_KEYS.WEIGHT_LOGS, all);
  }

  /* ==========================================
     1. RENDERING AV HUNDKORT & PROFILER
     ========================================== */
  function renderDogsPage() {
    const dogs = getDogsList();
    const activeDog = getActiveDog();
    updateActiveDogGlobalUI();

    // 1. Render Dog Cards
    let cardsHtml = dogs.map(dog => {
      const isActive = (dog.id === activeDog.id);
      const ageStr = calculateAge(dog.birthdate, currentLang);
      const chipNum = dog.chipNumber || '752098100' + Math.floor(100000 + Math.random() * 900000);
      const insuranceName = dog.insurance || 'Agria Djurförsäkring';
      const allergies = dog.allergies || (dog.id === 'bella' ? 'Kycklingprotein, Spannmålsfritt' : (dog.id === 'buster' ? 'Känslig mage' : 'Inga kända allergier'));
      const foodDesc = dog.food || (dog.id === 'bella' ? 'Hypoallergent lammfoder 2 ggr dagligen' : 'Standard fullfoder');

      return `
        <article class="dog-main-card ${isActive ? 'active-dog-card' : 'secondary-dog-card'}" id="dog-card-${dog.id}">
          <div class="dog-card-header">
            ${isActive ? '<span class="active-badge">● AKTIV HUND</span>' : '<span class="inactive-badge">FAMILJEMEDLEM</span>'}
            <div class="dog-card-top-actions">
              ${!isActive ? `<button type="button" class="btn btn-primary btn-xs" onclick="window.setActiveDogProfile('${dog.id}')">Gör aktiv ✓</button>` : ''}
              <button type="button" class="btn btn-outline btn-xs" onclick="window.openEditDogModal('${dog.id}')">✏️ Redigera</button>
            </div>
          </div>

          <div class="dog-hero-section">
            <div class="dog-portrait-avatar-wrap" onclick="window.triggerDogPhotoUpload('${dog.id}', true)" title="Klicka för att byta profilfoto (Auto-komprimeras)">
              ${dog.photoUrl ? `<img src="${dog.photoUrl}" alt="${escapeHtml(dog.name)}" class="dog-portrait-avatar-img">` : (dog.id === 'bella' ? '<img src="images/bella-golden.jpg" alt="Bella" class="dog-portrait-avatar-img">' : (dog.id === 'buster' ? '<img src="images/buster-jackrussell.jpg" alt="Buster" class="dog-portrait-avatar-img">' : (dog.id === 'sigge' ? '<img src="images/sigge-bordercollie.jpg" alt="Sigge" class="dog-portrait-avatar-img">' : `<span style="font-size:40px;">${dog.avatarEmoji || '🐕'}</span>`)))}
              <span class="dog-avatar-camera-btn">📷 Byt</span>
            </div>
            <div class="dog-primary-details">
              <h2>${escapeHtml(dog.name)}</h2>
              <p class="dog-breed-gender">${escapeHtml(dog.breed)} · ${escapeHtml(dog.gender || 'Tik')}</p>
              <div class="dog-vital-chips">
                <span class="vital-chip">🎂 <b>${ageStr}</b> (${formatHumanDate(dog.birthdate, currentLang)})</span>
                <span class="vital-chip">⚖️ <b>${dog.weight} kg</b></span>
              </div>
            </div>
          </div>

          <div class="dog-id-insurance-grid">
            <div class="info-block">
              <small class="info-label">CHIPPNUMMER (ID)</small>
              <div class="copyable-code-row">
                <code>${escapeHtml(chipNum)}</code>
                <button type="button" class="btn-copy-chip" onclick="window.copyDogChip('${escapeHtml(chipNum)}')">📋 Kopiera</button>
              </div>
            </div>

            <div class="info-block">
              <small class="info-label">FÖRSÄKRING</small>
              <strong class="info-text">${escapeHtml(insuranceName)}</strong>
              <small class="sub-info">Polisnr: #${dog.policyNumber || 'AG-948102'}</small>
            </div>

            <div class="info-block">
              <small class="info-label">VACCINATIONSSTATUS</small>
              <strong class="info-text" style="color:var(--green);">✓ DHPPI giltig</strong>
              <small class="sub-info">Förnyas: Maj 2027</small>
            </div>
          </div>

          <div class="dog-allergy-health-box">
            <div class="allergy-box-header">
              <div>
                <small class="allergy-box-label">🌾 MATALLERGIER & SPECIALKOST</small>
                <div class="allergy-badges-list">
                  ${allergies.includes('Inga') ? '<span class="allergy-badge" style="background:#eef7ee; color:#2d6a4f;">✓ Inga kända allergier</span>' : allergies.split(',').map(a => `<span class="allergy-badge ${a.toLowerCase().includes('kyckling') ? 'danger-badge' : 'warning-badge'}">⚠️ ${escapeHtml(a.trim())}</span>`).join('')}
                </div>
              </div>
            </div>
            <p class="diet-summary-text"><b>Foder:</b> ${escapeHtml(foodDesc)}</p>
          </div>

          <div class="dog-card-actions-footer">
            ${isActive ? `
              <a href="portal.html" class="btn btn-primary btn-sm">Gå till ${escapeHtml(dog.name)}s dashboard →</a>
              <a href="statistics.html" class="btn btn-outline btn-sm">📊 Hälsostatistik</a>
              <a href="calendar.html" class="btn btn-outline btn-sm">📅 Kalender</a>
            ` : `
              <button type="button" class="btn btn-outline btn-sm" style="width:100%;" onclick="window.setActiveDogProfile('${dog.id}')">Välj ${escapeHtml(dog.name)} som aktiv hund ✓</button>
            `}
          </div>
        </article>
      `;
    }).join('');

    // Add "Ge plats åt en till hund" card
    cardsHtml += `
      <article class="add-new-dog-card" id="open-add-dog-card-btn" onclick="window.openAddDogModal()">
        <div class="add-dog-icon-circle">+</div>
        <h3>Ge plats åt en till hund</h3>
        <p>Skapa en separat profil för en annan hund i familjen med egen kalender, viktkurva och matallergier.</p>
        <button class="btn btn-outline btn-sm" type="button">+ Lägg till hund</button>
      </article>
    `;

    dogProfilesContainer.innerHTML = cardsHtml;

    // 2. Active Dog Quick Overview
    const quickEyebrow = document.getElementById('quickOverviewDogEyebrow');
    const miniWeight = document.getElementById('miniCurrentWeight');
    const bigWeight = document.getElementById('bigWeightNumber');
    const weightCardHeading = document.getElementById('weightCardHeading');
    
    if (quickEyebrow) quickEyebrow.textContent = `För aktiv hund (${activeDog.name})`;
    if (miniWeight) miniWeight.textContent = `${activeDog.weight} kg`;
    if (bigWeight) bigWeight.textContent = `${activeDog.weight}`.replace('.', ',');
    if (weightCardHeading) weightCardHeading.textContent = `${activeDog.name}s viktutveckling`;

    // 3. Render SVG Weight Trend Chart
    renderWeightChart(activeDog);
    const dogsBadgesBox = document.getElementById("dogsBadgesShowcase");
    if (dogsBadgesBox) renderBadgesShowcase(dogsBadgesBox, activeDog.id);
    const galleryContainer = document.getElementById("dogsPhotoGallerySection");
    if (galleryContainer) renderDogPhotoGallery(galleryContainer, activeDog.id);
  }

  function renderWeightChart(dog) {
    const chartContainer = document.getElementById('dogWeightChartContainer');
    if (!chartContainer) return;

    const weights = getWeightLogs(dog.id);
    if (weights.length === 0) {
      chartContainer.innerHTML = '<p class="text-muted">Ingen vikthistorik registrerad ännu.</p>';
      return;
    }

    const minWeight = Math.min(...weights.map(w => w.weight)) - 1.0;
    const maxWeight = Math.max(...weights.map(w => w.weight)) + 1.0;
    const range = Math.max(1, maxWeight - minWeight);

    const svgWidth = 480;
    const svgHeight = 120;
    const paddingX = 40;
    const paddingY = 20;
    const usableWidth = svgWidth - paddingX * 2;
    const usableHeight = svgHeight - paddingY * 2;

    const points = weights.map((item, idx) => {
      const x = paddingX + (idx / Math.max(1, weights.length - 1)) * usableWidth;
      const y = svgHeight - paddingY - ((item.weight - minWeight) / range) * usableHeight;
      return { x, y, weight: item.weight, date: item.date };
    });

    const pathData = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    chartContainer.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="120" style="overflow:visible;">
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="weightLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#52b788" />
            <stop offset="100%" stop-color="#2d6a4f" />
          </linearGradient>
        </defs>

        <!-- Connecting line -->
        <path d="${pathData}" fill="none" stroke="url(#weightLineGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Data points -->
        ${points.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="${i === points.length - 1 ? '6' : '4.5'}" fill="${i === points.length - 1 ? '#2d6a4f' : '#52b788'}" stroke="#ffffff" stroke-width="2" />
          <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="11" font-weight="700" fill="#2d6a4f">${p.weight}kg</text>
          <text x="${p.x}" y="${svgHeight - 2}" text-anchor="middle" font-size="10" fill="#6c757d">${p.date.slice(5)}</text>
        `).join('')}
      </svg>
    `;
  }

  /* ==========================================
     2. EVENT HANDLERS & MODALER
     ========================================== */
  window.openAddDogModal = () => {
    if (addDogForm) addDogForm.reset();
    openModal(addDogModal);
  };

  window.setActiveDogProfile = (dogId) => {
    setActiveDog(dogId);
    celebrateConfetti();
    renderDogsPage();
  };

  window.copyDogChip = (code) => {
    copyToClipboard(code, `Chippnummer (${code}) kopierat till urklipp!`);
  };

  window.openEditDogModal = (dogId) => {
    const dogs = getDogsList();
    const dog = dogs.find(d => d.id === dogId);
    if (!dog) return;

    const idInput = document.getElementById('edit-dog-id');
    const nameInput = document.getElementById('edit-dog-name');
    const breedInput = document.getElementById('edit-dog-breed');
    const genderSelect = document.getElementById('edit-dog-gender');
    const birthInput = document.getElementById('edit-dog-birth');
    const weightInput = document.getElementById('edit-dog-weight');
    const chipInput = document.getElementById('edit-dog-chip');
    const insuranceInput = document.getElementById('edit-dog-insurance');
    const allergiesInput = document.getElementById('edit-dog-allergies');
    const foodInput = document.getElementById('edit-dog-food');

    if (idInput) idInput.value = dog.id;
    if (nameInput) nameInput.value = dog.name;
    if (breedInput) breedInput.value = dog.breed;
    if (genderSelect) genderSelect.value = dog.gender || 'Tik';
    if (birthInput) birthInput.value = dog.birthdate || '';
    if (weightInput) weightInput.value = dog.weight || '';
    if (chipInput) chipInput.value = dog.chipNumber || '';
    if (insuranceInput) insuranceInput.value = dog.insurance || '';
    if (allergiesInput) allergiesInput.value = dog.allergies || '';
    if (foodInput) foodInput.value = dog.food || '';

    openModal(editDogModal);
  };

  if (addDogBtn && addDogModal) {
    addDogBtn.addEventListener('click', () => window.openAddDogModal());
  }
  if (closeAddDogBtn && addDogModal) {
    closeAddDogBtn.addEventListener('click', () => closeModal(addDogModal));
  }
  if (cancelAddDogBtn && addDogModal) {
    cancelAddDogBtn.addEventListener('click', () => closeModal(addDogModal));
  }

  if (closeEditDogBtn && editDogModal) {
    closeEditDogBtn.addEventListener('click', () => closeModal(editDogModal));
  }

  // Add Dog Form Submit
  if (addDogForm && addDogModal) {
    addDogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-dog-name')?.value.trim();
      const breed = document.getElementById('new-dog-breed')?.value.trim();
      const gender = document.getElementById('new-dog-gender')?.value || 'Tik';
      const birthdate = document.getElementById('new-dog-birth')?.value || new Date().toISOString().slice(0, 10);
      const weight = parseFloat(document.getElementById('new-dog-weight')?.value || '15.0');
      const chipNumber = document.getElementById('new-dog-chip')?.value.trim() || '752098100' + Math.floor(100000 + Math.random() * 900000);
      const insurance = document.getElementById('new-dog-insurance')?.value.trim() || 'Agria Djurförsäkring';
      const allergies = document.getElementById('new-dog-allergies')?.value.trim() || 'Inga kända allergier';
      const food = document.getElementById('new-dog-food')?.value.trim() || 'Standard foder';

      if (!name || !breed) {
        showToast('Fyll i hundens namn och ras!', '⚠️');
        return;
      }

      const dogs = getDogsList();
      const newDog = {
        id: generateId('dog'),
        name,
        breed,
        gender,
        birthdate,
        weight,
        chipNumber,
        insurance,
        allergies,
        food,
        avatarEmoji: '🐶'
      };

      dogs.push(newDog);
      saveDogsList(dogs);
      saveWeightLog(newDog.id, { date: new Date().toISOString().slice(0, 10), weight });
      setActiveDog(newDog.id);

      closeModal(addDogModal);
      showToast(`${name} har lagts till i familjen! 🐾`, '🎉');
      celebrateConfetti();
      renderDogsPage();
    });
  }

  // Edit Dog Form Submit
  if (editDogForm && editDogModal) {
    editDogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dogId = document.getElementById('edit-dog-id')?.value;
      const name = document.getElementById('edit-dog-name')?.value.trim();
      const breed = document.getElementById('edit-dog-breed')?.value.trim();
      const gender = document.getElementById('edit-dog-gender')?.value || 'Tik';
      const birthdate = document.getElementById('edit-dog-birth')?.value;
      const weight = parseFloat(document.getElementById('edit-dog-weight')?.value || '0');
      const chipNumber = document.getElementById('edit-dog-chip')?.value.trim();
      const insurance = document.getElementById('edit-dog-insurance')?.value.trim();
      const allergies = document.getElementById('edit-dog-allergies')?.value.trim();
      const food = document.getElementById('edit-dog-food')?.value.trim();

      const dogs = getDogsList();
      const target = dogs.find(d => d.id === dogId);
      if (target) {
        target.name = name || target.name;
        target.breed = breed || target.breed;
        target.gender = gender;
        if (birthdate) target.birthdate = birthdate;
        if (weight > 0) target.weight = weight;
        if (chipNumber) target.chipNumber = chipNumber;
        if (insurance) target.insurance = insurance;
        if (allergies) target.allergies = allergies;
        if (food) target.food = food;

        saveDogsList(dogs);
        closeModal(editDogModal);
        showToast(`Profilen för ${target.name} har uppdaterats! 🐾`, '✓');
        renderDogsPage();
      }
    });
  }

  // Delete Dog Button Handler
  if (deleteDogBtn && editDogModal) {
    deleteDogBtn.addEventListener('click', () => {
      const dogId = document.getElementById('edit-dog-id')?.value;
      let dogs = getDogsList();
      if (dogs.length <= 1) {
        showToast('Du måste ha minst en hundprofil i appen.', '⚠️');
        return;
      }

      const target = dogs.find(d => d.id === dogId);
      if (!target) return;

      if (confirm(`Är du säker på att du vill ta bort profilen för ${target.name}?`)) {
        dogs = dogs.filter(d => d.id !== dogId);
        saveDogsList(dogs);
        if (getActiveDog().id === dogId) {
          setActiveDog(dogs[0].id);
        }
        closeModal(editDogModal);
        showToast(`Profilen för ${target.name} har raderats.`, '🗑️');
        renderDogsPage();
      }
    });
  }

  // Weight Log Modal
  if (openWeightBtn && weightModal) {
    openWeightBtn.addEventListener('click', () => {
      if (weightForm) weightForm.reset();
      const dateInput = document.getElementById('new-weight-date');
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      openModal(weightModal);
    });
  }

  if (closeWeightBtn && weightModal) {
    closeWeightBtn.addEventListener('click', () => closeModal(weightModal));
  }

  if (weightForm && weightModal) {
    weightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weightVal = parseFloat(document.getElementById('new-weight-val')?.value || '0');
      const dateVal = document.getElementById('new-weight-date')?.value || new Date().toISOString().slice(0, 10);

      if (weightVal <= 0) {
        showToast('Ange en giltig vikt i kg!', '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      activeDog.weight = weightVal;
      const dogs = getDogsList().map(d => d.id === activeDog.id ? activeDog : d);
      saveDogsList(dogs);

      saveWeightLog(activeDog.id, { date: dateVal, weight: weightVal });

      closeModal(weightModal);
      showToast(`Ny vikt (${weightVal} kg) sparad för ${activeDog.name}! ⚖️`, '🎉');
      celebrateConfetti();
      renderDogsPage();
    });
  }

  // Exports
  window.renderDogsPage = renderDogsPage;
  window.initDogsPage = initDogsPage;

  // Initial render
  renderDogsPage();
}


/* ==========================================
   BADGES, TASS-STREAKS & DIGITAL COLLAR PASS
   ========================================== */

const BADGES_DATABASE = [
  {
    id: 'badge-forest',
    title: 'Skogsmästaren',
    icon: '🌲',
    desc: 'Logga 10 km i skogsterräng',
    target: 10,
    unit: 'km'
  },
  {
    id: 'badge-streak',
    title: 'Streak-mästaren',
    icon: '🔥',
    desc: 'Promenera 5 dagar i rad',
    target: 5,
    unit: 'dagar'
  },
  {
    id: 'badge-teeth',
    title: 'Tandborsthjälten',
    icon: '🪥',
    desc: 'Genomför 3 tandvårdsrutiner',
    target: 3,
    unit: 'ggr'
  },
  {
    id: 'badge-claws',
    title: 'Klostjärnan',
    icon: '✂️',
    desc: 'Regelbunden klövård 2 ggr',
    target: 2,
    unit: 'ggr'
  },
  {
    id: 'badge-scent',
    title: 'Supernosen',
    icon: '👃',
    desc: '2 nosaktiveringspass',
    target: 2,
    unit: 'pass'
  },
  {
    id: 'badge-explorer',
    title: 'Vardagsäventyraren',
    icon: '🗺️',
    desc: 'Logga 15 km totalt',
    target: 15,
    unit: 'km'
  }
];

function getDogBadgeProgress(dogId) {
  const walks = safeStorage.get(STORAGE_KEYS.WALK_LOGS, []).filter(w => !w.dogId || w.dogId === dogId);
  const activities = safeStorage.get(STORAGE_KEYS.ACTIVITY_LOGS, []).filter(a => !a.dogId || a.dogId === dogId);

  const forestKm = walks.filter(w => (w.surface || '').includes('Skog')).reduce((acc, cur) => acc + (cur.distance || 0), 0);
  const totalKm = walks.reduce((acc, cur) => acc + (cur.distance || 0), 0);
  const scentCount = activities.filter(a => (a.type || '').toLowerCase().includes('nos') || a.category === 'scent').length;

  return {
    'badge-forest': { current: Math.min(10, parseFloat(forestKm.toFixed(1))), unlocked: forestKm >= 10 },
    'badge-streak': { current: Math.min(5, walks.length >= 4 ? 5 : walks.length), unlocked: walks.length >= 4 },
    'badge-teeth': { current: 3, unlocked: true }, // Default achieved
    'badge-claws': { current: 2, unlocked: true }, // Default achieved
    'badge-scent': { current: Math.min(2, scentCount + 1), unlocked: (scentCount + 1) >= 2 },
    'badge-explorer': { current: Math.min(15, parseFloat(totalKm.toFixed(1))), unlocked: totalKm >= 12.0 }
  };
}

function renderBadgesShowcase(containerEl, dogId) {
  if (!containerEl) return;
  const progressData = getDogBadgeProgress(dogId);

  containerEl.innerHTML = BADGES_DATABASE.map(b => {
    const p = progressData[b.id] || { current: 0, unlocked: false };
    const pct = Math.min(100, Math.round((p.current / b.target) * 100));

    return `
      <div class="badge-card ${p.unlocked ? 'unlocked' : 'locked'}" onclick="window.showBadgeDetail('${b.id}')" title="${escapeHtml(b.title)}: ${escapeHtml(b.desc)}">
        <div class="badge-icon-circle">${b.icon}</div>
        <h4 class="badge-title">${escapeHtml(b.title)}</h4>
        <p class="badge-desc">${escapeHtml(b.desc)}</p>
        <div class="badge-progress-bar">
          <div class="badge-progress-fill" style="width:${pct}%;"></div>
        </div>
        ${p.unlocked ? '<span class="badge-unlocked-tag">Upplåst ✓</span>' : `<small style="font-size:10px; color:var(--muted); margin-top:4px;">${p.current} / ${b.target} ${b.unit}</small>`}
      </div>
    `;
  }).join('');
}

window.showBadgeDetail = (badgeId) => {
  const badge = BADGES_DATABASE.find(b => b.id === badgeId);
  if (!badge) return;
  const activeDog = getActiveDog();
  const progressData = getDogBadgeProgress(activeDog.id);
  const p = progressData[badge.id] || { current: 0, unlocked: false };

  if (p.unlocked) {
    showToast(`🏆 ${badge.title} är upplåst för ${activeDog.name}!`, '✨');
    celebrateConfetti();
  } else {
    showToast(`${badge.title}: ${p.current} av ${badge.target} ${badge.unit} avklarat.`, '🎯');
  }
};

/* ==========================================
   SMART DIGITALT HALSBANDSPASS & QR-KOD
   ========================================== */
function generateQrSvg(text) {
  // Clean, crisp vector QR Code pattern with finder patterns
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="QR-kod för halsbandspass">
      <rect width="100" height="100" fill="#ffffff"/>
      <!-- Top-Left Finder -->
      <rect x="10" y="10" width="24" height="24" rx="4" fill="#1b4332"/>
      <rect x="14" y="14" width="16" height="16" rx="2" fill="#ffffff"/>
      <rect x="18" y="18" width="8" height="8" rx="1" fill="#1b4332"/>
      <!-- Top-Right Finder -->
      <rect x="66" y="10" width="24" height="24" rx="4" fill="#1b4332"/>
      <rect x="70" y="14" width="16" height="16" rx="2" fill="#ffffff"/>
      <rect x="74" y="18" width="8" height="8" rx="1" fill="#1b4332"/>
      <!-- Bottom-Left Finder -->
      <rect x="10" y="66" width="24" height="24" rx="4" fill="#1b4332"/>
      <rect x="14" y="70" width="16" height="16" rx="2" fill="#ffffff"/>
      <rect x="18" y="74" width="8" height="8" rx="1" fill="#1b4332"/>
      <!-- Data Dots Matrix -->
      <rect x="40" y="12" width="6" height="6" fill="#1b4332"/>
      <rect x="52" y="12" width="6" height="6" fill="#1b4332"/>
      <rect x="40" y="24" width="6" height="6" fill="#1b4332"/>
      <rect x="46" y="32" width="8" height="8" fill="#52b788"/>
      <rect x="12" y="42" width="6" height="6" fill="#1b4332"/>
      <rect x="24" y="42" width="6" height="6" fill="#1b4332"/>
      <rect x="36" y="46" width="6" height="6" fill="#1b4332"/>
      <rect x="48" y="46" width="8" height="8" fill="#1b4332"/>
      <rect x="60" y="42" width="6" height="6" fill="#1b4332"/>
      <rect x="72" y="46" width="6" height="6" fill="#52b788"/>
      <rect x="84" y="42" width="6" height="6" fill="#1b4332"/>
      <rect x="40" y="60" width="6" height="6" fill="#1b4332"/>
      <rect x="52" y="66" width="6" height="6" fill="#1b4332"/>
      <rect x="64" y="60" width="8" height="8" fill="#1b4332"/>
      <rect x="76" y="66" width="6" height="6" fill="#1b4332"/>
      <rect x="84" y="78" width="6" height="6" fill="#1b4332"/>
      <rect x="46" y="80" width="8" height="8" fill="#52b788"/>
      <rect x="60" y="84" width="6" height="6" fill="#1b4332"/>
      <!-- Center Paw mark -->
      <circle cx="50" cy="50" r="4" fill="#e76f51"/>
    </svg>
  `;
}

window.openCollarPassModal = (dogId) => {
  const dog = getDogsList().find(d => d.id === dogId) || getActiveDog();
  let modal = document.getElementById('collar-pass-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'collar-pass-modal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modal);
  }

  const chipNum = dog.chipNumber || '752098100123456';
  const allergies = dog.allergies || 'Kycklingprotein, Spannmålsfritt';
  const passUrl = `https://hundapp.se/pass/${dog.id}`;

  modal.innerHTML = `
    <div class="modal-box form-modal" style="width:min(100%, 560px); background:#fff; border-radius:24px; padding:32px;">
      <button class="modal-close" onclick="closeModal(document.getElementById('collar-pass-modal'))" type="button" aria-label="Stäng">&times;</button>
      <span class="modal-icon">🏷️</span>
      <p class="eyebrow">Smart Nödbricka &amp; Hundpass</p>
      <h2 style="font-family:'Fraunces',serif; margin:4px 0 16px; color:var(--ink); font-size:22px;">Digitalt Halsbandspass</h2>

      <div class="collar-pass-card">
        <div class="collar-pass-header">
          <div class="collar-pass-brand">
            <span>🐾 HundApp Nödpass</span>
          </div>
          <span class="badge-unlocked-tag">Verifierad ägare ✓</span>
        </div>

        <div class="collar-pass-body">
          <div class="collar-pass-info">
            <h3>${escapeHtml(dog.name)}</h3>
            <p class="collar-pass-meta">${escapeHtml(dog.breed)} · ${calculateAge(dog.birthdate, currentLang)}</p>
            
            <div class="collar-pass-chip">
              <small>CHIPP:</small>
              <code>${escapeHtml(chipNum)}</code>
            </div>

            ${allergies && !allergies.includes('Inga') ? `
              <div class="collar-pass-allergies">
                ⚠️ ALLERGIER: ${escapeHtml(allergies)}
              </div>
            ` : ''}

            <div style="font-size:12px; color:var(--muted); line-height:1.4;">
              <b>Kontaktperson:</b> Maria<br>
              <b>Telefon:</b> <a href="tel:0701234567" style="color:var(--green-dark); font-weight:800; text-decoration:none;">070-123 45 67</a>
            </div>
          </div>

          <div class="qr-code-box">
            ${generateQrSvg(passUrl)}
            <span class="qr-code-caption">Scanna vid nödfall</span>
          </div>
        </div>
      </div>

      <div class="collar-pass-actions">
        <button type="button" class="btn btn-primary" style="flex:1;" onclick="window.copyDogSitterLink('${dog.id}')">
          📋 Kopiera hundvaktslänk
        </button>
        <button type="button" class="btn btn-outline" onclick="window.showToast('Nödpass sparat som bild!', '📱'); celebrateConfetti();">
          📱 Spara till telefon
        </button>
      </div>
    </div>
  `;

  openModal(modal);
};

window.copyDogSitterLink = (dogId) => {
  const dog = getDogsList().find(d => d.id === dogId) || getActiveDog();
  const sitterUrl = `https://hundapp.se/portal.html?guest=sitter&dog=${dog.id}`;
  copyToClipboard(sitterUrl, `Hundvaktslänk för ${dog.name} kopierad till urklipp! 🐾`);
};


/* ============================================================================
   SECTION 11: INTERACTIVE CALENDAR & ROUTINE PLANNER (calendar.html)
   ============================================================================ */

let currentCalDate = new Date();
let activeCalendarFilter = 'all';
let currentCalendarView = 'month'; // 'month' | 'agenda'

const DEFAULT_CALENDAR_EVENTS = [
  {
    id: 'evt-1',
    dogId: 'bella',
    title: 'Morgonpromenad i skogen',
    category: 'walk',
    categoryName: 'Promenad & Träning',
    date: '2026-08-30',
    time: '08:30',
    repeat: 'none',
    note: 'Långrunda i terrängen vid elljusspåret.'
  },
  {
    id: 'evt-2',
    dogId: 'bella',
    title: 'Kloklippning & tassvård',
    category: 'care',
    categoryName: 'Klor & Vård',
    date: '2026-08-31',
    time: '18:00',
    repeat: 'triweekly',
    note: 'Klipp lite i taget, belöna med lammgodis efteråt.'
  },
  {
    id: 'evt-3',
    dogId: 'bella',
    title: 'Fästingdroppar (Månadsdos)',
    category: 'health',
    categoryName: 'Fästing & Medicin',
    date: '2026-09-02',
    time: '09:00',
    repeat: 'monthly',
    note: 'Applicera mellan skulderbladen. Håll torr i 24h.'
  },
  {
    id: 'evt-4',
    dogId: 'bella',
    title: 'Årlig vaccination & hälsokoll',
    category: 'vet',
    categoryName: 'Veterinär & Vaccin',
    date: '2026-09-08',
    time: '14:30',
    repeat: 'yearly',
    note: 'Hos Dalarnas Smådjursklinik. Ta med vaccinationskortet.'
  },
  {
    id: 'evt-5',
    dogId: 'bella',
    title: 'Apportering & kontaktövningar',
    category: 'walk',
    categoryName: 'Promenad & Träning',
    date: '2026-09-05',
    time: '16:00',
    repeat: 'none',
    note: 'Träna stadga och passivitet i parken.'
  }
];

function getCalendarEvents() {
  const list = safeStorage.get(STORAGE_KEYS.CALENDAR_EVENTS);
  if (!list || !Array.isArray(list) || list.length === 0) {
    safeStorage.set(STORAGE_KEYS.CALENDAR_EVENTS, DEFAULT_CALENDAR_EVENTS);
    return DEFAULT_CALENDAR_EVENTS;
  }
  return list;
}

function saveCalendarEvents(events) {
  safeStorage.set(STORAGE_KEYS.CALENDAR_EVENTS, events);
}

function initCalendarPage() {
  if (typeof document === 'undefined') return;
  const calGrid = document.getElementById('calendarMonthGrid') || document.getElementById('calendarDaysGrid') || document.querySelector('.month-grid');
  if (!calGrid) return;

  const agendaList = document.getElementById('calendarAgendaList');
  const monthHeading = document.getElementById('currentMonthYearHeading');
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayJumpBtn');
  const newReminderBtn = document.getElementById('new-reminder-button');
  const quickAddBtn = document.getElementById('quickAddReminderBtn');
  const reminderModal = document.getElementById('reminder-modal');
  const reminderForm = document.getElementById('reminder-form');
  const closeReminderBtn = document.getElementById('close-reminder-modal-btn');
  const cancelReminderBtn = document.getElementById('cancel-reminder-btn');
  const filterBtns = document.querySelectorAll('.cal-filter-btn, [data-cal-filter]');
  const viewBtns = document.querySelectorAll('.view-btn, [data-cal-view]');

  // Detail Modal Elements
  const detailModal = document.getElementById('event-detail-modal');
  const closeDetailBtn = document.getElementById('close-event-detail-btn');
  const detailTitle = document.getElementById('eventDetailTitle');
  const detailDateTime = document.getElementById('eventDetailDateTime');
  const detailCategory = document.getElementById('eventDetailCategory');
  const detailDog = document.getElementById('eventDetailDog');
  const detailNotes = document.getElementById('eventDetailNotes');
  const detailDeleteBtn = document.getElementById('eventDetailDeleteBtn');
  const detailDoneBtn = document.getElementById('eventDetailDoneBtn');
  let selectedEventId = null;

  /* ==========================================
     1. KPI & STATISTIKBERÄKNINGAR
     ========================================== */
  function updateCalendarKPIs(events) {
    const activeDog = getActiveDog();
    const today = new Date();
    const nowMs = today.getTime();
    const sevenDaysMs = nowMs + 7 * 24 * 60 * 60 * 1000;

    // Events this week (next 7 days)
    const thisWeek = events.filter(e => {
      const eDate = new Date(e.date + 'T00:00:00').getTime();
      return eDate >= (nowMs - 24*60*60*1000) && eDate <= sevenDaysMs;
    });

    const healthEvents = events.filter(e => ['care', 'health', 'vet'].includes(e.category));

    const kpiWeekEl = document.getElementById('kpiWeekCount');
    const kpiHealthEl = document.getElementById('kpiHealthCount');
    const kpiNextBdayEl = document.getElementById('kpiNextBirthday');
    const kpiStreakEl = document.getElementById('kpiRoutineStreak');

    if (kpiWeekEl) kpiWeekEl.textContent = `${thisWeek.length} ${thisWeek.length === 1 ? 'aktivitet' : 'aktiviteter'}`;
    if (kpiHealthEl) kpiHealthEl.textContent = `${healthEvents.length} kommande`;
    if (kpiNextBdayEl) kpiNextBdayEl.textContent = `12 apr (${activeDog.name})`;
    if (kpiStreakEl) kpiStreakEl.textContent = '5 dagar i rad';

    // Sidebar active dog updates
    const calDogAvatar = document.getElementById('calDogAvatar');
    const calDogName = document.getElementById('calDogName');
    const calDogMeta = document.getElementById('calDogMeta');
    if (calDogAvatar) calDogAvatar.textContent = activeDog.avatarEmoji || '🐕';
    if (calDogName) calDogName.textContent = activeDog.name;
    if (calDogMeta) calDogMeta.textContent = `${activeDog.breed} · ${calculateAge(activeDog.birthdate, currentLang)}`;
  }

  /* ==========================================
     2. SIDOPANELENS KOMMANDE HÄNDELSER
     ========================================== */
  function renderSidebarUpcoming(events) {
    const sidebarList = document.getElementById('sidebarUpcomingList');
    if (!sidebarList) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events.filter(e => {
      const eDate = new Date(e.date + 'T00:00:00');
      return eDate >= today;
    }).sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00'))).slice(0, 5);

    if (upcoming.length === 0) {
      sidebarList.innerHTML = '<p class="text-muted" style="font-size:12.5px; margin:8px 0;">Inga inbokade rutiner den närmaste tiden.</p>';
      return;
    }

    sidebarList.innerHTML = upcoming.map(e => {
      const eDate = new Date(e.date + 'T00:00:00');
      const diffDays = Math.round((eDate - today) / (1000 * 60 * 60 * 24));
      
      let badgeText = `${diffDays} dgr`;
      if (diffDays === 0) badgeText = 'Idag';
      else if (diffDays === 1) badgeText = 'Imorgon';
      else if (diffDays <= 7) badgeText = `Om ${diffDays} dgr`;
      else badgeText = formatHumanDate(e.date, currentLang);

      const isCare = e.category === 'care';
      const isHealth = e.category === 'health';
      const isVet = e.category === 'vet';
      const icon = isCare ? '✂️' : (isHealth ? '🩺' : (isVet ? '💉' : '🐾'));

      return `
        <div class="side-event-item" onclick="window.openEventDetail('${e.id}')" style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; margin-bottom:6px; background:var(--surface); border:1px solid var(--line); border-radius:10px; cursor:pointer; transition:var(--transition);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:16px;">${icon}</span>
            <div>
              <strong style="display:block; font-size:13px; color:var(--ink);">${escapeHtml(e.title)}</strong>
              <small style="color:var(--muted); font-size:11.5px;">${e.time ? `kl ${e.time}` : formatHumanDate(e.date, currentLang)}</small>
            </div>
          </div>
          <span class="agenda-tag" style="background:#ffffff; font-size:10.5px; font-weight:700; color:var(--green-dark);">${badgeText}</span>
        </div>
      `;
    }).join('');
  }

  /* ==========================================
     3. RENDERING AV MÅNADSRUTNÄT & LISTVY
     ========================================== */
  function renderCalendar() {
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const monthNamesSv = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNames = (currentLang === 'en') ? monthNamesEn : monthNamesSv;

    if (monthHeading) monthHeading.textContent = `${monthNames[month]} ${year}`;

    const activeDog = getActiveDog();
    updateActiveDogGlobalUI();

    const allEvents = getCalendarEvents().filter(e => !e.dogId || e.dogId === activeDog.id);
    updateCalendarKPIs(allEvents);
    renderSidebarUpcoming(allEvents);

    const filteredEvents = allEvents.filter(e => {
      if (activeCalendarFilter === 'all') return true;
      return e.category === activeCalendarFilter;
    });

    if (currentCalendarView === 'agenda') {
      if (calGrid) calGrid.style.display = 'none';
      const weekdaysHeader = document.getElementById('weekdaysHeader');
      if (weekdaysHeader) weekdaysHeader.style.display = 'none';

      if (agendaList) {
        agendaList.style.display = 'flex';
        renderAgendaView(filteredEvents);
      }
      return;
    }

    // Month Grid View
    if (agendaList) agendaList.style.display = 'none';
    const weekdaysHeader = document.getElementById('weekdaysHeader');
    if (weekdaysHeader) weekdaysHeader.style.display = 'grid';
    if (calGrid) calGrid.style.display = 'grid';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1; // Monday = 0
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let gridHtml = '';

    // Empty lead cells
    for (let i = 0; i < adjustedFirstDay; i++) {
      gridHtml += '<div class="cal-day cal-day-empty"></div>';
    }

    // Days of month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);
      const dayEvents = filteredEvents.filter(e => e.date === dateStr);

      gridHtml += `
        <div class="cal-day ${isToday ? 'cal-day-today' : ''}" data-date="${dateStr}" onclick="window.handleDayCellClick('${dateStr}', event)">
          <div class="cal-day-header">
            <span class="cal-day-num">${d}</span>
            ${dayEvents.length > 0 ? `<span class="cal-day-badge">${dayEvents.length}</span>` : ''}
          </div>
          <div class="cal-day-events">
            ${dayEvents.map(e => `
              <div class="cal-event-pill event-cat-${e.category || 'walk'}" onclick="event.stopPropagation(); window.openEventDetail('${e.id}')" title="${escapeHtml(e.title)} (${e.time || ''})">
                <span>${e.time || ''}</span>
                <span>${escapeHtml(e.title)}</span>
              </div>
            `).join('')}
          </div>
          <button type="button" class="day-quick-add-btn" onclick="event.stopPropagation(); window.handleDayCellClick('${dateStr}', event)" title="Lägg till påminnelse denna dag">+</button>
        </div>
      `;
    }

    calGrid.innerHTML = gridHtml;
  }

  function renderAgendaView(events) {
    if (!agendaList) return;

    if (events.length === 0) {
      agendaList.innerHTML = `
        <div style="text-align:center; padding:48px 16px; background:#fff; border-radius:16px; border:1px dashed var(--line);">
          <span style="font-size:36px; display:block; margin-bottom:8px;">📅</span>
          <h3 style="margin:0 0 4px; font-family:'Fraunces',serif;">Inga händelser i denna vy</h3>
          <p style="margin:0; color:var(--muted); font-size:13.5px;">Klicka på "+ Ny påminnelse" för att planera in en aktivitet.</p>
        </div>
      `;
      return;
    }

    // Sort by date and time
    const sorted = [...events].sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));

    agendaList.innerHTML = sorted.map(e => {
      const isCare = e.category === 'care';
      const isHealth = e.category === 'health';
      const isVet = e.category === 'vet';
      const isWalk = e.category === 'walk';
      const isBday = e.category === 'birthday';
      const icon = isCare ? '✂️' : (isHealth ? '🩺' : (isVet ? '💉' : (isBday ? '🎂' : '🐾')));
      const bgIcon = isCare ? '#fce7f3' : (isHealth ? '#fef3c7' : (isVet ? '#dcfce7' : '#d8f3dc'));

      return `
        <article class="agenda-event-card" id="agenda-card-${e.id}">
          <div class="agenda-left-col">
            <div class="agenda-icon-circle" style="background:${bgIcon};">
              ${icon}
            </div>
            <div class="agenda-title-block">
              <h4>${escapeHtml(e.title)}</h4>
              <p>${escapeHtml(e.note || 'Ingen anteckning')}</p>
              <div class="agenda-meta-tags">
                <span class="agenda-tag">📅 ${formatHumanDate(e.date, currentLang)}</span>
                ${e.time ? `<span class="agenda-tag">⏱️ kl ${e.time}</span>` : ''}
                ${e.repeat && e.repeat !== 'none' ? `<span class="agenda-tag">🔁 Återkommande</span>` : ''}
              </div>
            </div>
          </div>

          <div class="agenda-actions-row">
            <button type="button" class="btn btn-outline btn-xs" onclick="window.openEventDetail('${e.id}')">
              Visa detaljer
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ==========================================
     4. MODAL- OCH FORM-HANTERING
     ========================================== */
  window.handleDayCellClick = (dateStr) => {
    if (reminderForm) reminderForm.reset();
    const dateInput = document.getElementById('reminder-date-input');
    if (dateInput) dateInput.value = dateStr;
    openModal(reminderModal);
  };

  if (newReminderBtn && reminderModal) {
    newReminderBtn.addEventListener('click', () => {
      if (reminderForm) reminderForm.reset();
      const dateInput = document.getElementById('reminder-date-input');
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      openModal(reminderModal);
    });
  }

  if (quickAddBtn && reminderModal) {
    quickAddBtn.addEventListener('click', () => {
      if (reminderForm) reminderForm.reset();
      const dateInput = document.getElementById('reminder-date-input');
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      openModal(reminderModal);
    });
  }

  // Quick Routine Sidebar Buttons
  document.querySelectorAll('.quick-routine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (reminderForm) reminderForm.reset();
      const title = btn.getAttribute('data-quick-title');
      const cat = btn.getAttribute('data-quick-cat');
      
      const titleInput = document.getElementById('reminder-title-input');
      const catSelect = document.getElementById('reminder-category-select');
      const dateInput = document.getElementById('reminder-date-input');
      
      if (titleInput && title) titleInput.value = title;
      if (catSelect && cat) catSelect.value = cat;
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
      
      openModal(reminderModal);
    });
  });

  // Suggestion Chips in Modal
  document.querySelectorAll('.sug-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chipText = chip.getAttribute('data-chip') || chip.textContent.trim();
      const titleInput = document.getElementById('reminder-title-input');
      const catSelect = document.getElementById('reminder-category-select');

      if (titleInput) titleInput.value = chipText;
      if (catSelect) {
        if (chipText.includes('Klo')) catSelect.value = 'care';
        else if (chipText.includes('Fästing') || chipText.includes('Tand')) catSelect.value = 'health';
        else if (chipText.includes('Vaccin')) catSelect.value = 'vet';
        else if (chipText.includes('Träna')) catSelect.value = 'walk';
      }
    });
  });

  if (closeReminderBtn && reminderModal) {
    closeReminderBtn.addEventListener('click', () => closeModal(reminderModal));
  }
  if (cancelReminderBtn && reminderModal) {
    cancelReminderBtn.addEventListener('click', () => closeModal(reminderModal));
  }

  // Reminder Form Submit
  if (reminderForm && reminderModal) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('reminder-title-input')?.value.trim();
      const category = document.getElementById('reminder-category-select')?.value || 'care';
      const date = document.getElementById('reminder-date-input')?.value || new Date().toISOString().slice(0, 10);
      const time = document.getElementById('reminder-time-input')?.value || '09:00';
      const repeat = document.getElementById('reminder-repeat-select')?.value || 'none';
      const note = document.getElementById('reminder-notes-input')?.value.trim() || '';

      if (!title) {
        showToast('Ange en rubrik för påminnelsen!', '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const events = getCalendarEvents();
      events.push({
        id: generateId('evt'),
        dogId: activeDog.id,
        title,
        category,
        date,
        time,
        repeat,
        note
      });
      saveCalendarEvents(events);

      closeModal(reminderModal);
      showToast(`Påminnelse inbokad för ${activeDog.name}! 📅`, '🎉');
      celebrateConfetti();
      renderCalendar();
    });
  }

  /* ==========================================
     5. EVENT DETAIL MODAL
     ========================================== */
  window.openEventDetail = (id) => {
    const events = getCalendarEvents();
    const event = events.find(e => e.id === id);
    if (!event) return;

    selectedEventId = id;
    const activeDog = getActiveDog();

    if (detailTitle) detailTitle.textContent = event.title;
    if (detailDateTime) detailDateTime.textContent = `${formatHumanDate(event.date, currentLang)}${event.time ? ` kl ${event.time}` : ''}`;
    if (detailCategory) {
      const catMap = { care: '✂️ Klor & Vård', health: '🩺 Fästing & Medicin', vet: '💉 Veterinär & Vaccin', walk: '🐾 Promenad & Träning', birthday: '🎂 Födelsedag', other: '✦ Övrigt' };
      detailCategory.textContent = catMap[event.category] || event.category;
    }
    if (detailDog) detailDog.textContent = activeDog.name;
    if (detailNotes) detailNotes.textContent = event.note || 'Ingen anteckning sparad.';

    if (detailModal) openModal(detailModal);
  };

  if (closeDetailBtn && detailModal) {
    closeDetailBtn.addEventListener('click', () => closeModal(detailModal));
  }

  if (detailDeleteBtn && detailModal) {
    detailDeleteBtn.addEventListener('click', () => {
      if (!selectedEventId) return;
      let events = getCalendarEvents();
      events = events.filter(e => e.id !== selectedEventId);
      saveCalendarEvents(events);
      closeModal(detailModal);
      showToast('Händelsen har tagits bort från kalendern.', '🗑️');
      renderCalendar();
    });
  }

  if (detailDoneBtn && detailModal) {
    detailDoneBtn.addEventListener('click', () => {
      if (!selectedEventId) return;
      let events = getCalendarEvents();
      const target = events.find(e => e.id === selectedEventId);
      
      // If recurring, advance date
      if (target && target.repeat && target.repeat !== 'none') {
        const curDate = new Date(target.date);
        if (target.repeat === 'weekly') curDate.setDate(curDate.getDate() + 7);
        else if (target.repeat === 'biweekly') curDate.setDate(curDate.getDate() + 14);
        else if (target.repeat === 'triweekly') curDate.setDate(curDate.getDate() + 21);
        else if (target.repeat === 'monthly') curDate.setMonth(curDate.getMonth() + 1);
        else if (target.repeat === 'yearly') curDate.setFullYear(curDate.getFullYear() + 1);
        target.date = curDate.toISOString().slice(0, 10);
        showToast('Rutinen klarmarkerad och framflyttad till nästa intervall! 🎉', '✓');
      } else {
        events = events.filter(e => e.id !== selectedEventId);
        showToast('Rutinen klarmarkerad och sparad som utförd! 🎉', '✓');
      }

      saveCalendarEvents(events);
      celebrateConfetti();
      closeModal(detailModal);
      renderCalendar();
    });
  }

  /* ==========================================
     6. FILTER & VY-VÄXLING
     ========================================== */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCalendarFilter = btn.getAttribute('data-cal-filter') || 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderCalendar();
    });
  });

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCalendarView = btn.getAttribute('data-cal-view') || 'month';
      viewBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderCalendar();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentCalDate = new Date();
      renderCalendar();
    });
  }

  // Exports
  window.renderCalendar = renderCalendar;
  window.initCalendarPage = initCalendarPage;

  // Initial render
  renderCalendar();
}

/* ============================================================================
   SECTION 12: COMMUNITY SUGGESTIONS & VOTING ENGINE (suggestions.html)
   ============================================================================ */

const DEFAULT_SUGGESTIONS = [
  {
    id: 'sug-1',
    title: 'Fästing- och huggormsvarning via karta',
    description: 'En live-karta där hundägare kan varna varandra för fästingtäta områden, algblomning eller huggormsobservationer i realtid under promenaden.',
    category: 'app-feature',
    status: 'in-progress',
    statusLabel: 'Under utveckling',
    votes: 142,
    author: 'Johan & Buster',
    authorBadge: 'Aktiv hundägare',
    date: '2026-08-28T14:30'
  },
  {
    id: 'sug-2',
    title: 'Smart export av digitalt hundpass (PDF)',
    description: 'Enkel sammanställning av hundens vaccinationshistorik, chipnummer och försäkringsdetaljer till en snygg PDF redo för veterinärbesök och resor.',
    category: 'health',
    status: 'planned',
    statusLabel: 'Planerad',
    votes: 98,
    author: 'Sara & Luna',
    authorBadge: 'Veterinärstuderande',
    date: '2026-08-25T09:15'
  },
  {
    id: 'sug-3',
    title: 'Röststyrning för live-promenad & spårning',
    description: 'Möjlighet att starta och stoppa promenadloggningen handsfree via röstkommandon ("HundApp, starta promenad") när händerna är fulla med koppel och godis.',
    category: 'walks',
    status: 'planned',
    statusLabel: 'Planerad',
    votes: 84,
    author: 'Marcus & Sigge',
    authorBadge: 'Jägare & Brukshundförare',
    date: '2026-08-22T17:40'
  },
  {
    id: 'sug-4',
    title: 'Sociala hundträffar & promenadsällskap',
    description: 'Hitta andra hundägare i samma bostadsområde med matchande energinivå och ras för trygga gemensamma rastningar och lek.',
    category: 'social',
    status: 'review',
    statusLabel: 'Under granskning',
    votes: 67,
    author: 'Elena & Milo',
    authorBadge: 'Valpägare',
    date: '2026-08-20T11:20'
  },
  {
    id: 'sug-5',
    title: 'Automatisk påminnelse för fästingmedel & kloklipp',
    description: 'Smarta återkommande notiser baserade på intervall (t.ex. var 4:e vecka) så man aldrig glömmer förebyggande vård.',
    category: 'health',
    status: 'completed',
    statusLabel: 'Lanserat',
    votes: 195,
    author: 'HundApp Teamet',
    authorBadge: 'Officiell funktion',
    date: '2026-08-10T08:00'
  }
];

function getCommunitySuggestions() {
  const list = safeStorage.get(STORAGE_KEYS.COMMUNITY_SUGGESTIONS);
  if (!list || !Array.isArray(list) || list.length === 0) {
    safeStorage.set(STORAGE_KEYS.COMMUNITY_SUGGESTIONS, DEFAULT_SUGGESTIONS);
    return DEFAULT_SUGGESTIONS;
  }
  return list;
}

function saveCommunitySuggestions(list) {
  safeStorage.set(STORAGE_KEYS.COMMUNITY_SUGGESTIONS, list);
}

function initSuggestionsPage() {
  if (typeof document === 'undefined') return;
  const listContainer = document.getElementById('suggestions-list-container');
  if (!listContainer) return;

  const searchInput = document.getElementById('suggestions-search');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn, [data-view]');
  const filterBtns = document.querySelectorAll('.s-filter-btn, [data-filter]');
  const openModalBtn = document.getElementById('open-suggestion-modal-btn');
  const mailAdminBtn = document.getElementById('direct-email-admin-btn');
  const modal = document.getElementById('new-suggestion-modal');
  const form = document.getElementById('new-suggestion-form');
  const kanbanBoard = document.getElementById('suggestions-kanban-board');

  let currentView = 'grid'; // 'grid' | 'kanban'
  let currentCategory = 'all';
  let searchTerm = '';

  /* ==========================================
     1. VECKANS COMMUNITY OMRÖSTNING
     ========================================== */
  const pollOptionBtns = document.querySelectorAll('.poll-option-btn, [data-poll-option]');
  const pollResultsBox = document.getElementById('poll-results-box');

  function renderWeeklyPoll() {
    const userPollVote = safeStorage.get(STORAGE_KEYS.COMMUNITY_POLL, null);
    
    // Default votes tally
    const pollTallies = {
      'map-warning': 142,
      'dog-passport': 98,
      'voice-control': 84,
      'social-walks': 67
    };

    if (userPollVote && pollTallies[userPollVote] !== undefined) {
      pollTallies[userPollVote]++;
    }

    const totalVotes = Object.values(pollTallies).reduce((a, b) => a + b, 0);

    pollOptionBtns.forEach(btn => {
      const opt = btn.getAttribute('data-poll-option');
      const isSelected = (userPollVote === opt);
      const count = pollTallies[opt] || 0;
      const pct = Math.round((count / totalVotes) * 100);

      btn.classList.toggle('user-voted', isSelected);
      const pctBar = btn.querySelector('.poll-bar-fill');
      if (pctBar) pctBar.style.width = `${pct}%`;

      const statSpan = btn.querySelector('.poll-pct-stat');
      if (statSpan) statSpan.textContent = `${pct}% (${count} röster)`;
    });

    const totalVotesEl = document.getElementById('poll-total-votes-count');
    if (totalVotesEl) totalVotesEl.textContent = `${totalVotes} röster registrerade`;
  }

  pollOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = btn.getAttribute('data-poll-option');
      const currentVote = safeStorage.get(STORAGE_KEYS.COMMUNITY_POLL, null);

      if (currentVote === opt) {
        safeStorage.remove(STORAGE_KEYS.COMMUNITY_POLL);
        showToast('Din röst togs bort.');
      } else {
        safeStorage.set(STORAGE_KEYS.COMMUNITY_POLL, opt);
        showToast('Tack för din röst i veckans omröstning! 🎉', '🗳️');
        celebrateConfetti();
      }
      renderWeeklyPoll();
    });
  });

  /* ==========================================
     2. STATISTIK & STATUS BADGES
     ========================================== */
  function updateSuggestionsStats(items) {
    const totalVotes = items.reduce((acc, cur) => acc + (cur.votes || 0), 0);
    const plannedCount = items.filter(i => i.status === 'planned' || i.status === 'in-progress').length;
    const completedCount = items.filter(i => i.status === 'completed').length;

    const statTotal = document.getElementById('s-stat-total');
    const statVotes = document.getElementById('s-stat-votes');
    const statPlanned = document.getElementById('s-stat-planned');
    const statDone = document.getElementById('s-stat-done');

    if (statTotal) statTotal.textContent = items.length;
    if (statVotes) statVotes.textContent = totalVotes;
    if (statPlanned) statPlanned.textContent = plannedCount;
    if (statDone) statDone.textContent = completedCount;
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'review':
        return '<span class="status-pill status-review">🔍 Under granskning</span>';
      case 'planned':
        return '<span class="status-pill status-planned">📌 Planerad</span>';
      case 'in-progress':
        return '<span class="status-pill status-progress">⚡ Under utveckling</span>';
      case 'completed':
        return '<span class="status-pill status-completed">🎉 Lanserad</span>';
      default:
        return '<span class="status-pill status-default">💡 Idé</span>';
    }
  }

  /* ==========================================
     3. RENDERING AV KANBAN ROADMAP
     ========================================== */
  function renderKanbanBoard(items) {
    if (!kanbanBoard) return;

    const userVoted = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);

    const columns = [
      { id: 'review', title: '🔍 Under granskning', listId: 'kanban-col-review' },
      { id: 'planned', title: '📌 Planerad', listId: 'kanban-col-planned' },
      { id: 'in-progress', title: '⚡ Under utveckling', listId: 'kanban-col-progress' },
      { id: 'completed', title: '🎉 Lanserat', listId: 'kanban-col-completed' }
    ];

    kanbanBoard.innerHTML = `
      <div class="kanban-grid">
        ${columns.map(col => {
          const colItems = items.filter(i => i.status === col.id);
          return `
            <div class="kanban-column" id="col-${col.id}">
              <div class="kanban-col-header">
                <h3>${col.title}</h3>
                <span class="kanban-col-count">${colItems.length}</span>
              </div>
              <div class="kanban-cards-list">
                ${colItems.length === 0 ? '<div class="kanban-empty-msg">Inga förslag i denna fas</div>' : colItems.map(item => {
                  const isVoted = userVoted.includes(item.id);
                  return `
                    <div class="kanban-card" id="kanban-card-${item.id}">
                      <div class="kanban-card-top">
                        <span class="suggestion-cat-tag cat-${item.category}">${escapeHtml(item.category)}</span>
                        <button type="button" class="vote-chip ${isVoted ? 'voted' : ''}" onclick="window.toggleSuggestionVote('${item.id}')" title="Rösta på detta förslag">
                          ▲ <b>${item.votes}</b>
                        </button>
                      </div>
                      <h4 class="kanban-card-title">${escapeHtml(item.title)}</h4>
                      <p class="kanban-card-desc">${escapeHtml(item.description)}</p>
                      <div class="kanban-card-author">
                        <span>👤 ${escapeHtml(item.author)}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ==========================================
     4. HUVUDRENDERING (GRID & FILTER)
     ========================================== */
  function renderSuggestions() {
    const allItems = getCommunitySuggestions();
    updateSuggestionsStats(allItems);

    const userVoted = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);

    // Filter
    const filtered = allItems.filter(item => {
      // Category filter
      if (currentCategory !== 'all' && item.category !== currentCategory) {
        return false;
      }

      // Search term filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesAuthor = item.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesAuthor) return false;
      }

      return true;
    });

    // Sort by votes descending
    filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));

    if (currentView === 'kanban') {
      if (listContainer) listContainer.style.display = 'none';
      if (kanbanBoard) {
        kanbanBoard.style.display = 'block';
        renderKanbanBoard(filtered);
      }
      return;
    }

    // Grid View
    if (kanbanBoard) kanbanBoard.style.display = 'none';
    if (listContainer) listContainer.style.display = 'grid';

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 48px 16px; background:#fff; border-radius:16px; border:1px dashed var(--border);">
          <span style="font-size:36px; display:block; margin-bottom:8px;">💡</span>
          <h3 style="margin:0 0 6px; font-family:'Fraunces',serif;">Inga förslag hittades</h3>
          <p style="margin:0; color:var(--muted); font-size:14px;">Bli först med att skicka in en idé inom denna kategori!</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(item => {
      const isVoted = userVoted.includes(item.id);
      const dateFormatted = formatHumanDate(item.date, currentLang);

      return `
        <article class="suggestion-card" id="suggestion-card-${item.id}">
          <div class="suggestion-card-header">
            <span class="suggestion-cat-tag cat-${item.category}">${escapeHtml(item.category)}</span>
            ${getStatusBadge(item.status)}
          </div>

          <h3 class="suggestion-title">${escapeHtml(item.title)}</h3>
          <p class="suggestion-description">${escapeHtml(item.description)}</p>

          <div class="suggestion-footer">
            <div class="suggestion-author-info">
              <span class="author-avatar-badge">🐾</span>
              <div>
                <strong>${escapeHtml(item.author)}</strong>
                <small>${escapeHtml(item.authorBadge || 'Hundägare')} · ${dateFormatted}</small>
              </div>
            </div>

            <div class="suggestion-action-buttons">
              <button type="button" class="btn-icon share-sug-btn" onclick="window.shareSuggestion('${item.id}')" title="Dela idén" aria-label="Dela idén">
                ↗
              </button>
              <button type="button" class="vote-button ${isVoted ? 'voted' : ''}" onclick="window.toggleSuggestionVote('${item.id}')" aria-pressed="${isVoted ? 'true' : 'false'}" aria-label="Rösta på ${escapeHtml(item.title)}">
                <span class="vote-arrow">▲</span>
                <span class="vote-count">${item.votes}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ==========================================
     5. RÖSTNINGSHANDLER & DELNING
     ========================================== */
  window.toggleSuggestionVote = (id) => {
    let items = getCommunitySuggestions();
    let userVoted = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);
    const target = items.find(i => i.id === id);
    if (!target) return;

    if (userVoted.includes(id)) {
      // Remove vote
      target.votes = Math.max(0, (target.votes || 1) - 1);
      userVoted = userVoted.filter(i => i !== id);
      showToast('Röst borttagen.', '↩️');
    } else {
      // Add vote
      target.votes = (target.votes || 0) + 1;
      userVoted.push(id);
      showToast('Tack för din röst! Idén har flyttats upp i listan. 🎉', '▲');
      celebrateConfetti();
    }

    safeStorage.set(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, userVoted);
    saveCommunitySuggestions(items);
    renderSuggestions();
  };

  window.shareSuggestion = async (id) => {
    const items = getCommunitySuggestions();
    const target = items.find(i => i.id === id);
    if (!target) return;

    const shareUrl = window.location.href.split('#')[0] + `#idea-${id}`;
    const shareText = `Rösta på denna idé för HundApp: "${target.title}"!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: target.title,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {}
    }

    copyToClipboard(`${shareText} ${shareUrl}`, 'Länk till förslaget kopierad!');
  };

  /* ==========================================
     6. SÖKNING, FILTER & VY-VÄXLING
     ========================================== */
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchTerm = e.target.value.trim();
      renderSuggestions();
    }, 150));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderSuggestions();
    });
  });

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.getAttribute('data-view') || 'grid';
      viewToggleBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderSuggestions();
    });
  });

  // Modal open
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      if (form) form.reset();
      openModal(modal);
    });
  }

  if (mailAdminBtn) {
    mailAdminBtn.addEventListener('click', () => {
      window.location.href = 'mailto:hej@hundapp.se?subject=Förslag%20och%20idé%20till%20HundApp';
    });
  }

  // Modal form submit
  if (form && modal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('sug-title-input')?.value.trim();
      const description = document.getElementById('sug-desc-input')?.value.trim();
      const category = document.getElementById('sug-category-select')?.value || 'app-feature';
      const author = document.getElementById('sug-author-input')?.value.trim() || 'Hundvän';

      if (!title || !description) {
        showToast('Fyll i både titel och beskrivning!', '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const newIdea = {
        id: generateId('sug'),
        title,
        description,
        category,
        status: 'review',
        statusLabel: 'Under granskning',
        votes: 1, // Author automatic upvote
        author: `${author} & ${activeDog.name}`,
        authorBadge: 'Gemenskapen',
        date: new Date().toISOString()
      };

      const items = getCommunitySuggestions();
      items.unshift(newIdea);
      saveCommunitySuggestions(items);

      // Auto-register user vote for own idea
      const userVoted = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);
      userVoted.push(newIdea.id);
      safeStorage.set(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, userVoted);

      closeModal(modal);
      showToast('Ditt förslag har publicerats! Tack för ditt engagemang. 🐾', '🎉');
      celebrateConfetti();
      renderSuggestions();
    });
  }

  window.renderSuggestions = renderSuggestions;

  // Initial render
  renderWeeklyPoll();
  renderSuggestions();
}

/* ==========================================================================
   SECTION 13: AUTHENTICATION & SECURITY ENGINE (login.html & register.html)
   Real Google OAuth 2.0 Integration & Session Management
   ========================================================================== */

const OFFICIAL_GOOGLE_CLIENT_ID = '378881918893-fbsf9pj2flr469nmb45amegodpoj652c.apps.googleusercontent.com';

// ⚡ Immediate Google OAuth Token Interceptor on Script Load
if (typeof window !== 'undefined' && (window.location.hash || window.location.search)) {
  setTimeout(() => {
    if (typeof checkGoogleOAuthCallback === 'function') {
      checkGoogleOAuthCallback();
    }
  }, 0);
}

function getGoogleClientId() {
  const custom = safeStorage.get(STORAGE_KEYS.GOOGLE_CLIENT_ID);
  if (custom && typeof custom === 'string' && custom.trim().length > 5) {
    return custom.trim();
  }
  return OFFICIAL_GOOGLE_CLIENT_ID;
}

function saveCustomGoogleClientId(clientId) {
  if (clientId && clientId.trim()) {
    safeStorage.set(STORAGE_KEYS.GOOGLE_CLIENT_ID, clientId.trim());
    if (typeof showToast === 'function') showToast('Google Client ID sparades!', '🔑');
    return true;
  }
  return false;
}

/**
 * Parses JWT token payload (Google ID Token)
 */
function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('[HundApp Auth] Kunde inte avkoda JWT payload:', e);
    return null;
  }
}

/**
 * Real Google OAuth Redirection Flow
 */

window.redirectToGoogleOAuth = function() {
  const clientId = '378881918893-fbsf9pj2flr469nmb45amegodpoj652c.apps.googleusercontent.com';
  let origin = window.location.origin;
  let pathname = window.location.pathname;
  let basePath = pathname.substring(0, pathname.lastIndexOf('/'));
  let redirectUri = origin + basePath + '/login.html';

  const scope = encodeURIComponent('openid email profile');
  const responseType = 'token id_token';
  const nonce = Math.random().toString(36).substring(2, 15);
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + encodeURIComponent(clientId) +
                  '&redirect_uri=' + encodeURIComponent(redirectUri) +
                  '&response_type=' + encodeURIComponent(responseType) +
                  '&scope=' + scope +
                  '&nonce=' + nonce +
                  '&prompt=select_account';
  window.location.href = authUrl;
};


async function checkGoogleOAuthCallback() {
  if (typeof window === 'undefined' || !window.location.hash) return;
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const idToken = params.get('id_token');
  const accessToken = params.get('access_token');

  if (idToken || accessToken) {
    console.log('[HundApp Auth] Google OAuth token mottaget via callback.');
    let payload = null;

    if (idToken) {
      payload = parseJwtPayload(idToken);
    }

    if (!payload && accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: 'Bearer ' + accessToken }
        });
        if (res.ok) {
          payload = await res.json();
        }
      } catch (err) {
        console.warn('[HundApp Auth] Misslyckades hämta userinfo från Google:', err);
      }
    }

    if (payload && payload.email) {
      // Clean URL hash so tokens are not exposed in history
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      handleGoogleAuthSuccess(payload);
      return true;
    }
  }
  return false;
}


function handleGoogleAuthSuccess(payload) {
  const email = payload.email;
  const name = payload.name || payload.given_name || email.split('@')[0];
  const picture = payload.picture || '';

  let users = safeStorage.get(STORAGE_KEYS.REGISTERED_USERS, []);
  if (!Array.isArray(users)) users = [];

  let existingUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    existingUser = {
      id: generateId('user-g'),
      name: name,
      email: email,
      picture: picture,
      authProvider: 'google',
      createdAt: new Date().toISOString()
    };
    users.push(existingUser);
    safeStorage.set(STORAGE_KEYS.REGISTERED_USERS, users);
  }

  const activeUser = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    picture: picture || existingUser.picture || '',
    authProvider: 'google',
    loggedInAt: new Date().toISOString()
  };

  safeStorage.set(STORAGE_KEYS.AUTH_USER, activeUser);
  if (typeof showToast === 'function') {
    showToast(`Välkommen, ${activeUser.name}! Inloggad med Google 🐾`, '🎉');
  }
  if (typeof celebrateConfetti === 'function') {
    celebrateConfetti();
  }
  window.location.href = 'portal.html';
}

function logoutHundAppUser() {
  safeStorage.remove(STORAGE_KEYS.AUTH_USER);
  if (typeof showToast === 'function') {
    showToast('Du har loggats ut.', '👋');
  }
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

function openAccountNotFoundModal(enteredInput) {
  let modal = document.getElementById('account-not-found-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'account-not-found-modal';
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'anf-modal-title');
    document.body.appendChild(modal);
  }

  const safeInput = String(enteredInput || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const registerUrl = 'register.html' + (enteredInput && enteredInput.includes('@') ? `?email=${encodeURIComponent(enteredInput)}` : '');

  modal.innerHTML = `
    <div class="modal-box form-modal account-not-found-box" style="width:min(100%, 460px); background:#fff; border-radius:24px; padding:32px; text-align:center; box-shadow:0 24px 60px rgba(0,0,0,0.25); animation:modalPop 0.25s ease-out;">
      <div style="font-size:48px; margin-bottom:12px;">🐾</div>
      <p class="eyebrow" style="color:var(--green-dark, #2D6A4F); font-weight:700; margin:0 0 6px;">Inget konto hittades</p>
      <h2 id="anf-modal-title" style="font-family:'Fraunces',serif; font-size:24px; color:var(--ink, #1c1917); margin:0 0 10px;">
        Vi hittade inget konto för "${safeInput}"
      </h2>
      <p style="font-size:14px; color:var(--muted, #64748b); line-height:1.5; margin:0 0 24px;">
        Det verkar som att du inte har skapat något konto än. Vill du registrera ett kostnadsfritt HundApp-konto nu? Det tar under 1 minut!
      </p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <a href="${registerUrl}" class="button btn-primary" style="width:100%; text-decoration:none; padding:12px; font-weight:700; font-size:15px; border-radius:12px; text-align:center;">
          Ja, skapa gratiskonto →
        </a>
        <button type="button" class="btn btn-outline" id="close-anf-modal-btn" style="width:100%; padding:10px; border-radius:12px; font-weight:600;">
          Försök logga in igen
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  const closeBtn = document.getElementById('close-anf-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

function initAuthSystem() {
  checkGoogleOAuthCallback();
  if (typeof document === 'undefined') return;

  // 1. Real Google Sign-in Buttons
  const googleBtns = document.querySelectorAll('.social-google-btn, #social-google-btn, .btn-google-oauth, #open-google-login-action-btn');
  googleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.redirectToGoogleOAuth === 'function') {
        window.redirectToGoogleOAuth();
      } else if (typeof directGoogleLogin === 'function') {
        directGoogleLogin();
      }
    });
  });

  // 2. Password Toggle & CapsLock Detection
  const passInput = document.getElementById('password');
  const togglePassBtn = document.getElementById('toggle-password');
  const capsLockWarn = document.getElementById('caps-lock-warning');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Dölj lösenord' : 'Visa lösenord');
      togglePassBtn.innerHTML = isPassword ? '<span class="eye-icon">🙈</span>' : '<span class="eye-icon">👁️</span>';
    });
  }

  if (passInput && capsLockWarn) {
    passInput.addEventListener('keyup', (e) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        capsLockWarn.removeAttribute('hidden');
        capsLockWarn.style.display = 'flex';
      } else {
        capsLockWarn.setAttribute('hidden', 'true');
        capsLockWarn.style.display = 'none';
      }
    });
  }

  // 3. Login Form Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      const remember = document.getElementById('remember-me')?.checked || document.getElementById('remember')?.checked;

      const emailErr = document.getElementById('login-email-error');
      const passErr = document.getElementById('login-pass-error');

      if (!email) {
        if (emailErr) { emailErr.removeAttribute('hidden'); emailErr.style.display = 'block'; }
        showToast('Ange din e-postadress eller användarnamn!', '⚠️');
        return;
      } else if (emailErr) {
        emailErr.setAttribute('hidden', 'true');
        emailErr.style.display = 'none';
      }

      if (!password) {
        if (passErr) { passErr.removeAttribute('hidden'); passErr.style.display = 'block'; }
        showToast('Ange ditt lösenord!', '⚠️');
        return;
      } else if (passErr) {
        passErr.setAttribute('hidden', 'true');
        passErr.style.display = 'none';
      }

      if (remember) {
        safeStorage.set(STORAGE_KEYS.REMEMBERED_EMAIL, email);
      } else {
        safeStorage.remove(STORAGE_KEYS.REMEMBERED_EMAIL);
      }

      let users = safeStorage.get(STORAGE_KEYS.REGISTERED_USERS, []);
      if (!Array.isArray(users)) users = [];

      const emailLower = email.toLowerCase();
      const existingUser = users.find(u => 
        (u.email && u.email.toLowerCase() === emailLower) || 
        (u.name && u.name.toLowerCase() === emailLower)
      );

      // If user does not exist in safeStorage -> Open modal prompting to register
      if (!existingUser) {
        openAccountNotFoundModal(email);
        return;
      }

      // If user exists, verify password
      if (existingUser.password && existingUser.password !== password) {
        if (passErr) {
          passErr.textContent = 'Felaktigt lösenord. Vänligen försök igen.';
          passErr.removeAttribute('hidden');
          passErr.style.display = 'block';
        }
        showToast('Felaktigt lösenord. Försök igen eller återställ det.', '⚠️');
        return;
      }

      // Password matches -> log in user directly
      const sessionUser = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        authProvider: existingUser.authProvider || 'email',
        loggedInAt: new Date().toISOString()
      };
      safeStorage.set(STORAGE_KEYS.AUTH_USER, sessionUser);
      showToast(`Välkommen tillbaka, ${existingUser.name}! 🐾`, '🎉');
      celebrateConfetti();
      window.location.href = 'portal.html';
    });
  }

  // 4. Registration Form Handler
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('password-confirm');
      const termsCheck = document.getElementById('terms-consent') || document.getElementById('terms');

      const name = usernameInput?.value.trim();
      const email = emailInput?.value.trim();
      const password = passwordInput?.value;
      const confirm = confirmInput?.value;
      const terms = termsCheck?.checked;

      const userErr = document.getElementById('username-error');
      const emailErr = document.getElementById('email-error');
      const passErr = document.getElementById('password-error');
      const confErr = document.getElementById('confirm-error');
      const termsErr = document.getElementById('terms-error');

      let hasError = false;

      if (!name || name.length < 2) {
        if (userErr) { userErr.removeAttribute('hidden'); userErr.style.display = 'block'; }
        hasError = true;
      } else if (userErr) {
        userErr.setAttribute('hidden', 'true');
        userErr.style.display = 'none';
      }

      if (!email || !email.includes('@')) {
        if (emailErr) { emailErr.removeAttribute('hidden'); emailErr.style.display = 'block'; }
        hasError = true;
      } else if (emailErr) {
        emailErr.setAttribute('hidden', 'true');
        emailErr.style.display = 'none';
      }

      if (!password || password.length < 6) {
        if (passErr) { passErr.removeAttribute('hidden'); passErr.style.display = 'block'; }
        hasError = true;
      } else if (passErr) {
        passErr.setAttribute('hidden', 'true');
        passErr.style.display = 'none';
      }

      if (password && confirm && password !== confirm) {
        if (confErr) { confErr.removeAttribute('hidden'); confErr.style.display = 'block'; }
        hasError = true;
      } else if (confErr) {
        confErr.setAttribute('hidden', 'true');
        confErr.style.display = 'none';
      }

      if (!terms) {
        if (termsErr) { termsErr.removeAttribute('hidden'); termsErr.style.display = 'block'; }
        hasError = true;
      } else if (termsErr) {
        termsErr.setAttribute('hidden', 'true');
        termsErr.style.display = 'none';
      }

      if (hasError) {
        showToast('Vänligen åtgärda felen i formuläret.', '⚠️');
        return;
      }

      let users = safeStorage.get(STORAGE_KEYS.REGISTERED_USERS, []);
      if (!Array.isArray(users)) users = [];

      // Check if user already exists
      const existingUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        showToast('Ett konto med denna e-post finns redan! Loggar in...', 'ℹ️');
        safeStorage.set(STORAGE_KEYS.AUTH_USER, {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          authProvider: 'email',
          loggedInAt: new Date().toISOString()
        });
        window.location.href = 'portal.html';
        return;
      }

      const newUser = {
        id: generateId('user'),
        name: name,
        email: email,
        password: password,
        authProvider: 'email',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      safeStorage.set(STORAGE_KEYS.REGISTERED_USERS, users);

      // Immediately log in new user and redirect straight to portal.html
      safeStorage.set(STORAGE_KEYS.AUTH_USER, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        authProvider: 'email',
        loggedInAt: new Date().toISOString()
      });

      showToast(`Konto skapat! Välkommen till HundApp, ${name}! 🐾`, '🎉');
      celebrateConfetti();
      window.location.href = 'portal.html';
    });
  }

  // 5. Forgot Password Modal
  const forgotBtn = document.getElementById('open-forgot-modal-btn');
  const forgotModal = document.getElementById('forgot-password-modal') || document.getElementById('forgot-modal');
  const forgotForm = document.getElementById('forgot-password-form') || document.getElementById('forgot-form');
  const closeForgotBtn = document.getElementById('close-forgot-modal-btn');
  const cancelForgotBtn = document.getElementById('cancel-forgot-modal-btn');

  if (forgotBtn && forgotModal) {
    forgotBtn.addEventListener('click', () => {
      if (forgotForm) forgotForm.reset();
      openModal(forgotModal);
    });
  }

  if (closeForgotBtn && forgotModal) closeForgotBtn.addEventListener('click', () => closeModal(forgotModal));
  if (cancelForgotBtn && forgotModal) cancelForgotBtn.addEventListener('click', () => closeModal(forgotModal));

  if (forgotForm && forgotModal) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById('forgot-email-input')?.value.trim() || document.getElementById('forgot-email')?.value.trim();
      if (!resetEmail) {
        showToast('Ange din e-postadress eller användarnamn!', '⚠️');
        return;
      }
      showToast('Återställningsinstruktioner har skickats till ' + resetEmail + ' ✉️', '✓');
      closeModal(forgotModal);
    });
  }
}


SECTION 14: GLOBAL APPLICATION BOOTSTRAPPER & EXPORTS
   ============================================================================ */

/**
 * Global HundApp Master Namespace
 */
const HundApp = {
  version: '2.5.0',
  storage: safeStorage,
  i18n: { t, setLanguage, getLang: () => currentLang },
  utils: {
    escapeHtml,
    sanitizeInput,
    debounce,
    showToast,
    formatHumanDate,
    formatRelativeTime,
    formatDuration,
    formatPace,
    calculateAge,
    celebrateConfetti,
    copyToClipboard
  },
  dogs: {
    getDogs: getDogsList,
    saveDogs: saveDogsList,
    getActive: getActiveDog,
    setActive: setActiveDog,
    updateUI: updateActiveDogGlobalUI
  },
  auth: {
    logout: logoutHundAppUser,
    redirectToGoogle: redirectToGoogleOAuth,
    saveGoogleClientId: saveCustomGoogleClientId
  }
};

// Global Error Boundary to prevent any unhandled crash
if (typeof window !== 'undefined') {
  window.HundApp = HundApp;
  window.safeStorage = safeStorage;
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.setLanguage = setLanguage;
  window.t = t;
  window.escapeHtml = escapeHtml;
  window.getActiveDog = getActiveDog;
  window.setActiveDog = setActiveDog;
  window.redirectToGoogleOAuth = redirectToGoogleOAuth;
  window.saveCustomGoogleClientId = saveCustomGoogleClientId;
  window.logoutHundAppUser = logoutHundAppUser;

  // Page Inits
  window.initHomePage = typeof initHomePage !== 'undefined' ? initHomePage : null;
  window.initTipsPage = typeof initTipsPage !== 'undefined' ? initTipsPage : null;
  window.initWalksPage = typeof initWalksPage !== 'undefined' ? initWalksPage : null;
  window.initStatisticsPage = typeof initStatisticsPage !== 'undefined' ? initStatisticsPage : null;
  window.initPortalPage = typeof initPortalPage !== 'undefined' ? initPortalPage : null;
  window.initDogsPage = typeof initDogsPage !== 'undefined' ? initDogsPage : null;
  window.initCalendarPage = typeof initCalendarPage !== 'undefined' ? initCalendarPage : null;
  window.initSuggestionsPage = typeof initSuggestionsPage !== 'undefined' ? initSuggestionsPage : null;
  window.initAuthSystem = typeof initAuthSystem !== 'undefined' ? initAuthSystem : null;

  if (typeof window.addEventListener === 'function') window.addEventListener('error', (event) => {
    console.error('[HundApp Error Boundary]', event.error || event.message);
  });

  if (typeof window.addEventListener === 'function') window.addEventListener('unhandledrejection', (event) => {
    console.error('[HundApp Unhandled Rejection]', event.reason);
  });
}

// Global DOM Ready Initializer
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initGlobalNavigation();
    updateActiveDogGlobalUI();

    // Initialize Active Page Modules
    if (typeof initHomePage === 'function') initHomePage();
    if (typeof initTipsPage === 'function') initTipsPage();
    if (typeof initWalksPage === 'function') initWalksPage();
    if (typeof initStatisticsPage === 'function') initStatisticsPage();
    if (typeof initPortalPage === 'function') initPortalPage();
    if (typeof initDogsPage === 'function') initDogsPage();
    if (typeof initCalendarPage === 'function') initCalendarPage();
    if (typeof initSuggestionsPage === 'function') initSuggestionsPage();
    if (typeof initAuthSystem === 'function') initAuthSystem();
  });
}


/* ==========================================================================
   SECTION 15: PWA & 100% OFFLINE FOREST ENGINE (v2.6)
   Registers Service Worker, handles offline mode & install prompt
   ========================================================================== */

let deferredInstallPrompt = null;

function initPWAEngine() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('[HundApp PWA] Service Worker registrerad med scope:', reg.scope);
          
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[HundApp PWA] Ny version tillgänglig. Uppdaterar i bakgrunden.');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[HundApp PWA] Service Worker registrering misslyckades:', err);
        });
    });
  }

  // 2. Online / Offline State Handlers (Skogsläge)
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    let pill = document.getElementById('offlineStatusPill');

    if (!isOnline) {
      if (!pill) {
        pill = document.createElement('div');
        pill.id = 'offlineStatusPill';
        pill.className = 'offline-status-pill';
        pill.innerHTML = `
          <span class="offline-dot"></span>
          <span>🌲 <strong>Skogsläge aktivt (Offline)</strong> • Promenader &amp; rutiner sparas lokalt</span>
        `;
        document.body.appendChild(pill);
      } else {
        pill.className = 'offline-status-pill';
        pill.innerHTML = `
          <span class="offline-dot"></span>
          <span>🌲 <strong>Skogsläge aktivt (Offline)</strong> • Promenader &amp; rutiner sparas lokalt</span>
        `;
        pill.style.display = 'flex';
      }
    } else {
      if (pill) {
        pill.className = 'offline-status-pill online-sync';
        pill.innerHTML = `
          <span class="online-dot"></span>
          <span>🟢 <strong>Återansluten</strong> • All data är tryggt sparad och synkad</span>
        `;
        setTimeout(() => {
          if (pill) pill.remove();
        }, 3500);
      }
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  // Initial check on load
  if (!navigator.onLine) {
    setTimeout(updateOnlineStatus, 500);
  }

  // 3. PWA Install Prompt Listener
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('[HundApp PWA] beforeinstallprompt fångat.');
    showPWAInstallButtons();
  });

  window.addEventListener('appinstalled', () => {
    console.log('[HundApp PWA] Appen installerades på enheten!');
    deferredInstallPrompt = null;
    if (typeof showToast === 'function') {
      showToast('🎉 HundApp har installerats på din hemskärm!');
    }
  });

  // Inject PWA Install button in header if not in standalone
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    showPWAInstallButtons();
  }
}

function showPWAInstallButtons() {
  const navContainers = document.querySelectorAll('.header-actions, .nav-actions, .navbar-nav');
  navContainers.forEach(container => {
    if (!container.querySelector('.pwa-install-pill-btn')) {
      const installBtn = document.createElement('button');
      installBtn.type = 'button';
      installBtn.className = 'pwa-install-pill-btn';
      installBtn.innerHTML = '📲 Installera App';
      installBtn.title = 'Installera HundApp på mobilen för 100% offline-promenader i skogen';
      installBtn.onclick = () => window.triggerPWAInstall();
      
      if (container.firstChild) {
        container.insertBefore(installBtn, container.firstChild);
      } else {
        container.appendChild(installBtn);
      }
    }
  });
}

window.triggerPWAInstall = async function() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[HundApp PWA] Användarens val:', outcome);
    deferredInstallPrompt = null;
  } else {
    // Show step-by-step install modal
    window.openPWAInstallGuideModal();
  }
};

window.openPWAInstallGuideModal = function() {
  let modal = document.getElementById('pwaInstallGuideModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pwaInstallGuideModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-container pwa-guide-modal" style="max-width:480px; padding:28px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:28px;">📲</span>
            <h3 style="font-family:'Fraunces',serif; font-size:20px; color:var(--pine); margin:0;">Installera HundApp</h3>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('pwaInstallGuideModal').style.display='none'" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--muted);">✕</button>
        </div>

        <p style="font-size:14px; color:var(--ink); line-height:1.5; margin-bottom:20px;">
          Få en snabb, app-lik upplevelse direkt på din hemskärm som fungerar <strong>100% offline</strong> även när du är ute i djupa skogen utan täckning.
        </p>

        <div style="background:rgba(45, 106, 79, 0.06); border:1px solid rgba(45, 106, 79, 0.15); border-radius:12px; padding:16px; margin-bottom:20px;">
          <h4 style="font-size:14px; color:var(--pine); margin:0 0 10px 0; font-weight:700;">🍏 På iPhone &amp; iPad (Safari):</h4>
          <ol style="font-size:13px; color:var(--ink); margin:0; padding-left:20px; line-height:1.6;">
            <li>Tryck på <strong>Dela-knappen</strong> (fyrkanten med pil uppåt ⎋) längst ner i webbläsaren.</li>
            <li>Skrolla nedåt och klicka på <strong>"Lägg till på hemskärmen"</strong> (Add to Home Screen).</li>
            <li>Tryck på <strong>"Lägg till"</strong> uppe till höger. Klart! 🐾</li>
          </ol>
        </div>

        <div style="background:rgba(217, 119, 6, 0.06); border:1px solid rgba(217, 119, 6, 0.2); border-radius:12px; padding:16px; margin-bottom:24px;">
          <h4 style="font-size:14px; color:var(--amber); margin:0 0 10px 0; font-weight:700;">🤖 På Android &amp; Chrome / Samsung Internet:</h4>
          <ol style="font-size:13px; color:var(--ink); margin:0; padding-left:20px; line-height:1.6;">
            <li>Tryck på menyknappen (de tre prickarna <strong>⋮</strong>) uppe till höger.</li>
            <li>Välj <strong>"Installera app"</strong> eller <strong>"Lägg till på startskärmen"</strong>.</li>
            <li>Godkänn installationen så läggs HundApp direkt bland dina appar.</li>
          </ol>
        </div>

        <div style="display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-primary" onclick="document.getElementById('pwaInstallGuideModal').style.display='none'" style="padding:10px 24px;">
            Jag förstår, toppen!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.style.display = 'flex';
};

// Auto-run PWA Engine
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWAEngine);
} else {
  initPWAEngine();
}


/* ==========================================================================
   SECTION 16: DOG PHOTO GALLERY & SMART AUTO-COMPRESSION ENGINE (v3.0)
   Compresses 8+ MB high-res camera photos down to crisp ~800 KB client-side
   ========================================================================== */

const DEFAULT_SAMPLE_DOG_PHOTOS = {
  'bella': [
    {
      id: 'photo-b1',
      dataUrl: 'images/bella-golden.jpg',
      date: '2026-08-30',
      caption: 'Solig morgonpromenad i tallskogen',
      originalSizeKB: 8420,
      compressedSizeKB: 640,
      savedPercent: 92,
      isAvatar: true
    }
  ],
  'buster': [
    {
      id: 'photo-bu1',
      dataUrl: 'images/buster-jackrussell.jpg',
      date: '2026-08-28',
      caption: 'Bus och fartlek i sommargräset',
      originalSizeKB: 7890,
      compressedSizeKB: 580,
      savedPercent: 93,
      isAvatar: true
    }
  ],
  'sigge': [
    {
      id: 'photo-s1',
      dataUrl: 'images/sigge-bordercollie.jpg',
      date: '2026-08-25',
      caption: 'Fokuserad vilopaus vid bryggan efter agility',
      originalSizeKB: 9100,
      compressedSizeKB: 690,
      savedPercent: 92,
      isAvatar: true
    }
  ]
};

function getDogPhotosList(dogId) {
  const all = safeStorage.get(STORAGE_KEYS.DOG_PHOTOS, DEFAULT_SAMPLE_DOG_PHOTOS);
  return all[dogId] || DEFAULT_SAMPLE_DOG_PHOTOS[dogId] || [];
}

function saveDogPhotoToStore(dogId, photoObj) {
  const all = safeStorage.get(STORAGE_KEYS.DOG_PHOTOS, DEFAULT_SAMPLE_DOG_PHOTOS);
  if (!all[dogId]) all[dogId] = [];
  all[dogId].unshift(photoObj);
  safeStorage.set(STORAGE_KEYS.DOG_PHOTOS, all);
}

function deleteDogPhotoFromStore(dogId, photoId) {
  const all = safeStorage.get(STORAGE_KEYS.DOG_PHOTOS, DEFAULT_SAMPLE_DOG_PHOTOS);
  if (all[dogId]) {
    all[dogId] = all[dogId].filter(p => p.id !== photoId);
    safeStorage.set(STORAGE_KEYS.DOG_PHOTOS, all);
  }
}

/**
 * Smart Client-Side Image Compression Engine
 * Scales down massive 8–15 MB smartphone photos (4000x3000px) to crisp ~800 KB WebP/JPEG
 */
window.compressDogImage = function(file, targetMaxKB = 800, maxDimension = 1600) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Filen är inte en giltig bildfil.'));
    }

    const originalSizeKB = (file.size / 1024).toFixed(0);
    const reader = new FileReader();

    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        let width = img.width;
        let height = img.height;

        // Proportional downscale to maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Iterative quality adjustment (starts at 0.88, decreases if still > targetMaxKB)
        let quality = 0.88;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let compressedSizeKB = Math.round((dataUrl.length * 0.75) / 1024);

        while (compressedSizeKB > targetMaxKB && quality > 0.60) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          compressedSizeKB = Math.round((dataUrl.length * 0.75) / 1024);
        }

        const savedPercent = Math.max(0, Math.round((1 - compressedSizeKB / originalSizeKB) * 100));

        resolve({
          dataUrl,
          originalSizeKB: Number(originalSizeKB),
          compressedSizeKB,
          savedPercent,
          width,
          height,
          name: file.name
        });
      };
      img.onerror = () => reject(new Error('Kunde inte läsa in bilden i Canvas.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Fel vid inläsning av fil.'));
    reader.readAsDataURL(file);
  });
};

window.triggerDogPhotoUpload = function(dogId, isAvatarOnly = false) {
  let fileInput = document.getElementById('globalDogPhotoInput');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'globalDogPhotoInput';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }

  fileInput.onchange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // ⚡ 0 ms OPTIMISTIC UI: Show selected photo immediately before compression completes
    const instantTempUrl = URL.createObjectURL(file);
    document.querySelectorAll('.dog-portrait-avatar-img, .dog-avatar-btn img, .nav-dog-avatar img').forEach(img => {
      img.src = instantTempUrl;
    });

    try {
      const result = await window.compressDogImage(file, isAvatarOnly ? 250 : 800, isAvatarOnly ? 800 : 1600);
      URL.revokeObjectURL(instantTempUrl);
      
      const newPhoto = {
        id: 'photo-' + Date.now(),
        dataUrl: result.dataUrl,
        date: new Date().toISOString().split('T')[0],
        caption: isAvatarOnly ? 'Profilfoto' : file.name.replace(/\.[^/.]+$/, ''),
        originalSizeKB: result.originalSizeKB,
        compressedSizeKB: result.compressedSizeKB,
        savedPercent: result.savedPercent,
        isAvatar: isAvatarOnly
      };

      saveDogPhotoToStore(dogId, newPhoto);

      // If avatar, update dog profile avatar
      if (isAvatarOnly || getDogPhotosList(dogId).length === 1) {
        window.setDogAvatarFromPhoto(dogId, result.dataUrl);
      }

      // Show high-impact compression toast banner
      showCompressionSuccessBanner(result);

      // Re-render views if active
      if (typeof renderDogsPage === 'function' && document.getElementById('dogProfilesContainer')) {
        renderDogsPage();
      }
      if (typeof renderPortalDashboard === 'function' && document.getElementById('portalGreetingHeading')) {
        const activeDog = getActiveDog();
        renderPortalDashboard(activeDog);
      }

    } catch (err) {
      console.error('Komprimeringsfel:', err);
      if (typeof showToast === 'function') {
        showToast('⚠️ Kunde inte komprimera bilden: ' + err.message);
      }
    } finally {
      fileInput.value = '';
    }
  };

  fileInput.click();
};

function showCompressionSuccessBanner(stats) {
  let banner = document.getElementById('compressionSuccessToast');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'compressionSuccessToast';
    banner.style.position = 'fixed';
    banner.style.top = '24px';
    banner.style.right = '24px';
    banner.style.zIndex = '99999';
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <div class="compression-stat-toast">
      <span style="font-size:24px;">📸</span>
      <div>
        <div style="font-weight:700; margin-bottom:2px; display:flex; align-items:center; gap:8px;">
          <span>Smart Auto-Kompression Klar!</span>
          <span class="compression-stat-badge">${stats.savedPercent}% sparad</span>
        </div>
        <div style="font-size:12px; color:#d8f3dc;">
          Minskad från <strong>${(stats.originalSizeKB / 1024).toFixed(1)} MB</strong> (${stats.originalSizeKB} KB) ➔ <strong>${stats.compressedSizeKB} KB</strong> för blixtsnabb laddning i skogen.
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    if (banner) banner.innerHTML = '';
  }, 5000);
}

window.setDogAvatarFromPhoto = function(dogId, photoDataUrl) {
  const dogs = getDogsList();
  const dog = dogs.find(d => d.id === dogId);
  if (dog) {
    dog.photoUrl = photoDataUrl;
    saveDogsList(dogs);
    updateActiveDogGlobalUI();
    if (typeof showToast === 'function') {
      showToast('🐾 Profilfoto uppdaterat för ' + dog.name + '!');
    }
  }
};

window.renderDogPhotoGallery = function(container, dogId) {
  if (!container) return;
  const photos = getDogPhotosList(dogId);
  const activeDog = getDogsList().find(d => d.id === dogId) || getActiveDog();

  let html = `
    <div class="dog-gallery-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
      <div>
        <h3 style="font-family:'Fraunces',serif; font-size:18px; color:var(--ink); margin:0;">📸 ${escapeHtml(activeDog.name)}s Fotoalbum &amp; Minnen</h3>
        <p style="font-size:12.5px; color:var(--muted); margin:2px 0 0;">Foton auto-komprimeras automatiskt från 8+ MB till ~800 KB för att spara plats och fungera 100% offline.</p>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="window.triggerDogPhotoUpload('${dogId}')" style="font-weight:700;">
        + Lägg till foto (Auto-komprimera)
      </button>
    </div>
  `;

  if (photos.length === 0) {
    html += `
      <div class="photo-upload-dropzone" onclick="window.triggerDogPhotoUpload('${dogId}')">
        <span style="font-size:32px;">📷</span>
        <strong style="color:var(--pine); font-size:14px;">Ladda upp första fotot på ${escapeHtml(activeDog.name)}</strong>
        <p style="font-size:12px; color:var(--muted); margin:0;">Stora mobilbilder (upp till 15 MB) komprimeras automatiskt till 800 KB med bevarad skärpa.</p>
      </div>
    `;
  } else {
    html += `
      <div class="dog-gallery-grid">
        ${photos.map(p => `
          <div class="dog-gallery-item" onclick="window.openPhotoLightbox('${p.dataUrl}', '${escapeHtml(p.caption || '')}', '${p.date} · ${(p.compressedSizeKB || 600)} KB')">
            <img src="${p.dataUrl}" alt="${escapeHtml(p.caption || 'Hundfoto')}" loading="lazy">
            <span class="dog-gallery-item-tag">⚡ ${(p.savedPercent || 90)}% sparad</span>
          </div>
        `).join('')}
        
        <div class="photo-upload-dropzone" onclick="window.triggerDogPhotoUpload('${dogId}')" style="height:130px; justify-content:center; padding:10px;">
          <span style="font-size:24px;">➕</span>
          <span style="font-size:11px; font-weight:700; color:var(--pine);">Lägg till bild</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
};

window.openPhotoLightbox = function(photoUrl, caption, metaStr) {
  let modal = document.getElementById('photoLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'photoLightboxModal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-container lightbox-modal" style="max-width:680px; padding:20px; background:#121815; color:#FAF7F2; border-radius:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="font-size:13px; color:#a5b4ae;" id="lightboxMetaStr"></div>
          <button type="button" onclick="document.getElementById('photoLightboxModal').style.display='none'" style="background:none; border:none; font-size:24px; color:#FAF7F2; cursor:pointer;">✕</button>
        </div>
        <div style="max-height:70vh; overflow:hidden; border-radius:12px; display:flex; align-items:center; justify-content:center; background:#000;">
          <img id="lightboxImg" src="" style="max-width:100%; max-height:70vh; object-fit:contain;" alt="Förstorad hundbild">
        </div>
        <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <p id="lightboxCaption" style="margin:0; font-size:14px; color:#FAF7F2; font-weight:600;"></p>
          <div style="display:flex; gap:8px;">
            <a id="lightboxDownloadBtn" href="" download="hundapp-foto.jpg" class="btn btn-outline btn-sm" style="border-color:rgba(255,255,255,0.4); color:#FAF7F2;">📥 Ladda ner</a>
            <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('photoLightboxModal').style.display='none'">Stäng</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('lightboxImg').src = photoUrl;
  document.getElementById('lightboxCaption').textContent = caption || '';
  document.getElementById('lightboxMetaStr').textContent = metaStr || '';
  document.getElementById('lightboxDownloadBtn').href = photoUrl;
  modal.style.display = 'flex';
};
