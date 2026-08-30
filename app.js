/**
 * ============================================================================
 * 🐾 HundApp - Central Interactive Engine (v1.5.0)
 * ============================================================================
 * Fast, Robust, Clean & Fully Error-Proof Architecture:
 * 
 * Section 01: Storage & Utility Engine (safeStorage, debounce, escapeHtml, showToast, formatHumanDate, calculateAge)
 * Section 02: i18n Translation Dictionary & Switcher (SV / EN)
 * Section 03: Global Navigation, User Dropdown & Modal Management
 * Section 04: Dog Profile State & Multi-Dog Management
 * Section 05: Home Page Engine (index.html: Live Stats Strip, Reviews Modal, Community Poll, FAQs)
 * Section 06: Tips Library Engine (tips.html: 25 Evidence-Based Tips, Categories, Search, Favorites, Detail Modal)
 * Section 07: Walks & Activity Tracker Engine (walks.html: Walk & Activity Modals, Pills, Live Counters, Activity Logs)
 * Section 08: Dog Health & Statistics Engine (statistics.html: SVG Walk Chart, Donut Breakdown, Weight Trend, Print)
 * Section 09: Dog Health Journal & Allergen Profile Engine (portal.html: Routines, Allergy Modal, Dog Switcher)
 * Section 10: Dog Profiles & Vaccination Engine (dogs.html: Chip Copy, Add Dog Modal, Edit Dog Modal, Vaccines)
 * Section 11: Interactive Calendar & Routine Planner (calendar.html: Month/Agenda, Categories, Dog Birthday, Add Reminder)
 * Section 12: Community Suggestions & Voting Engine (suggestions.html: 25 Community Ideas, Mail to Admin, Upvoting)
 * Section 13: Authentication & Security Engine (login.html & register.html: Password Strength, Demo Login, Modals)
 * Section 14: Global Application Bootstrapper
 * ============================================================================
 */

'use strict';

/* ============================================================================
   SECTION 01: STORAGE & UTILITY ENGINE
   ============================================================================ */
const STORAGE_KEYS = {
  LANGUAGE: 'hundapp-language',
  THEME: 'hundapp-theme',
  USER_NAME: 'hundapp-user-name',
  AUTH_USER: 'hundapp-auth-user',
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
 * Safe localStorage wrapper with JSON parsing and error recovery
 */
const safeStorage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return fallback;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (err) {
      console.warn(`[HundApp Storage] Could not read '${key}':`, err);
      return fallback;
    }
  },
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[HundApp Storage] Could not write '${key}':`, err);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[HundApp Storage] Could not remove '${key}':`, err);
      return false;
    }
  }
};

/**
 * Debounce helper to optimize search inputs
 */
function debounce(fn, delay = 160) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Escape HTML to safeguard against XSS vulnerabilities
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Global toast notification system with accessibility support
 */
function showToast(message, icon = '🐾', duration = 3200) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<span id="toast-icon">🐾</span> <span id="toast-text"></span>';
    document.body.appendChild(toast);
  }

  const iconEl = document.getElementById('toast-icon');
  const textEl = document.getElementById('toast-text');

  if (iconEl) iconEl.textContent = icon;
  if (textEl) textEl.textContent = message;

  toast.classList.remove('show');
  void toast.offsetWidth; // Force CSS reflow
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Format date into Swedish or English human-readable string
 */
function formatHumanDate(dateStr, lang = 'sv') {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsSv = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = lang === 'en' ? monthsEn : monthsSv;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculate age string from birthday
 */
function calculateAge(birthdayStr, lang = 'sv') {
  if (!birthdayStr) return lang === 'en' ? 'Age unknown' : 'Ålder okänd';
  const birth = new Date(birthdayStr);
  if (isNaN(birth.getTime())) return lang === 'en' ? 'Age unknown' : 'Ålder okänd';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (years < 1) {
    return lang === 'en' ? `${months} months` : `${months} månader`;
  } else if (years === 1) {
    return lang === 'en' ? '1 år' : '1 år';
  } else {
    return lang === 'en' ? `${years} years` : `${years} år`;
  }
}

/* ============================================================================
   SECTION 02: i18n TRANSLATION DICTIONARY
   ============================================================================ */
const translations = {
  sv: {
    nav_home: 'Hem',
    nav_tips: 'Tips & Råd',
    nav_portal: 'Hundportalen',
    nav_walks: 'Promenader',
    nav_stats: 'Statistik',
    nav_dogs: 'Mina Hundar',
    nav_calendar: 'Kalender',
    nav_suggestions: 'Förslag & Idéer',
    nav_login: 'Logga in',
    nav_register: 'Skapa konto',
    toast_welcome: 'Välkommen till HundApp!',
    toast_saved: 'Sparat!',
    toast_deleted: 'Borttaget!',
    toast_copied: 'Kopierat till urklipp!',
    toast_error_fields: 'Vänligen fyll i alla obligatoriska fält.',
    btn_save: 'Spara',
    btn_cancel: 'Avbryt',
    btn_delete: 'Ta bort',
    filter_all: 'Alla',
    filter_features: 'Appfunktioner',
    filter_health: 'Hundhälsa',
    filter_training: 'Träning',
    filter_daily: 'Vardag',
    filter_nutrition: 'Foder',
    filter_food: 'Foder',
    filter_puppy: 'Valp',
    filter_care: 'Skötsel',
    filter_vet: 'Veterinär',
    filter_activity: 'Aktivitet',
    filter_birthday: 'Födelsedag'
  },
  en: {
    nav_home: 'Home',
    nav_tips: 'Tips & Guides',
    nav_portal: 'Dog Portal',
    nav_walks: 'Walks',
    nav_stats: 'Statistics',
    nav_dogs: 'My Dogs',
    nav_calendar: 'Calendar',
    nav_suggestions: 'Suggestions & Ideas',
    nav_login: 'Sign In',
    nav_register: 'Sign Up',
    toast_welcome: 'Welcome to HundApp!',
    toast_saved: 'Saved!',
    toast_deleted: 'Deleted!',
    toast_copied: 'Copied to clipboard!',
    toast_error_fields: 'Please fill in all required fields.',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_delete: 'Delete',
    filter_all: 'All',
    filter_features: 'App Features',
    filter_health: 'Dog Health',
    filter_training: 'Training',
    filter_daily: 'Daily Life',
    filter_nutrition: 'Nutrition',
    filter_food: 'Food',
    filter_puppy: 'Puppy',
    filter_care: 'Care',
    filter_vet: 'Vet',
    filter_activity: 'Activity',
    filter_birthday: 'Birthday'
  }
};

let currentLang = safeStorage.get(STORAGE_KEYS.LANGUAGE, 'sv');

function setLanguage(lang) {
  if (lang !== 'sv' && lang !== 'en') lang = 'sv';
  currentLang = lang;
  safeStorage.set(STORAGE_KEYS.LANGUAGE, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = lang;
}

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

/* ============================================================================
   SECTION 03: GLOBAL NAVIGATION & MODAL MANAGEMENT
   ============================================================================ */
function initGlobalNavigation() {
  // Mobile hamburger menu toggle
  const navToggle = document.querySelector('.mobile-nav-toggle') || document.querySelector('.nav-toggle') || document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-links-wrap') || document.querySelector('.nav-links') || document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Update nav user display if logged in
  const authUser = safeStorage.get(STORAGE_KEYS.AUTH_USER);
  const userNavName = document.getElementById('userNavName');
  const userAvatarLetter = document.getElementById('userAvatarLetter');

  if (authUser && authUser.name) {
    if (userNavName) userNavName.textContent = authUser.name;
    if (userAvatarLetter) userAvatarLetter.textContent = authUser.name.charAt(0).toUpperCase();
  }

  // Modal Escape key and backdrop click listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active, .modal-overlay.active, [role="dialog"].active').forEach(modal => {
        closeModal(modal);
      });
    }
  });

  document.querySelectorAll('.modal-overlay, .modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  document.querySelectorAll('[data-modal-close], .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal, .modal-overlay, [role="dialog"]');
      if (modal) closeModal(modal);
    });
  });
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const firstInput = modalEl.querySelector('input:not([type="hidden"]), select, textarea, button:not(.modal-close-btn)');
  if (firstInput) setTimeout(() => firstInput.focus(), 80);
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

/* ============================================================================
   SECTION 04: DOG PROFILE STATE & MULTI-DOG MANAGEMENT
   ============================================================================ */
const DEFAULT_DOGS = [
  {
    id: 'bella',
    name: 'Bella',
    breed: 'Golden retriever',
    gender: 'Tik',
    birthday: '2023-06-14',
    weight: 28.5,
    chipNumber: '752098100234567',
    insurance: 'Agria Djurförsäkring',
    allergies: ['Kycklingprotein', 'Soja'],
    diet: 'Hypoallergent foder (Lamm & Ris), 2 portioner per dag',
    dietNotes: 'Ge aldrig tillagade ben eller kycklingsnacks.',
    avatar: 'golden',
    vaccinations: [
      { name: 'DHPPI (Nobivac)', date: '2025-05-10', validUntil: '2028-05-10' },
      { name: 'Rabies', date: '2024-08-15', validUntil: '2027-08-15' },
      { name: 'Leptospiros', date: '2025-05-10', validUntil: '2026-05-10' }
    ]
  },
  {
    id: 'max',
    name: 'Max',
    breed: 'Fransk Bulldogg',
    gender: 'Hane',
    birthday: '2022-11-20',
    weight: 12.8,
    chipNumber: '752098100987654',
    insurance: 'Folksam Djur',
    allergies: ['Nötkött'],
    diet: 'Kornfritt foder för små raser, 2 portioner per dag',
    dietNotes: 'Överkänslig mot fettrik mat.',
    avatar: 'frenchie',
    vaccinations: [
      { name: 'DHPPI (Nobivac)', date: '2024-11-12', validUntil: '2027-11-12' },
      { name: 'Kennelhosta (BbPi)', date: '2025-09-01', validUntil: '2026-09-01' }
    ]
  }
];

function getDogsList() {
  const list = safeStorage.get(STORAGE_KEYS.DOGS_LIST);
  if (!list || !Array.isArray(list) || list.length === 0) {
    safeStorage.set(STORAGE_KEYS.DOGS_LIST, DEFAULT_DOGS);
    return DEFAULT_DOGS;
  }
  return list;
}

function saveDogsList(dogs) {
  safeStorage.set(STORAGE_KEYS.DOGS_LIST, dogs);
}

function getActiveDog() {
  const dogs = getDogsList();
  const activeId = safeStorage.get(STORAGE_KEYS.ACTIVE_DOG_ID, 'bella');
  const found = dogs.find(d => d.id === activeId);
  return found || dogs[0] || DEFAULT_DOGS[0];
}

function setActiveDog(dogId) {
  safeStorage.set(STORAGE_KEYS.ACTIVE_DOG_ID, dogId);
  updateActiveDogGlobalUI();
  window.dispatchEvent(new CustomEvent('hundapp:activeDogChanged', { detail: { dogId } }));
}

function updateActiveDogGlobalUI() {
  const dog = getActiveDog();
  if (!dog) return;

  // Active dog name text
  document.querySelectorAll('.active-dog-name, #activeDogName, #calDogName, #dogBellaName').forEach(el => {
    el.textContent = dog.name;
  });

  // Active dog breed & age summary
  document.querySelectorAll('.active-dog-meta, #calDogMeta').forEach(el => {
    const ageStr = calculateAge(dog.birthday, currentLang);
    const bdayStr = formatHumanDate(dog.birthday, currentLang).replace(/ \d{4}$/, '');
    el.textContent = `${dog.breed} · ${ageStr}, ${bdayStr}`;
  });

  // Active dog weight
  document.querySelectorAll('#dogBellaWeight').forEach(el => {
    el.textContent = `${dog.weight} kg`;
  });

  // Active dog chip code
  document.querySelectorAll('#bellaChipCode').forEach(el => {
    el.textContent = dog.chipNumber || '752098100234567';
  });

  // Active dog avatar initial
  document.querySelectorAll('#calDogAvatar').forEach(el => {
    el.textContent = dog.name.charAt(0);
  });
}

/* ============================================================================
   SECTION 05: HOME PAGE ENGINE (index.html)
   ============================================================================ */
function initHomePage() {
  const liveRatingVal = document.getElementById('live-rating-value');
  const liveRatingLabel = document.getElementById('live-rating-label');
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewsSubtitle = document.getElementById('reviews-subtitle');
  const openReviewModalBtn = document.getElementById('open-review-modal-btn');
  const reviewModal = document.getElementById('review-modal');
  const reviewForm = document.getElementById('review-form');

  function renderHomeReviews() {
    const reviews = safeStorage.get(STORAGE_KEYS.REVIEWS, []);

    // 1. Update stats strip rating: display "— / 5" until real reviews exist
    if (liveRatingVal) {
      if (reviews.length === 0) {
        liveRatingVal.textContent = '— / 5';
        if (liveRatingLabel) liveRatingLabel.textContent = 'Betyg från hundägare';
      } else {
        const avg = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length;
        liveRatingVal.textContent = `${avg.toFixed(1)} / 5`;
        if (liveRatingLabel) liveRatingLabel.textContent = `Betyg (${reviews.length} ${reviews.length === 1 ? 'omdöme' : 'omdömen'})`;
      }
    }

    // 2. Render reviews section
    if (reviewsContainer) {
      if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
          <div class="reviews-empty-state">
            <div class="empty-icon">💬</div>
            <h3>Bli först med att dela din upplevelse!</h3>
            <p>Vi har precis öppnat omdömespanelen. Testa appen och berätta vad du och din hund tycker.</p>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('open-review-modal-btn')?.click()">Skriv ett omdöme</button>
          </div>
        `;
        if (reviewsSubtitle) {
          reviewsSubtitle.textContent = 'Inga omdömen än. Dela din upplevelse nedan!';
        }
      } else {
        if (reviewsSubtitle) {
          reviewsSubtitle.textContent = `Här är vad ${reviews.length} nöjda hundägare säger om HundApp:`;
        }
        reviewsContainer.innerHTML = reviews.map(r => {
          const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
          return `
            <div class="review-card">
              <div class="review-header">
                <div class="review-avatar">${escapeHtml(r.name.charAt(0))}</div>
                <div class="review-meta">
                  <h4>${escapeHtml(r.name)}</h4>
                  <span class="review-breed">${r.breed ? escapeHtml(r.breed) : 'Hundägare'}</span>
                </div>
                <div class="review-rating" aria-label="${r.rating} av 5 stjärnor">${stars}</div>
              </div>
              <p class="review-text">"${escapeHtml(r.text)}"</p>
              <div class="review-footer">
                <span class="review-date">${formatHumanDate(r.date, currentLang)}</span>
              </div>
            </div>
          `;
        }).join('');
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

  // Star rating selector inside review modal
  const starPicker = document.getElementById('review-star-picker');
  const ratingInput = document.getElementById('review-rating-input');

  if (starPicker && ratingInput) {
    const starBtns = starPicker.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = parseInt(btn.getAttribute('data-rating') || '5', 10);
        ratingInput.value = rating;
        starBtns.forEach(b => {
          const bRating = parseInt(b.getAttribute('data-rating') || '5', 10);
          b.classList.toggle('active', bRating <= rating);
        });
      });
    });
  }

  // Submit review
  if (reviewForm && reviewModal) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('review-name');
      const textInput = document.getElementById('review-text');
      const ratingVal = parseInt(ratingInput?.value || '5', 10);

      const name = nameInput?.value.trim();
      const text = textInput?.value.trim();

      if (!name || !text) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const newReview = {
        id: 'rev-' + Date.now(),
        name,
        breed: activeDog?.breed ? `${activeDog.name} (${activeDog.breed})` : 'Hundägare',
        rating: ratingVal,
        text,
        date: new Date().toISOString()
      };

      const reviews = safeStorage.get(STORAGE_KEYS.REVIEWS, []);
      reviews.unshift(newReview);
      safeStorage.set(STORAGE_KEYS.REVIEWS, reviews);

      closeModal(reviewModal);
      showToast('Tack för ditt omdöme! ⭐', '🎉');
      renderHomeReviews();
    });
  }

  renderHomeReviews();
}

/* ============================================================================
   SECTION 06: TIPS LIBRARY ENGINE (tips.html)
   ============================================================================ */
const tipLibrary = [
  // Hälsa (1-5)
  {
    id: 'tip-1',
    category: 'health',
    title: 'Sommarvärme & Bilfaror',
    summary: 'Lämna aldrig hunden i en varm bil – kupétemperaturen stiger livsfarligt snabbt även i skugga.',
    fullText: 'En parkerad bil blir snabbt en dödsfälla även vid måttliga yttertemperaturer. Vid 20°C utomhus kan kupén nå 40–50°C på bara en halvtimme, även med fönstren på glänt. Tecken på värmeslag är kraftig flämtning, dregling, vinglighet och mörkrött tandkött. Kyl hunden försiktigt med ljummet eller svalt (aldrig iskallt) vatten på tassar och mage, och kontakta omedelbart veterinär.',
    tags: ['Värmeslag', 'Sommar', 'Säkerhet'],
    evidenceNote: 'Källa: Enligt Jordbruksverket och Statens veterinärmedicinska anstalt (SVA).'
  },
  {
    id: 'tip-2',
    category: 'health',
    title: 'Fästingskydd & Fästingburna Sjukdomar',
    summary: 'Kontrollera pälsen dagligen och använd beprövade fästingpreparat under säsongen.',
    fullText: 'Fästingar kan överföra Borrelia, Anaplasma och TBE. Gå igenom hundens päls, öron, armhålor och ljumskar efter varje skogspromenad. Ta bort fästingar omedelbart med en fästingplockare genom ett rakt drag nära huden. Rådgör med veterinär om halsband, spot-on-droppar eller receptbelagda tabletter som passar just din hunds hälsa och livsstil.',
    tags: ['Fästingar', 'Parasiter', 'Förebyggande'],
    evidenceNote: 'Källa: Rekommenderat av Svenska Veterinärförbundet.'
  },
  {
    id: 'tip-3',
    category: 'health',
    title: 'Daglig Tandvård för Starka Tänder',
    summary: 'Regelbunden tandborstning förebygger tandsten, tandlossning och smärtsamma infektioner.',
    fullText: 'Över 80 % av hundar över tre år drabbas av tandproblem. Tandborstning med enzymatisk hundtandkräm är den mest effektiva metoden. Vänj hunden stegvis genom att smaka på tandkrämen och borsta några tänder i taget. Använd aldrig human tandkräm då den innehåller fluor och xylitol som är giftigt för hundar.',
    tags: ['Tandvård', 'Förebyggande', 'Hygien'],
    evidenceNote: 'Källa: Evidensbaserad rekommendation från veterinärmedicinsk tandvårdsforskning.'
  },
  {
    id: 'tip-4',
    category: 'health',
    title: 'Första Hjälpen & Akutkit för Hund',
    summary: 'Ha alltid ett uppdaterat förbandskit och veterinärens journummer till hands.',
    fullText: 'Ett bra första hjälpen-kit för hund bör innehålla självhäftande elastisk linda, sterila kompresser, koksaltlösning för sårtvätt, fästingplockare, klotång med blodstoppande pulver, pincett och digital termometer (normal temp är 38,0–39,0°C). Spara jourveterinärens telefonnummer i mobilen.',
    tags: ['Första Hjälpen', 'Akut', 'Trygghet'],
    evidenceNote: 'Källa: Utarbetat enligt djursjukvårdens standardrutiner.'
  },
  {
    id: 'tip-5',
    category: 'health',
    title: 'Giftiga Livsmedel att Se Upp För',
    summary: 'Choklad, vindruvor, lök, xylitol och jäsande degar kan orsaka allvarlig förgiftning.',
    fullText: 'Många vanliga livsmedel är höggradigt toxiska för hundar. Teobromin i kakao orsakar hjärtklappning och kramper, medan vindruvor och russin kan leda till akut njursvikt. Sötningsmedlet xylitol orsakar kraftigt blodsockerfall och leverskador. Misstänker du förgiftning – kontakta veterinär omedelbart och ta med förpackningen.',
    tags: ['Giftigt', 'Kost', 'Akut'],
    evidenceNote: 'Källa: Giftinformationscentralen & SVA rådgivning.'
  },

  // Träning (6-10)
  {
    id: 'tip-6',
    category: 'training',
    title: 'Koppelträning med Positiv Förstärkning',
    summary: 'Belöna kontakt och slakt koppel istället för att rycka eller straffa.',
    fullText: 'Lär hunden att ett slakt koppel leder till framsteg och trevliga belöningar. Stanna mjukt upp så fort kopplet sträcks, och belöna ögonkontakt eller när hunden vänder sig mot dig. Genom konsekvens och rikligt med godis vid din sida bygger du en trygg och dragfri promenad utan obehagliga ryck.',
    tags: ['Koppel', 'Positiv Förstärkning', 'Vardagslydnad'],
    evidenceNote: 'Källa: Baserat på modern etologi och belöningsbaserad inlärningsteori.'
  },
  {
    id: 'tip-7',
    category: 'training',
    title: 'Säker & Pålitlig Inkallning',
    summary: 'Bygg en oemotståndlig inkallningssignal med superbelöningar och glad ton.',
    fullText: 'En pålitlig inkallning är en livförsäkring för din hund. Välj en distinkt signal (visselpipa eller ett unikt ord) och belöna alltid med jackpotbelöning – t.ex. mjukost på tub, köttbullar eller favoritleksak. Kalla aldrig in hunden för att ge bannor eller avsluta något roligt.',
    tags: ['Inkallning', 'Säkerhet', 'Lydnad'],
    evidenceNote: 'Källa: Standardmetod inom certifierad hundinstruktörsutbildning.'
  },
  {
    id: 'tip-8',
    category: 'training',
    title: 'Nosaktivering & Mental Träning',
    summary: '15 minuters nosarbete tröttar ut och tillfredsställer hunden mer än en milslång löptur.',
    fullText: 'Hundens luktsinne är dess primära sinne och aktiverar stora delar av hjärnan. Prova personsök, godisträd, doftprov (Nosework) eller enkla söklekar i trädgården eller vardagsrummet. Nosarbete minskar stresshormoner och bygger ett starkt självförtroende.',
    tags: ['Nosarbete', 'Mental stimulans', 'Berikning'],
    evidenceNote: 'Källa: Vetenskapliga studier på hundens kognition och stressreducering.'
  },
  {
    id: 'tip-9',
    category: 'training',
    title: 'Trygg Hantering & Kloklippning',
    summary: 'Dela upp hanteringen i mikrosteg och belöna frivillig medverkan (Cooperative Care).',
    fullText: 'Träna hantering och kloklippning i korta, positiva sessioner. Låt hunden nosa på tången, belöna när du rör en tass, och klipp bara en klo per dag i början. Genom frivillig hantering slipper ni fasthållning och stress, vilket gör veterinärbesök och pälsvård lekande lätt.',
    tags: ['Kloklippning', 'Hantering', 'Frivillig vård'],
    evidenceNote: 'Källa: Cooperative Care-principer utvecklade av beteendevetare.'
  },
  {
    id: 'tip-10',
    category: 'training',
    title: 'Passivitetsträning i Nya Miljöer',
    summary: 'Förmågan att koppla av bland människor och dofter är grunden för en harmonisk hund.',
    fullText: 'Många hundar behöver tränas i konsten att göra ingenting. Sätt dig på en parkbänk eller ett café på behörigt avstånd från störningar. Belöna tystnad och avslappnat kroppsspråk (suckar, att lägga sig på sidan). Gör passivitet till en naturlig del av vardagsrutinen.',
    tags: ['Passivitet', 'Lugn', 'Miljöträning'],
    evidenceNote: 'Källa: Beteendeterapi för reaktiva och stresskänsliga hundar.'
  },

  // Vardag (11-15)
  {
    id: 'tip-11',
    category: 'everyday',
    title: 'Stegvis Ensamhetsträning',
    summary: 'Bygg trygghet vid ensamhet från korta sekunder till lugna timmar.',
    fullText: 'Hundar är flockdjur och behöver lära sig att ensamhet är tryggt och ofarligt. Börja med att stänga dörren till toaletten i några sekunder, gå ut med soporna och öka gradvis tiden. Lämna gärna en aktiveringsleksak med fryst våtfoder så att hunden associerar din frånvaro med något gott och rogivande.',
    tags: ['Ensamhetsträning', 'Trygghet', 'Vardag'],
    evidenceNote: 'Källa: Riktlinjer från Jordbruksverket och etologiska experter.'
  },
  {
    id: 'tip-12',
    category: 'everyday',
    title: 'Säker Biltransport & Krocktestade Burar',
    summary: 'Skydda hunden och medpassagerare med en godkänd bilbur eller säkerhetssele.',
    fullText: 'I Sverige kräver lagen att hundar färdas säkert i fordon så att de inte riskerar skador vid kraftig inbromsning. Välj en krocktestad bur monterad i bagageutrymmet med deformationszon, eller en certifierad bilsele fäst i bilens säkerhetsbälte. Se till att ventilationen är god.',
    tags: ['Bilåkning', 'Trafiksäkerhet', 'Lagkrav'],
    evidenceNote: 'Källa: Trafikverket och Jordbruksverkets transportföreskrifter.'
  },
  {
    id: 'tip-13',
    category: 'everyday',
    title: 'Synlighet i Mörkret med Reflexer & Lampor',
    summary: 'Gör er synliga på 125 meters avstånd med kvalitetsreflexer och LED-lampor.',
    fullText: 'Utan reflexer syns en mörk hund först på 20–30 meters avstånd för en bilist, medan en reflexväst ökar sikten till över 125 meter. Utrusta hunden med reflexväst, lysande halsband och sätt reflexer även på koppel och egna kläder. Byt ut slitna reflexer årligen.',
    tags: ['Mörker', 'Reflexer', 'Säkerhet'],
    evidenceNote: 'Källa: NTF (Nationalföreningen för Trafiksäkerhetens Främjande).'
  },
  {
    id: 'tip-14',
    category: 'everyday',
    title: 'Tassvård mot Vintersalt & Kyla',
    summary: 'Skydda trampdynorna mot vägsalt, isbildning och smärtsamma sprickor.',
    fullText: 'Vägsalt och isklumpar kan torka ut och ge smärtsamma sprickor i trampdynorna. Smörj tassarna med vattenfri tassalva före promenaden och skölj av dem med ljummet vatten efteråt. Klipp bort överflödig päls mellan trampdynorna för att förhindra snöbollsbildning.',
    tags: ['Vinter', 'Tassvård', 'Skötsel'],
    evidenceNote: 'Källa: Svenska Blå Stjärnans skötselrekommendationer.'
  },
  {
    id: 'tip-15',
    category: 'everyday',
    title: 'Vikten av Mental Återhämtning',
    summary: 'Hundar behöver 12–16 timmars sömn och återhämtning per dygn för att må bra.',
    fullText: 'Kronisk överstimulering kan leda till stress, hyperaktivitet och reaktivitet. Se till att din hund har en lugn och skyddad sovplats där den får vara ifred från barn och ljud. Varva aktiva träningsdagar med lugna strosdagar där hunden får nosa i sitt eget tempo.',
    tags: ['Sömn', 'Återhämtning', 'Stresshantering'],
    evidenceNote: 'Källa: Neurobiologisk och etologisk forskning om hundars sömncykler.'
  },

  // Foder & Kost (16-20)
  {
    id: 'tip-16',
    category: 'food',
    title: 'Säkra Tuggben & Råhudsrisker',
    summary: 'Välj säkra natur-tugg och koka/återanvänd aldrig gamla råhudstugg som blivit hala.',
    fullText: 'Tuggande frisätter lugnande endorfiner och främjar tandhälsan. Var dock uppmärksam med hårdpressade råhudsben: när hunden tuggar på dem mjukas de upp till hala remsor som kan fastna i svalg eller orsaka livshotande tarmstopp. Koka aldrig och återanvänd inte mjuka sladdriga råhudsrester. Övervaka alltid tuggstunden och välj gärna säkra alternativ som hjorthorn, torkade oxöron eller klossar av kaffeträ.',
    tags: ['Tuggben', 'Säkerhet', 'Kostråd'],
    evidenceNote: 'Källa: Veterinärmedicinska larmrapporter om främmande föremål och kvävningsrisk.'
  },
  {
    id: 'tip-17',
    category: 'food',
    title: 'Hundens Dagliga Vattenbehov',
    summary: 'En vuxen hund behöver ca 50 ml vatten per kilo kroppsvikt varje dygn.',
    fullText: 'Tillgång till rent och friskt vatten är livsviktigt. Vid torrutfodring, fysisk aktivitet eller varmt väder ökar vätskebehovet markant. Disk ur vattenskålen dagligen för att förhindra bakterietillväxt och ställ ut flera vattenskålar om du har ett stort hus eller trädgård.',
    tags: ['Vatten', 'Hydrering', 'Hälsa'],
    evidenceNote: 'Källa: Klinisk näringslära för hund och katt.'
  },
  {
    id: 'tip-18',
    category: 'food',
    title: 'Portionskontroll & Hullbedömning (BCS)',
    summary: 'Håll hunden i optimal form för ett längre och friskare liv utan ledvärk.',
    fullText: 'Övervikt ökar risken för artros, diabetes och hjärtsjukdomar. Använd Body Condition Score (BCS 1–9) för att bedöma hullet: du ska lätt kunna känna revbenen utan ett tjockt fettlager och se en tydlig midja ovanifrån. Anpassa fodergivan efter aktivitetsnivå och årstid.',
    tags: ['Viktkontroll', 'BCS', 'Hälsa'],
    evidenceNote: 'Källa: WSAVA Global Nutrition Committee guidelines.'
  },
  {
    id: 'tip-19',
    category: 'food',
    title: 'Smart Godisval vid Träning',
    summary: 'Använd små, lättsvalda bitar med hög smaklighet och räkna in dem i dagsransonen.',
    fullText: 'Träningsgodis ska kunna sväljas direkt utan att hunden stannar upp och tuggar. Skär kokt kyckling, torkad lever eller ost i små ärtstora bitar. Om du tränar mycket under en dag, minska mängden foder i matskålen så att hunden bibehåller sin idealvikt.',
    tags: ['Träningsgodis', 'Belöning', 'Kost'],
    evidenceNote: 'Källa: Instruktörsmetodik och näringsmässig balans.'
  },
  {
    id: 'tip-20',
    category: 'food',
    title: 'Skonsam Kost vid Känslig Mage',
    summary: 'Kokt vit fisk och överkokt ris ger magen lugn vid tillfälliga matsmältningsbesvär.',
    fullText: 'Vid akut men lindrig diarré kan mag- och tarmkanalen avlastas med skonkost i små portioner flera gånger per dag. Blanda kokt vit fisk eller kokt kycklingfilé med överkokt vitt ris. Ge rikligt med vätska och tillsätt gärna skonsamma elektrolyter. Kontakta veterinär om hunden blir slö, kräks ihållande eller har blod i avföringen.',
    tags: ['Mage & Tarm', 'Skonkost', 'Vård'],
    evidenceNote: 'Källa: Svenska djursjukhusens rekommendationer vid akut enterit.'
  },

  // Valp (21-25)
  {
    id: 'tip-21',
    category: 'puppy',
    title: 'Den Första Tiden i Nya Hemmet',
    summary: 'Ge valpen trygghet, lugn och närhet de första veckorna innan stora äventyr börjar.',
    fullText: 'Att flytta från mamma och kullsyskon är en enorm omställning. Håll de första dagarna lugna med begränsat besök av gäster. Sov nära valpen så att den känner din trygga närvaro om natten. Låt den i lugn och ro utforska hemmets rum i sin egen takt.',
    tags: ['Valp', 'Trygghet', 'Ny miljö'],
    evidenceNote: 'Källa: Svenska Kennelklubbens (SKK) valpråd.'
  },
  {
    id: 'tip-22',
    category: 'puppy',
    title: 'Rumsrenhet utan Bestraffningar',
    summary: 'Gå ut direkt efter sömn, mat, lek och när valpen börjar nosa och snurra.',
    fullText: 'Valpar har små blåsor och kan inte hålla sig länge. Ta ut valpen på samma trygga rastplats efter varje tupplur, måltid och intensiv lek. Beröm lugnt när valpen gör sina behov utomhus. Händer en olycka inne – torka bara upp lugnt med enzymatiskt rengöringsmedel utan att skälla.',
    tags: ['Rumsrenhet', 'Valpträning', 'Tålamod'],
    evidenceNote: 'Källa: Etologisk inlärningsforskning för valpar.'
  },
  {
    id: 'tip-23',
    category: 'puppy',
    title: 'Hantera Valpbitande & Tandömsning',
    summary: 'Erbjud tillåtna tuggleksaker och avled varsamt när valpens vassa tänder bits.',
    fullText: 'Valpar undersöker hela sin omvärld med munnen och tandömsningen vid 4–6 månader kliar i tandköttet. När valpen biter i händer eller kläder: pipa till mjukt, avbryt leken en kort sekund och erbjud direkt en leksak eller en fuktig kyld snuttefilt som den får bita i.',
    tags: ['Valpbitande', 'Tandömsning', 'Lek'],
    evidenceNote: 'Källa: Beteenderådgivning för valputveckling.'
  },
  {
    id: 'tip-24',
    category: 'puppy',
    title: 'Valpens Enorma Sömnbehov',
    summary: 'En växande valp behöver 18–20 timmars ostörd sömn per dygn för hjärnans utveckling.',
    fullText: 'Valpar som blir övertrötta blir ofta bitiga, vilda och svåra att lugna ner. Hjälp valpen att varva ner genom att sätta dig stilla med den i famnen eller i dess bädd. Se till att alla i familjen respekterar att en sovande valp alltid ska få vara helt ifred.',
    tags: ['Sömn', 'Valpvälfärd', 'Återhämtning'],
    evidenceNote: 'Källa: Utvecklingspsykologi och neurologi hos unghundar.'
  },
  {
    id: 'tip-25',
    category: 'puppy',
    title: 'Vänj Valpen vid Sele & Koppel',
    summary: 'Låt selen vara en signal för godis och roliga stunder redan inomhus.',
    fullText: 'Sätt på selen inomhus korta stunder i samband med utfodring eller lek så att valpen associerar den med glädje. Låt ett lätt koppel släpa efter valpen inomhus under uppsikt innan ni ger er ut på er första lilla promenad på upptäcktsfärd.',
    tags: ['Sele', 'Koppelvana', 'Valpstart'],
    evidenceNote: 'Källa: Positiv miljöträning enligt moderna hundägarriktlinjer.'
  }
];

function initTipsPage() {
  const tipsGrid = document.getElementById('tips-grid');
  if (!tipsGrid) return;

  const searchInput = document.getElementById('tips-search');
  const filterPills = document.querySelectorAll('.tips-category-pill, [data-category]');
  const resultsCountEl = document.getElementById('tips-results-count');
  const emptyStateEl = document.getElementById('tips-empty');
  const detailModal = document.getElementById('tip-detail-modal');
  const detailContent = document.getElementById('tip-detail-content');

  let activeCategory = 'all';

  function updateCategoryCounts() {
    const savedTips = safeStorage.get(STORAGE_KEYS.SAVED_TIPS, []);

    const countAll = document.getElementById('count-all');
    const countHealth = document.getElementById('count-health');
    const countTraining = document.getElementById('count-training');
    const countEveryday = document.getElementById('count-everyday');
    const countFood = document.getElementById('count-food');
    const countPuppy = document.getElementById('count-puppy');
    const countFav = document.getElementById('count-favorites');

    if (countAll) countAll.textContent = tipLibrary.length;
    if (countHealth) countHealth.textContent = tipLibrary.filter(t => t.category === 'health').length;
    if (countTraining) countTraining.textContent = tipLibrary.filter(t => t.category === 'training').length;
    if (countEveryday) countEveryday.textContent = tipLibrary.filter(t => t.category === 'everyday').length;
    if (countFood) countFood.textContent = tipLibrary.filter(t => t.category === 'food').length;
    if (countPuppy) countPuppy.textContent = tipLibrary.filter(t => t.category === 'puppy').length;
    if (countFav) countFav.textContent = savedTips.length;
  }

  function renderTips() {
    const savedTips = safeStorage.get(STORAGE_KEYS.SAVED_TIPS, []);
    const checkedTips = safeStorage.get(STORAGE_KEYS.CHECKED_TIPS, []);
    const query = (searchInput?.value || '').toLowerCase().trim();

    const filtered = tipLibrary.filter(tip => {
      let matchCat = true;
      if (activeCategory === 'favorites') {
        matchCat = savedTips.includes(tip.id);
      } else if (activeCategory !== 'all') {
        matchCat = tip.category === activeCategory;
      }

      const matchQuery = !query ||
        tip.title.toLowerCase().includes(query) ||
        tip.summary.toLowerCase().includes(query) ||
        tip.fullText.toLowerCase().includes(query) ||
        tip.tags.some(t => t.toLowerCase().includes(query));

      return matchCat && matchQuery;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} tips hittades`;
    }

    if (filtered.length === 0) {
      tipsGrid.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    tipsGrid.innerHTML = filtered.map(tip => {
      const isSaved = savedTips.includes(tip.id);
      const isChecked = checkedTips.includes(tip.id);
      return `
        <article class="tip-card ${isChecked ? 'completed' : ''}" data-tip-id="${tip.id}">
          <div class="tip-card-header">
            <span class="badge badge-${tip.category}">${t('filter_' + tip.category)}</span>
            <button type="button" class="favorite-icon-btn ${isSaved ? 'active' : ''}" onclick="window.toggleTipSave('${tip.id}')" title="${isSaved ? 'Ta bort från favoriter' : 'Spara som favorit'}" aria-label="Spara favorit">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>
          <h3 class="tip-title">${escapeHtml(tip.title)}</h3>
          <p class="tip-summary">${escapeHtml(tip.summary)}</p>
          <div class="tip-tags">
            ${tip.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
          </div>
          <div class="tip-card-footer">
            <button type="button" class="btn btn-outline btn-xs" onclick="window.openTipDetail('${tip.id}')">Läs mer</button>
            <label class="tip-checkbox">
              <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="window.toggleTipCheck('${tip.id}', this.checked)">
              <span>Genomfört</span>
            </label>
          </div>
        </article>
      `;
    }).join('');

    updateCategoryCounts();
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.getAttribute('data-category') || 'all';
      filterPills.forEach(p => p.classList.toggle('active', p === pill));
      renderTips();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      renderTips();
    }, 150));
  }

  window.toggleTipSave = (id) => {
    let saved = safeStorage.get(STORAGE_KEYS.SAVED_TIPS, []);
    if (saved.includes(id)) {
      saved = saved.filter(x => x !== id);
      showToast('Borttagen från sparade favoriter');
    } else {
      saved.push(id);
      showToast('Sparad till favoriter! ⭐', '⭐');
    }
    safeStorage.set(STORAGE_KEYS.SAVED_TIPS, saved);
    renderTips();
  };

  window.toggleTipCheck = (id, checked) => {
    let list = safeStorage.get(STORAGE_KEYS.CHECKED_TIPS, []);
    if (checked) {
      if (!list.includes(id)) list.push(id);
      showToast('Bra jobbat! Markerad som genomförd.', '🐾');
    } else {
      list = list.filter(x => x !== id);
    }
    safeStorage.set(STORAGE_KEYS.CHECKED_TIPS, list);
    renderTips();
  };

  window.openTipDetail = (id) => {
    const tip = tipLibrary.find(t => t.id === id);
    if (!tip || !detailModal || !detailContent) return;

    detailContent.innerHTML = `
      <div class="tip-modal-header">
        <span class="badge badge-${tip.category}">${t('filter_' + tip.category)}</span>
        <h2>${escapeHtml(tip.title)}</h2>
      </div>
      <div class="tip-modal-body">
        <p class="lead-summary"><strong>${escapeHtml(tip.summary)}</strong></p>
        <hr class="divider">
        <p class="full-text">${escapeHtml(tip.fullText)}</p>
        <div class="evidence-box">
          <strong>Evidens & Faktagrund:</strong>
          <p>${escapeHtml(tip.evidenceNote)}</p>
        </div>
        <div class="tip-tags">
          ${tip.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    `;
    openModal(detailModal);
  };

  renderTips();
}

/* ============================================================================
   SECTION 07: WALKS & ACTIVITY TRACKER ENGINE (walks.html)
   ============================================================================ */
function initWalksPage() {
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

  // Default walk logs if none exist
  const DEFAULT_WALKS = [
    {
      id: 'w-1',
      dogId: 'bella',
      type: 'Skogspromenad',
      duration: 45,
      distance: 3.4,
      datetime: '2026-08-29T10:30',
      note: 'Morgonrunda i motionsspåret. Bella var pigg och glad!'
    },
    {
      id: 'w-2',
      dogId: 'bella',
      type: 'Kvarterspromenad',
      duration: 25,
      distance: 1.8,
      datetime: '2026-08-28T18:15',
      note: 'Kvällspromenad med koppelträning och passivitet.'
    },
    {
      id: 'w-3',
      dogId: 'bella',
      type: 'Långpromenad',
      duration: 60,
      distance: 5.2,
      datetime: '2026-08-27T14:00',
      note: 'Bad och lek vid sjön.'
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

  function renderWalkLogs() {
    const logs = getWalkLogs();
    const activeDog = getActiveDog();
    const dogLogs = logs.filter(l => !l.dogId || l.dogId === activeDog.id);

    // Update stats strip
    const totalWalks = dogLogs.length;
    const totalTime = dogLogs.reduce((acc, cur) => acc + (cur.duration || 0), 0);
    const totalDist = dogLogs.reduce((acc, cur) => acc + (cur.distance || 0), 0);

    if (statWalkCount) statWalkCount.textContent = totalWalks;
    if (statWalkTime) statWalkTime.textContent = `${totalTime} min`;
    if (statWalkDistance) statWalkDistance.textContent = `${totalDist.toFixed(1)} km`;

    // Activity stats
    const activities = safeStorage.get(STORAGE_KEYS.ACTIVITY_LOGS, [
      { id: 'act-1', type: 'Nosaktivering', duration: 20, datetime: '2026-08-29T16:00' }
    ]);
    if (statActivityCount) statActivityCount.textContent = activities.length;
    if (statActivityTime) statActivityTime.textContent = `${activities.reduce((a, b) => a + (b.duration || 0), 0)} min`;

    if (dogLogs.length === 0) {
      walksList.innerHTML = '<p class="text-muted">Inga loggade promenader ännu. Klicka på "Logga promenad" för att spara din runda!</p>';
      return;
    }

    walksList.innerHTML = dogLogs.map(w => `
      <div class="walk-item-card">
        <div class="walk-icon-badge">🦮</div>
        <div class="walk-info">
          <div class="walk-title-row">
            <h4>${escapeHtml(w.type)}</h4>
            <span class="walk-datetime">${formatHumanDate(w.datetime, currentLang)}</span>
          </div>
          <div class="walk-metrics-row">
            <span>⏱️ ${w.duration} min</span>
            <span>📍 ${w.distance} km</span>
            ${w.note ? `<span class="walk-note-text">"${escapeHtml(w.note)}"</span>` : ''}
          </div>
        </div>
        <button type="button" class="btn-icon delete-log-btn" onclick="window.deleteWalkLog('${w.id}')" title="Ta bort logg">🗑️</button>
      </div>
    `).join('');
  }

  // Open walk modal
  if (logWalkBtn && walkModal) {
    logWalkBtn.addEventListener('click', () => {
      if (walkForm) walkForm.reset();
      const dt = document.getElementById('walk-datetime');
      if (dt) dt.value = new Date().toISOString().slice(0, 16);
      openModal(walkModal);
    });
  }

  // Open activity modal
  if (logActivityBtn && activityModal) {
    logActivityBtn.addEventListener('click', () => {
      if (activityForm) activityForm.reset();
      const dt = document.getElementById('activity-datetime');
      if (dt) dt.value = new Date().toISOString().slice(0, 16);
      openModal(activityModal);
    });
  }

  // Walk pills selection
  const walkTypePills = document.getElementById('walk-type-pills');
  const walkTypeInput = document.getElementById('walk-type-input');
  if (walkTypePills && walkTypeInput) {
    walkTypePills.querySelectorAll('.type-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        walkTypeInput.value = pill.getAttribute('data-type') || pill.textContent;
        walkTypePills.querySelectorAll('.type-pill').forEach(p => p.classList.toggle('active', p === pill));
      });
    });
  }

  // Walk form submit
  if (walkForm && walkModal) {
    walkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = walkTypeInput?.value || 'Skogspromenad';
      const duration = parseInt(document.getElementById('walk-duration')?.value || '0', 10);
      const distance = parseFloat(document.getElementById('walk-distance')?.value || '0');
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
        datetime,
        note
      };

      const logs = getWalkLogs();
      logs.unshift(newWalk);
      safeStorage.set(STORAGE_KEYS.WALK_LOGS, logs);

      closeModal(walkModal);
      showToast('Promenad loggad! 🐾', '🎉');
      renderWalkLogs();
    });
  }

  // Activity form submit
  if (activityForm && activityModal) {
    activityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('activity-type-input')?.value || 'Nosaktivering';
      const duration = parseInt(document.getElementById('activity-duration')?.value || '0', 10);
      const datetime = document.getElementById('activity-datetime')?.value || new Date().toISOString();
      const note = document.getElementById('activity-note')?.value.trim() || '';

      const activities = safeStorage.get(STORAGE_KEYS.ACTIVITY_LOGS, []);
      activities.unshift({
        id: 'act-' + Date.now(),
        dogId: getActiveDog().id,
        type,
        duration,
        datetime,
        note
      });
      safeStorage.set(STORAGE_KEYS.ACTIVITY_LOGS, activities);

      closeModal(activityModal);
      showToast('Aktivitet sparad! 🧠', '🎉');
      renderWalkLogs();
    });
  }

  window.deleteWalkLog = (id) => {
    let logs = getWalkLogs();
    logs = logs.filter(w => w.id !== id);
    safeStorage.set(STORAGE_KEYS.WALK_LOGS, logs);
    showToast(t('toast_deleted'));
    renderWalkLogs();
  };

  renderWalkLogs();
}

/* ============================================================================
   SECTION 08: DOG HEALTH & STATISTICS ENGINE (statistics.html)
   ============================================================================ */
function initStatisticsPage() {
  const statsContainer = document.getElementById('walkChartContainer');
  if (!statsContainer) return;

  const dogSelect = document.getElementById('stat-dog-select');
  const printBtn = document.getElementById('print-stats-btn');
  const openWeightModalBtn = document.getElementById('open-weight-modal-btn');
  const quickAddWeightBtn = document.getElementById('quickAddWeightBtn');
  const weightModal = document.getElementById('log-weight-modal');

  // Populate dog select
  if (dogSelect) {
    const dogs = getDogsList();
    const activeDog = getActiveDog();
    dogSelect.innerHTML = dogs.map(d => `<option value="${d.id}" ${d.id === activeDog.id ? 'selected' : ''}>${escapeHtml(d.name)} (${escapeHtml(d.breed)})</option>`).join('');
    dogSelect.addEventListener('change', (e) => {
      setActiveDog(e.target.value);
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Weight modal open
  if ((openWeightModalBtn || quickAddWeightBtn) && weightModal) {
    [openWeightModalBtn, quickAddWeightBtn].filter(Boolean).forEach(btn => {
      btn.addEventListener('click', () => {
        openModal(weightModal);
      });
    });
  }

  function renderStats() {
    const activeDog = getActiveDog();
    const logs = safeStorage.get(STORAGE_KEYS.WALK_LOGS, []);
    const dogLogs = logs.filter(l => !l.dogId || l.dogId === activeDog.id);

    const totalKm = dogLogs.reduce((acc, cur) => acc + (cur.distance || 0), 0);
    const totalMin = dogLogs.reduce((acc, cur) => acc + (cur.duration || 0), 0);
    const totalCount = dogLogs.length;

    const countEl = document.getElementById('stat-walks-count');
    const timeEl = document.getElementById('stat-time-total');
    const distEl = document.getElementById('stat-distance-total');
    const headingEl = document.getElementById('stats-main-heading');
    const eyebrowEl = document.getElementById('stats-dog-eyebrow');

    if (countEl) countEl.textContent = totalCount;
    if (timeEl) timeEl.textContent = `${totalMin} min`;
    if (distEl) distEl.textContent = `${totalKm.toFixed(1)} km`;
    if (headingEl) headingEl.textContent = `Aktivitetsstatistik för ${activeDog.name}`;
    if (eyebrowEl) eyebrowEl.textContent = `${activeDog.breed} · ${calculateAge(activeDog.birthday, currentLang)}`;

    // Current weight
    const weightNumEl = document.getElementById('currentWeightNum');
    if (weightNumEl) weightNumEl.textContent = `${activeDog.weight} kg`;
  }

  window.addEventListener('hundapp:activeDogChanged', () => {
    renderStats();
  });

  renderStats();
}

/* ============================================================================
   SECTION 09: DOG HEALTH JOURNAL & ALLERGEN ENGINE (portal.html)
   ============================================================================ */
function initPortalPage() {
  const portalCurrentDate = document.getElementById('portalCurrentDate');
  if (!portalCurrentDate) return;

  // Set current date string
  portalCurrentDate.textContent = formatHumanDate(new Date().toISOString(), currentLang);

  const greetingName = document.getElementById('portalGreetingName');
  const greetingSub = document.getElementById('portalGreetingSub');
  const activeDogName = document.getElementById('activeDogName');
  const activeDog = getActiveDog();

  if (greetingName) greetingName.textContent = `Hej ${safeStorage.get(STORAGE_KEYS.AUTH_USER)?.name || 'Hundägare'}! 🐾`;
  if (greetingSub) greetingSub.textContent = `Här är översikten för din hund ${activeDog.name}.`;
  if (activeDogName) activeDogName.textContent = activeDog.name;

  // Render routine checklist checkmarks
  const completedRoutines = safeStorage.get(STORAGE_KEYS.COMPLETED_ROUTINES, []);
  document.querySelectorAll('.routine-checkbox, input[type="checkbox"][id^="claw"], input[type="checkbox"][id^="tick"], input[type="checkbox"][id^="vet"]').forEach(chk => {
    chk.checked = completedRoutines.includes(chk.id);
    chk.addEventListener('change', () => {
      let list = safeStorage.get(STORAGE_KEYS.COMPLETED_ROUTINES, []);
      if (chk.checked) {
        if (!list.includes(chk.id)) list.push(chk.id);
        showToast('Rutinen genomförd! Bra jobbat! 🐾', '✓');
      } else {
        list = list.filter(x => x !== chk.id);
      }
      safeStorage.set(STORAGE_KEYS.COMPLETED_ROUTINES, list);
    });
  });

  // Allergy modal
  const openAllergyModalBtn = document.getElementById('openAllergyModalBtn') || document.getElementById('editAllergyBtn');
  const allergyModal = document.getElementById('allergy-modal');
  const allergyForm = document.getElementById('allergy-form');

  if (openAllergyModalBtn && allergyModal) {
    openAllergyModalBtn.addEventListener('click', () => {
      const customInput = document.getElementById('custom-allergy-input');
      const dietInput = document.getElementById('diet-name-input');
      const notesInput = document.getElementById('safety-notes-input');

      const dog = getActiveDog();
      if (customInput) customInput.value = (dog.allergies || []).join(', ');
      if (dietInput) dietInput.value = dog.diet || '';
      if (notesInput) notesInput.value = dog.dietNotes || '';

      openModal(allergyModal);
    });
  }

  if (allergyForm && allergyModal) {
    allergyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customInput = document.getElementById('custom-allergy-input')?.value;
      const dietInput = document.getElementById('diet-name-input')?.value;
      const notesInput = document.getElementById('safety-notes-input')?.value;

      const dogs = getDogsList();
      const dog = dogs.find(d => d.id === getActiveDog().id);

      if (dog) {
        if (customInput !== undefined) {
          dog.allergies = customInput.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (dietInput !== undefined) dog.diet = dietInput;
        if (notesInput !== undefined) dog.dietNotes = notesInput;

        saveDogsList(dogs);
        showToast('Foder- och allergiprofil sparad!', '✓');
        closeModal(allergyModal);
        updateActiveDogGlobalUI();
      }
    });
  }

  // Dog switcher modal
  const switchDogBtn = document.getElementById('switchDogBtn');
  const dogSwitchModal = document.getElementById('dog-switch-modal');
  const confirmDogSwitchBtn = document.getElementById('confirm-dog-switch-btn');

  if (switchDogBtn && dogSwitchModal) {
    switchDogBtn.addEventListener('click', () => {
      openModal(dogSwitchModal);
    });
  }

  if (confirmDogSwitchBtn && dogSwitchModal) {
    confirmDogSwitchBtn.addEventListener('click', () => {
      const selectedRadio = dogSwitchModal.querySelector('input[name="dogRadio"]:checked');
      if (selectedRadio) {
        setActiveDog(selectedRadio.value);
        showToast('Bytte aktiv hund!', '🐾');
        closeModal(dogSwitchModal);
        window.location.reload();
      }
    });
  }
}

/* ============================================================================
   SECTION 10: DOG PROFILES & VACCINATIONS ENGINE (dogs.html)
   ============================================================================ */
function initDogsPage() {
  const dogProfilesContainer = document.getElementById('dogProfilesContainer');
  if (!dogProfilesContainer) return;

  const addDogBtn = document.getElementById('add-dog-button') || document.getElementById('open-add-dog-card-btn');
  const addDogModal = document.getElementById('add-dog-modal');
  const addDogForm = document.getElementById('add-dog-form');
  const editDogModal = document.getElementById('edit-dog-modal');
  const editDogForm = document.getElementById('edit-dog-form');
  const copyChipBtn = document.getElementById('copyChipBtn');

  // Copy chip number
  if (copyChipBtn) {
    copyChipBtn.addEventListener('click', () => {
      const chipCode = document.getElementById('bellaChipCode')?.textContent || '752098100234567';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(chipCode).then(() => {
          showToast(t('toast_copied'), '📋');
        }).catch(() => {
          showToast(`Chip: ${chipCode}`, '📋');
        });
      } else {
        showToast(`Chip: ${chipCode}`, '📋');
      }
    });
  }

  // Open add dog modal
  if (addDogBtn && addDogModal) {
    addDogBtn.addEventListener('click', () => {
      if (addDogForm) addDogForm.reset();
      openModal(addDogModal);
    });
  }

  // Add dog submit
  if (addDogForm && addDogModal) {
    addDogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-dog-name')?.value.trim();
      const breed = document.getElementById('new-dog-breed')?.value.trim();
      const gender = document.getElementById('new-dog-gender')?.value || 'Tik';
      const birth = document.getElementById('new-dog-birth')?.value;
      const weight = parseFloat(document.getElementById('new-dog-weight')?.value || '10');
      const chip = document.getElementById('new-dog-chip')?.value.trim();
      const insurance = document.getElementById('new-dog-insurance')?.value.trim();
      const allergies = document.getElementById('new-dog-allergies')?.value.trim();

      if (!name || !breed || !birth) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      const newDog = {
        id: 'dog-' + Date.now(),
        name,
        breed,
        gender,
        birthday: birth,
        weight,
        chipNumber: chip,
        insurance,
        allergies: allergies ? allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        diet: 'Standard foder',
        vaccinations: [
          { name: 'DHPPI (Nobivac)', date: new Date().toISOString().split('T')[0], validUntil: '2028-05-10' }
        ]
      };

      const dogs = getDogsList();
      dogs.push(newDog);
      saveDogsList(dogs);
      setActiveDog(newDog.id);

      closeModal(addDogModal);
      showToast('Hundprofil sparad! 🐶', '🎉');
      window.location.reload();
    });
  }

  // Edit dog handlers
  const editBellaBtn = document.getElementById('edit-bella-btn');
  if (editBellaBtn && editDogModal) {
    editBellaBtn.addEventListener('click', () => {
      const activeDog = getActiveDog();
      const nameInput = document.getElementById('edit-dog-name');
      const breedInput = document.getElementById('edit-dog-breed');
      const chipInput = document.getElementById('edit-dog-chip');
      const insuranceInput = document.getElementById('edit-dog-insurance');

      if (nameInput) nameInput.value = activeDog.name;
      if (breedInput) breedInput.value = activeDog.breed;
      if (chipInput) chipInput.value = activeDog.chipNumber || '';
      if (insuranceInput) insuranceInput.value = activeDog.insurance || '';

      openModal(editDogModal);
    });
  }

  if (editDogForm && editDogModal) {
    editDogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dogs = getDogsList();
      const activeDog = getActiveDog();
      const d = dogs.find(x => x.id === activeDog.id);

      if (d) {
        d.name = document.getElementById('edit-dog-name')?.value.trim() || d.name;
        d.breed = document.getElementById('edit-dog-breed')?.value.trim() || d.breed;
        d.chipNumber = document.getElementById('edit-dog-chip')?.value.trim() || d.chipNumber;
        d.insurance = document.getElementById('edit-dog-insurance')?.value.trim() || d.insurance;
        saveDogsList(dogs);
        showToast(t('toast_saved'), '✓');
        closeModal(editDogModal);
        updateActiveDogGlobalUI();
      }
    });
  }
}

/* ============================================================================
   SECTION 11: INTERACTIVE CALENDAR & ROUTINE PLANNER (calendar.html)
   ============================================================================ */
let currentCalDate = new Date();
let activeCalendarFilter = 'all';
let currentCalendarView = 'month';

const DEFAULT_CALENDAR_EVENTS = [
  {
    id: 'evt-1',
    dogId: 'bella',
    title: 'Kloklippning & Tassvård',
    category: 'care',
    date: '2026-08-30',
    time: '18:00',
    recurring: 'triweekly',
    notes: 'Kom ihåg blodstoppande pulver och rikligt med belöningsgodis.'
  },
  {
    id: 'evt-2',
    dogId: 'bella',
    title: 'Bravecto Fästingtablett',
    category: 'health',
    date: '2026-09-05',
    time: '08:30',
    recurring: 'monthly',
    notes: 'Ges tillsammans med morgonmaten.'
  },
  {
    id: 'evt-3',
    dogId: 'bella',
    title: 'Årlig Hälsokoll & DHPPI-vaccin',
    category: 'vet',
    date: '2026-09-18',
    time: '14:00',
    recurring: 'yearly',
    notes: 'Bokat hos Evidensia Djursjukhus.'
  },
  {
    id: 'evt-4',
    dogId: 'bella',
    title: 'Nosework Träningsgrupp',
    category: 'activity',
    date: '2026-09-02',
    time: '17:30',
    recurring: 'weekly',
    notes: 'Ta med favoritleksaken och eukalyptusdoft.'
  }
];

function getCalendarEvents() {
  const events = safeStorage.get(STORAGE_KEYS.CALENDAR_EVENTS);
  if (!events || !Array.isArray(events) || events.length === 0) {
    safeStorage.set(STORAGE_KEYS.CALENDAR_EVENTS, DEFAULT_CALENDAR_EVENTS);
    return DEFAULT_CALENDAR_EVENTS;
  }
  return events;
}

function saveCalendarEvents(events) {
  safeStorage.set(STORAGE_KEYS.CALENDAR_EVENTS, events);
}

function initCalendarPage() {
  const calGrid = document.getElementById('calendarMonthGrid');
  if (!calGrid) return;

  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayJumpBtn');
  const monthViewBtn = document.getElementById('monthViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');
  const newReminderBtn = document.getElementById('new-reminder-button') || document.getElementById('quickAddReminderBtn');
  const reminderModal = document.getElementById('reminder-modal');
  const reminderForm = document.getElementById('reminder-form');
  const filterBtns = document.querySelectorAll('.cal-filter-btn, [data-filter]');

  // Prev / Next / Today
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

  // View switchers
  if (monthViewBtn && listViewBtn) {
    monthViewBtn.addEventListener('click', () => {
      currentCalendarView = 'month';
      monthViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      renderCalendar();
    });

    listViewBtn.addEventListener('click', () => {
      currentCalendarView = 'agenda';
      listViewBtn.classList.add('active');
      monthViewBtn.classList.remove('active');
      renderCalendar();
    });
  }

  // Category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCalendarFilter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b === btn));
      renderCalendar();
    });
  });

  // Modal open
  if (newReminderBtn && reminderModal) {
    newReminderBtn.addEventListener('click', () => {
      if (reminderForm) reminderForm.reset();
      const dateInput = document.getElementById('reminder-date-input');
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      openModal(reminderModal);
    });
  }

  // Modal form submit
  if (reminderForm && reminderModal) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('reminder-title-input')?.value.trim();
      const category = document.getElementById('reminder-category-select')?.value || 'care';
      const date = document.getElementById('reminder-date-input')?.value;
      const time = document.getElementById('reminder-time-input')?.value || '09:00';
      const repeat = document.getElementById('reminder-repeat-select')?.value || 'none';
      const notes = document.getElementById('reminder-notes-input')?.value.trim() || '';

      if (!title || !date) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      const activeDog = getActiveDog();
      const newEvt = {
        id: 'evt-' + Date.now(),
        dogId: activeDog.id,
        title,
        category,
        date,
        time,
        recurring: repeat,
        notes
      };

      const events = getCalendarEvents();
      events.push(newEvt);
      saveCalendarEvents(events);

      closeModal(reminderModal);
      showToast('Aktivitet schemalagd! 📅', '🎉');
      renderCalendar();
    });
  }

  window.renderCalendar = renderCalendar;
  renderCalendar();
}

function renderCalendar() {
  const calGrid = document.getElementById('calendarMonthGrid');
  const agendaList = document.getElementById('calendarAgendaList');
  const heading = document.getElementById('currentMonthYearHeading');
  const weekdaysHeader = document.getElementById('weekdaysHeader');

  if (!calGrid) return;

  const year = currentCalDate.getFullYear();
  const month = currentCalDate.getMonth();

  const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  if (heading) {
    heading.textContent = `${monthNames[month]} ${year}`;
  }

  const activeDog = getActiveDog();
  const allEvents = [...getCalendarEvents()];

  // Dynamic recurring dog birthday
  if (activeDog && activeDog.birthday) {
    const bdayDate = new Date(activeDog.birthday);
    if (!isNaN(bdayDate.getTime())) {
      const bdayMonth = bdayDate.getMonth();
      const bdayDay = bdayDate.getDate();
      const thisYearBday = `${year}-${String(bdayMonth + 1).padStart(2, '0')}-${String(bdayDay).padStart(2, '0')}`;
      const turningAge = year - bdayDate.getFullYear();

      allEvents.push({
        id: 'bday-' + activeDog.id + '-' + year,
        dogId: activeDog.id,
        title: `🎂 ${activeDog.name} fyller ${turningAge} år!`,
        category: 'birthday',
        date: thisYearBday,
        time: '00:00',
        recurring: 'yearly',
        notes: `Födelsedagskalas och extra gott tuggben!`
      });
    }
  }

  // Filter events
  const filteredEvents = allEvents.filter(evt => {
    if (activeCalendarFilter === 'all') return true;
    return evt.category === activeCalendarFilter;
  });

  // Render Agenda View
  if (currentCalendarView === 'agenda') {
    calGrid.style.display = 'none';
    if (weekdaysHeader) weekdaysHeader.style.display = 'none';
    if (agendaList) {
      agendaList.style.display = 'block';
      const sorted = [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
      if (sorted.length === 0) {
        agendaList.innerHTML = '<div class="empty-agenda-msg"><p>Inga schemalagda aktiviteter för detta filter.</p></div>';
      } else {
        agendaList.innerHTML = sorted.map(evt => `
          <div class="agenda-row-item evt-${evt.category}">
            <div class="agenda-date-box">
              <span class="agenda-day">${new Date(evt.date).getDate()}</span>
              <span class="agenda-mth">${formatHumanDate(evt.date, currentLang).split(' ')[1]}</span>
            </div>
            <div class="agenda-details">
              <div class="agenda-title-row">
                <h4>${escapeHtml(evt.title)}</h4>
                <span class="badge badge-${evt.category}">${t('filter_' + evt.category)}</span>
              </div>
              <p class="agenda-meta">⏰ ${evt.time || '09:00'} ${evt.recurring && evt.recurring !== 'none' ? `· 🔄 Återkommande (${evt.recurring})` : ''}</p>
              ${evt.notes ? `<p class="agenda-notes">📝 ${escapeHtml(evt.notes)}</p>` : ''}
            </div>
            <div class="agenda-action">
              ${evt.category !== 'birthday' ? `<button type="button" class="btn btn-outline btn-xs" onclick="window.deleteCalEvent('${evt.id}')">Ta bort</button>` : ''}
            </div>
          </div>
        `).join('');
      }
    }
    return;
  }

  // Render Month Grid View
  calGrid.style.display = 'grid';
  if (weekdaysHeader) weekdaysHeader.style.display = 'grid';
  if (agendaList) agendaList.style.display = 'none';

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  let gridHtml = '';

  // Trailing previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    gridHtml += `<div class="cal-day-cell cal-other-month"><span class="cal-day-number">${d}</span></div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && today.getDate() === d;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = filteredEvents.filter(e => e.date === dateStr);

    gridHtml += `
      <div class="cal-day-cell ${isToday ? 'cal-today' : ''}" data-date="${dateStr}">
        <div class="cal-cell-header">
          <span class="cal-day-number">${d}</span>
          ${isToday ? '<span class="today-indicator" title="Idag"></span>' : ''}
        </div>
        <div class="cal-cell-events">
          ${dayEvents.map(evt => `
            <div class="cal-event-pill evt-${evt.category}" onclick="window.showCalEventInfo('${evt.id}')" title="${escapeHtml(evt.title)}">
              <span class="pill-text">${escapeHtml(evt.title)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Leading next month days
  const totalCells = startOffset + daysInMonth;
  const nextMonthCells = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= nextMonthCells; d++) {
    gridHtml += `<div class="cal-day-cell cal-other-month"><span class="cal-day-number">${d}</span></div>`;
  }

  calGrid.innerHTML = gridHtml;
}

window.showCalEventInfo = function(id) {
  const allEvents = [...getCalendarEvents()];
  const evt = allEvents.find(e => e.id === id);
  if (evt) {
    alert(`📅 ${evt.title}\n\nDatum: ${evt.date} (${evt.time || '09:00'})\nKategori: ${evt.category}\nAnteckningar: ${evt.notes || 'Inga anteckningar.'}`);
  }
};

window.deleteCalEvent = function(id) {
  let events = getCalendarEvents();
  events = events.filter(e => e.id !== id);
  saveCalendarEvents(events);
  showToast(t('toast_deleted'));
  renderCalendar();
};

/* ============================================================================
   SECTION 12: COMMUNITY SUGGESTIONS & VOTING ENGINE (suggestions.html)
   ============================================================================ */
const DEFAULT_SUGGESTIONS = [
  // 25b Nya förslag och community-önskemål
  {
    id: 'sugg-1',
    title: 'Fästingkarta i realtid (Tick Heatmap)',
    category: 'health',
    status: 'planned',
    votes: 142,
    author: 'Elin & Sigge',
    date: '2026-08-25',
    description: 'En interaktiv karta där vi hundägare kan markera skogsområden med mycket fästingar. Gör det enklare att välja säkrare promenadvägar under vår och sommar.',
    benefit: 'Minskar risken för fästingburna sjukdomar som Borrelia och TBE.'
  },
  {
    id: 'sugg-2',
    title: 'GPS Live Tracker & Ruttspårning',
    category: 'features',
    status: 'in_progress',
    votes: 215,
    author: 'Marcus & Atlas',
    date: '2026-08-28',
    description: 'Spåra promenaden direkt med telefonens GPS eller koppla ihop med smarta hundhalsband. Se tempo, höjdskillnad och exakt rutt på kartan.',
    benefit: 'Ger full överblick och extra trygghet om hunden skulle springa bort.'
  },
  {
    id: 'sugg-3',
    title: 'Veterinärchatt i fickan (Videorådgivning)',
    category: 'health',
    status: 'planned',
    votes: 189,
    author: 'Sofia med Molly',
    date: '2026-08-26',
    description: 'Möjlighet att snabbt starta en videorådgivning eller textchatt med en legitimerad veterinär vid akut oro, sårskador eller foderfrågor.',
    benefit: 'Snabb trygghet och slipper onödiga nattliga akutresor till djursjukhus.'
  },
  {
    id: 'sugg-4',
    title: 'Hundvänliga ställen & Caféguide',
    category: 'daily',
    status: 'new',
    votes: 98,
    author: 'Johan & Buster',
    date: '2026-08-27',
    description: 'En svensk rikstäckande guide över caféer, uteserveringar, hotell och badplatser där hundar är varmt välkomna, med omdömen från andra ägare.',
    benefit: 'Gör det superenkelt att ta med hunden på helgutflykter och fika.'
  },
  {
    id: 'sugg-5',
    title: 'Barkodsskanner för Foderinnehåll',
    category: 'food',
    status: 'in_progress',
    votes: 176,
    author: 'Karin & Rocky',
    date: '2026-08-24',
    description: 'Skanna streckkoden på foder- eller godispåsen med mobilkameran för att direkt se om produkten innehåller allergener som din hund är känslig mot.',
    benefit: 'Förhindrar allergichocker och magproblem vid inköp av nytt foder.'
  },
  {
    id: 'sugg-6',
    title: 'Löpcykel- & Brunstspårare för Tikar',
    category: 'health',
    status: 'planned',
    votes: 134,
    author: 'Hanna & Daisy',
    date: '2026-08-22',
    description: 'Kalenderfunktion för att logga tikens löpperioder, beräkna nästa löp och notera humörsvängningar, skendräktighet och pälskvalitet.',
    benefit: 'Hjälper tikägare att planera träningar, tävlingar och vila i god tid.'
  },
  {
    id: 'sugg-7',
    title: 'Delat Familjekonto & Hundvaktsläge',
    category: 'features',
    status: 'planned',
    votes: 162,
    author: 'Familjen Lindqvist',
    date: '2026-08-23',
    description: 'Låt flera familjemedlemmar och hundvakter dela samma hundprofil. Alla ser vem som har gett mat, promenerat eller gett medicin idag.',
    benefit: 'Slut på dubbla fodergivor och missade promenader i familjen.'
  },
  {
    id: 'sugg-8',
    title: 'Asfalttemperatur & Sommarvarning',
    category: 'daily',
    status: 'completed',
    votes: 120,
    author: 'Viktor & Boss',
    date: '2026-08-15',
    description: 'Inbyggd temperaturmätare som varnar när solen gör asfalten brännhet (över 50°C) och tipsar om skuggiga skogspromenader istället.',
    benefit: 'Skyddar känsliga trampdynor mot svåra brännskador på sommaren.'
  },
  {
    id: 'sugg-9',
    title: 'Kloklippningstimer & Träningsdagbok',
    category: 'training',
    status: 'planned',
    votes: 87,
    author: 'Camilla & Enzo',
    date: '2026-08-26',
    description: 'Steg-för-steg-program med Cooperative Care där man kan logga en klo i taget med belöningsstreak för att avdramatisera klotången.',
    benefit: 'Gör kloklippningen helt stressfri för både hund och ägare.'
  },
  {
    id: 'sugg-10',
    title: 'Ljudträning mot Nyårsraketer & Åska',
    category: 'training',
    status: 'under_review',
    votes: 145,
    author: 'Peter & Nova',
    date: '2026-08-21',
    description: 'Ljudspår med kontrollerat tilltagande volym av fyrverkerier och åskmuller för att desensibilisera rädda hundar i god tid före nyår.',
    benefit: 'Minskar nyårsångest och panik hos ljudkänsliga hundar.'
  },
  {
    id: 'sugg-11',
    title: 'Receptsamling för Hemlagat Hundgodis',
    category: 'food',
    status: 'new',
    votes: 74,
    author: 'Linnea & Ozzy',
    date: '2026-08-28',
    description: 'Enkel receptbank med nyttiga hundkex, torkad lever, kycklingchips och allergivänliga godbitar man enkelt bakar själv i ugnen.',
    benefit: '100% koll på råvarorna, billigare och utan onödiga tillsatser.'
  },
  {
    id: 'sugg-12',
    title: 'SOS Hundpassning & Promenadkompisar',
    category: 'daily',
    status: 'under_review',
    votes: 112,
    author: 'Fredrik & Zorro',
    date: '2026-08-25',
    description: 'Möjlighet att hitta och matcha med verifierade hundägare i samma kvarter för gemensamma promenader eller hjälp vid akut sjukdom.',
    benefit: 'Skapar lokal gemenskap och trygg avlastning i närområdet.'
  },
  {
    id: 'sugg-13',
    title: 'Digital Vaccinationsbok & PDF-export',
    category: 'health',
    status: 'in_progress',
    votes: 158,
    author: 'Sara & Wilma',
    date: '2026-08-27',
    description: 'Spara vaccinationsintyg och chipnummer med ett klick och exportera ett snyggt PDF-pass redo att visas upp på utställning eller pensionat.',
    benefit: 'Slipper borttappade vaccinationspapper och stress vid incheckning.'
  },
  {
    id: 'sugg-14',
    title: 'Hundmötesträning & "Gul Hund"-funktion',
    category: 'training',
    status: 'new',
    votes: 93,
    author: 'Malin & Bruno',
    date: '2026-08-24',
    description: 'Träningslogg för reaktiva hundar med verktyg för att hitta träningspartners för parallellpromenader på säkert avstånd (Yellow Dog Project).',
    benefit: 'Hjälper osäkra och reaktiva hundar att göra trygga framsteg.'
  },
  {
    id: 'sugg-15',
    title: 'Veterinärkostnads- & Kvittobokföring',
    category: 'features',
    status: 'planned',
    votes: 82,
    author: 'Andreas & Ronja',
    date: '2026-08-19',
    description: 'Fota och spara veterinärkvitton, håll reda på självrisken och se årets totalkostnader för foder, vård och försäkring per hund.',
    benefit: 'Perfekt ekonomisk överblick och lättare kontakt med försäkringsbolaget.'
  },
  {
    id: 'sugg-16',
    title: 'Seniorhundsprogram (Artros & Ledhälsa)',
    category: 'health',
    status: 'planned',
    votes: 105,
    author: 'Eva med Bamse (11 år)',
    date: '2026-08-26',
    description: 'Anpassade träningsprogram, uppvärmningsövningar och tips om kosttillskott för äldre hundar med stela leder och artros.',
    benefit: 'Ger seniorhunden ett smärtfritt och rörligt åldrande med hög livskvalitet.'
  },
  {
    id: 'sugg-17',
    title: 'Tandborstningsutmaning med Streaks',
    category: 'health',
    status: 'new',
    votes: 68,
    author: 'Jesper & Doris',
    date: '2026-08-27',
    description: 'Daglig påminnelse och rolig streak-räknare med belöningsmedaljer när man borstar tänderna varje kväll.',
    benefit: 'Bygger en stark rutin som förhindrar dyrbar tandsten och inflammation.'
  },
  {
    id: 'sugg-18',
    title: 'Mental Aktiveringstimer (Sniffari)',
    category: 'training',
    status: 'completed',
    votes: 131,
    author: 'Therese & Mille',
    date: '2026-08-10',
    description: 'Timer för mentala nosövningar och godissök med dagliga idéer på nya berikningslekar i hemmet och trädgården.',
    benefit: 'Aktiverar hundens hjärna och ger en harmonisk och nöjd hund.'
  },
  {
    id: 'sugg-19',
    title: 'Smart Dynamisk QR-ID-bricka',
    category: 'features',
    status: 'under_review',
    votes: 119,
    author: 'Daniel & Simba',
    date: '2026-08-23',
    description: 'Generera en personlig QR-kod att trycka på hundbrickan. Vid skanning visas dina kontaktuppgifter, hundens namn och akuta allergier direkt.',
    benefit: 'Snabbare återförening om hunden rymmer utan att behöva chipavläsare.'
  },
  {
    id: 'sugg-20',
    title: 'Valpvecka-för-vecka Guide',
    category: 'training',
    status: 'planned',
    votes: 153,
    author: 'Emelie & valpen Alfons',
    date: '2026-08-25',
    description: 'En interaktiv veckoöversikt från 8 veckor till 1 år med milstolpar, tandömsningsschema, socialiseringschecklista och sömnbehov.',
    benefit: 'Guld värd för förstagångs-valpköpare under det intensiva första året.'
  },
  {
    id: 'sugg-21',
    title: 'Viktminskningskurva & Kaloriberäknare',
    category: 'health',
    status: 'in_progress',
    votes: 126,
    author: 'Kristina & Baloo',
    date: '2026-08-24',
    description: 'Räkna ut dagligt energibehov baserat på hundens idealvikt och följ viktnedgången med visuella grafer och milstolpar.',
    benefit: 'Hjälper överviktiga hundar att nå hälsosam målvikt utan svält.'
  },
  {
    id: 'sugg-22',
    title: 'Hundrastgårdsguide med Status & Belysning',
    category: 'daily',
    status: 'new',
    votes: 88,
    author: 'Mikael & Freja',
    date: '2026-08-27',
    description: 'Katalog över kommunala hundrastgårdar med betyg på stängselhöjd, belysning under vintern, dubbelgrindar och vattenposter.',
    benefit: 'Hjälper ägare att hitta säkra och välskötta rastgårdar för lös lek.'
  },
  {
    id: 'sugg-23',
    title: 'Eliminationsdieten – Steg för Steg',
    category: 'food',
    status: 'planned',
    votes: 95,
    author: 'Jenny & Charlie',
    date: '2026-08-22',
    description: 'Strukturerad matdagbok för att utreda foderallergier. Logga klåda, magstatus och provokationsfoder i 8–12 veckor.',
    benefit: 'Ger veterinären ett klockrent underlag för att spika rätt diagnos.'
  },
  {
    id: 'sugg-24',
    title: 'Smart Push-notis inför Fästingsäsongen',
    category: 'health',
    status: 'under_review',
    votes: 110,
    author: 'Oskar & Nala',
    date: '2026-08-20',
    description: 'Automatisk lokal vädervarning när marktemperaturen i din kommun passerar +5°C och fästingarna vaknar ur vinterdvalan.',
    benefit: 'Gör att man sätter in fästingskyddet i exakt rätt tid på våren.'
  },
  {
    id: 'sugg-25',
    title: 'Hundens Personliga Journalbok (Minnen & Foto)',
    category: 'daily',
    status: 'new',
    votes: 81,
    author: 'Beatrice & Luna',
    date: '2026-08-28',
    description: 'En digital minnesbok där man sparar foton på första snön, födelsedagar, kursexamen och speciella ögonblick genom hundens liv.',
    benefit: 'Skapar ett fantastiskt minnesarkiv som man kan spara för alltid.'
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

function saveCommunitySuggestions(suggestions) {
  safeStorage.set(STORAGE_KEYS.COMMUNITY_SUGGESTIONS, suggestions);
}

function initSuggestionsPage() {
  const suggestionsGrid = document.getElementById('suggestions-grid');
  if (!suggestionsGrid) return;

  const searchInput = document.getElementById('suggestion-search');
  const categoryPills = document.querySelectorAll('.cat-pill, [data-category]');
  const sortSelect = document.getElementById('suggestion-sort-select');
  const statusSelect = document.getElementById('suggestion-status-select');
  const resultsCountEl = document.getElementById('board-results-count');
  const emptyStateEl = document.getElementById('suggestions-empty');
  const openModalBtn = document.getElementById('open-suggestion-modal-btn');
  const suggestionModal = document.getElementById('suggestion-modal');
  const suggestionForm = document.getElementById('new-suggestion-form');

  let activeCategory = 'all';

  function updateSuggestionsStats() {
    const suggestions = getCommunitySuggestions();
    const totalVotes = suggestions.reduce((sum, s) => sum + (s.votes || 0), 0);
    const plannedCount = suggestions.filter(s => s.status === 'planned' || s.status === 'in_progress').length;
    const completedCount = suggestions.filter(s => s.status === 'completed').length;

    const totalEl = document.getElementById('s-stat-total');
    const votesEl = document.getElementById('s-stat-votes');
    const plannedEl = document.getElementById('s-stat-planned');
    const doneEl = document.getElementById('s-stat-done');
    const catAllEl = document.getElementById('cat-count-all');

    if (totalEl) totalEl.textContent = suggestions.length;
    if (votesEl) votesEl.textContent = totalVotes.toLocaleString('sv-SE');
    if (plannedEl) plannedEl.textContent = plannedCount;
    if (doneEl) doneEl.textContent = completedCount;
    if (catAllEl) catAllEl.textContent = suggestions.length;
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'in_progress':
        return '<span class="status-badge status-in_progress">⚙️ I utveckling</span>';
      case 'planned':
        return '<span class="status-badge status-planned">📅 Planerat</span>';
      case 'under_review':
        return '<span class="status-badge status-under_review">🧐 Under granskning</span>';
      case 'completed':
        return '<span class="status-badge status-completed">✅ Genomfört</span>';
      default:
        return '<span class="status-badge status-new">💡 Nytt förslag</span>';
    }
  }

  function getCategoryName(cat) {
    switch (cat) {
      case 'features': return 'Appfunktioner';
      case 'health': return 'Hundhälsa';
      case 'training': return 'Träning';
      case 'daily': return 'Vardag';
      case 'food': return 'Foder';
      default: return 'Allmänt';
    }
  }

  function renderSuggestions() {
    const suggestions = getCommunitySuggestions();
    const userVotes = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);
    const query = (searchInput?.value || '').toLowerCase().trim();
    const sortBy = sortSelect?.value || 'votes';
    const statusFilter = statusSelect?.value || 'all';

    // Filter
    let filtered = suggestions.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchQuery = !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.benefit && item.benefit.toLowerCase().includes(query)) ||
        (item.author && item.author.toLowerCase().includes(query));

      return matchCat && matchStatus && matchQuery;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
      if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'sv');
      return 0;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} förslag`;
    }

    if (filtered.length === 0) {
      suggestionsGrid.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    suggestionsGrid.innerHTML = filtered.map(item => {
      const hasVoted = userVotes.includes(item.id);
      return `
        <article class="suggestion-card" data-id="${item.id}">
          <div class="sugg-vote-col">
            <button type="button" class="sugg-vote-btn ${hasVoted ? 'has-voted' : ''}" onclick="window.toggleSuggestionVote('${item.id}')" aria-label="${hasVoted ? 'Ta bort röst' : 'Rösta på förslag'}">
              <span class="vote-arrow">▲</span>
              <span class="sugg-vote-count">${item.votes || 0}</span>
              <span class="vote-text-label">${hasVoted ? 'Röstat' : 'Rösta'}</span>
            </button>
          </div>

          <div class="sugg-content-col">
            <div class="sugg-header-row">
              <div class="sugg-title-group">
                <h3 class="sugg-title">${escapeHtml(item.title)}</h3>
                <span class="sugg-category-badge">${getCategoryName(item.category)}</span>
              </div>
              <div class="sugg-status-wrap">
                ${getStatusBadge(item.status)}
              </div>
            </div>

            <p class="sugg-desc">${escapeHtml(item.description)}</p>

            ${item.benefit ? `
              <div class="sugg-benefit-box">
                <strong>💡 Nytta:</strong> ${escapeHtml(item.benefit)}
              </div>
            ` : ''}

            <div class="sugg-meta-row">
              <div class="sugg-author-date">
                <span>Inskickat av <strong>${escapeHtml(item.author || 'Anonym')}</strong></span>
                <span>·</span>
                <span>${formatHumanDate(item.date, currentLang)}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    updateSuggestionsStats();
  }

  // Voting toggle handler
  window.toggleSuggestionVote = function(id) {
    let suggestions = getCommunitySuggestions();
    let userVotes = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);
    const item = suggestions.find(s => s.id === id);

    if (!item) return;

    if (userVotes.includes(id)) {
      userVotes = userVotes.filter(x => x !== id);
      item.votes = Math.max(0, (item.votes || 1) - 1);
      showToast('Röst borttagen.');
    } else {
      userVotes.push(id);
      item.votes = (item.votes || 0) + 1;
      showToast(`Tack för din röst på "${item.title}"! 👍`, '🎉');
    }

    safeStorage.set(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, userVotes);
    saveCommunitySuggestions(suggestions);
    renderSuggestions();
  };

  // Filter pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.getAttribute('data-category') || 'all';
      categoryPills.forEach(p => p.classList.toggle('active', p === pill));
      renderSuggestions();
    });
  });

  // Sort & Status dropdowns
  if (sortSelect) sortSelect.addEventListener('change', renderSuggestions);
  if (statusSelect) statusSelect.addEventListener('change', renderSuggestions);

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', debounce(renderSuggestions, 150));
  }

  // Open modal
  if (openModalBtn && suggestionModal) {
    openModalBtn.addEventListener('click', () => {
      if (suggestionForm) suggestionForm.reset();
      const authorInput = document.getElementById('sugg-author');
      const emailInput = document.getElementById('sugg-email');
      const authUser = safeStorage.get(STORAGE_KEYS.AUTH_USER);

      if (authUser && authorInput) authorInput.value = authUser.name || '';
      if (authUser && emailInput) emailInput.value = authUser.email || '';

      openModal(suggestionModal);
    });
  }

  // Form submit
  if (suggestionForm && suggestionModal) {
    suggestionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('sugg-title')?.value.trim();
      const category = document.getElementById('sugg-category')?.value || 'features';
      const author = document.getElementById('sugg-author')?.value.trim();
      const email = document.getElementById('sugg-email')?.value.trim();
      const description = document.getElementById('sugg-description')?.value.trim();
      const benefit = document.getElementById('sugg-benefit')?.value.trim() || '';
      const mailAdmin = document.getElementById('sugg-mail-admin-checkbox')?.checked;

      if (!title || !author || !email || !description) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      const newId = 'sugg-' + Date.now();
      const newSuggestion = {
        id: newId,
        title,
        category,
        status: 'new',
        votes: 1, // Submitter auto-upvotes
        author,
        email,
        date: new Date().toISOString().split('T')[0],
        description,
        benefit
      };

      const suggestions = getCommunitySuggestions();
      suggestions.unshift(newSuggestion);
      saveCommunitySuggestions(suggestions);

      // Auto-mark user vote
      let userVotes = safeStorage.get(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, []);
      if (!userVotes.includes(newId)) userVotes.push(newId);
      safeStorage.set(STORAGE_KEYS.USER_VOTED_SUGGESTIONS, userVotes);

      // Trigger mail to admin if checked
      if (mailAdmin) {
        const subject = encodeURIComponent(`Nytt HundApp-förslag: ${title}`);
        const body = encodeURIComponent(
          `Hej Admin!\n\nEtt nytt förslag har skickats in till HundApp:\n\n` +
          `Rubrik: ${title}\n` +
          `Kategori: ${getCategoryName(category)}\n` +
          `Inskickat av: ${author} (${email})\n\n` +
          `Beskrivning:\n${description}\n\n` +
          `Nytta:\n${benefit || 'Ej angivet'}\n\n` +
          `Datum: ${new Date().toLocaleString('sv-SE')}\n`
        );
        window.location.href = `mailto:admin@hundapp.se?subject=${subject}&body=${body}`;
      }

      closeModal(suggestionModal);
      showToast('Ditt förslag har publicerats och lagts upp för röstning! ✨', '🎉');
      renderSuggestions();
    });
  }

  window.renderSuggestions = renderSuggestions;
  renderSuggestions();
}

/* ============================================================================
   SECTION 13: AUTHENTICATION & SECURITY ENGINE (login.html & register.html)
   ============================================================================ */
function initAuthSystem() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const demoLoginBtn = document.getElementById('quick-demo-login-btn');
  const socialGoogleBtns = document.querySelectorAll('#social-google-btn, .btn-social-google');

  // Password toggle
  document.querySelectorAll('#toggle-password, #toggle-password-confirm, .toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && (input.type === 'password' || input.type === 'text')) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁️' : '🙈';
      }
    });
  });

  // Password strength meter
  const regPassInput = document.getElementById('password');
  const strengthBar = document.getElementById('strengthBarFill');
  const strengthLabel = document.getElementById('strengthTextLabel');

  if (regPassInput && strengthBar && strengthLabel) {
    regPassInput.addEventListener('input', () => {
      const val = regPassInput.value;
      let score = 0;
      if (val.length >= 8) score += 25;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
      if (/[0-9]/.test(val)) score += 25;
      if (/[^A-Za-z0-9]/.test(val)) score += 25;

      strengthBar.style.width = `${score}%`;
      if (score < 50) {
        strengthBar.style.backgroundColor = '#e63946';
        strengthLabel.textContent = 'Svagt lösenord';
      } else if (score < 100) {
        strengthBar.style.backgroundColor = '#e9c46a';
        strengthLabel.textContent = 'Bra lösenord';
      } else {
        strengthBar.style.backgroundColor = '#2a9d8f';
        strengthLabel.textContent = 'Mycket starkt lösenord!';
      }
    });
  }

  // Pre-fill remembered email
  const rememberedEmail = safeStorage.get(STORAGE_KEYS.REMEMBERED_EMAIL);
  const emailInput = document.getElementById('email');
  const rememberCheckbox = document.getElementById('remember-me');

  if (rememberedEmail && emailInput) {
    emailInput.value = rememberedEmail;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  // Login submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput?.value.trim();
      const password = document.getElementById('password')?.value;

      if (!email || !password) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      if (rememberCheckbox?.checked) {
        safeStorage.set(STORAGE_KEYS.REMEMBERED_EMAIL, email);
      } else {
        safeStorage.remove(STORAGE_KEYS.REMEMBERED_EMAIL);
      }

      const user = {
        name: email.split('@')[0],
        email,
        loggedInAt: new Date().toISOString()
      };
      safeStorage.set(STORAGE_KEYS.AUTH_USER, user);

      showToast('Inloggning lyckades! Välkommen tillbaka!', '🎉');
      setTimeout(() => {
        window.location.href = 'portal.html';
      }, 500);
    });
  }

  // Demo login button
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const user = {
        name: 'Demoanvändare',
        email: 'demo@hundapp.se',
        loggedInAt: new Date().toISOString()
      };
      safeStorage.set(STORAGE_KEYS.AUTH_USER, user);
      showToast('Inloggad i demoläge!', '🐾');
      setTimeout(() => {
        window.location.href = 'portal.html';
      }, 500);
    });
  }

  // Register submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const pass = document.getElementById('password')?.value;
      const passConfirm = document.getElementById('password-confirm')?.value;
      const termsConsent = document.getElementById('terms-consent');

      if (!name || !email || !pass) {
        showToast(t('toast_error_fields'), '⚠️');
        return;
      }

      if (pass !== passConfirm) {
        showToast('Lösenorden matchar inte varandra.', '⚠️');
        return;
      }

      if (termsConsent && !termsConsent.checked) {
        showToast('Du måste godkänna användarvillkoren.', '⚠️');
        return;
      }

      const user = {
        name,
        email,
        loggedInAt: new Date().toISOString()
      };
      safeStorage.set(STORAGE_KEYS.AUTH_USER, user);

      showToast('Konto skapat! Välkommen till HundApp!', '🎉');
      setTimeout(() => {
        window.location.href = 'portal.html';
      }, 500);
    });
  }

  // Social Google login buttons
  socialGoogleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Loggar in med Google...', '🐾');
      setTimeout(() => {
        const user = {
          name: 'Google-användare',
          email: 'hundagare@gmail.com',
          loggedInAt: new Date().toISOString()
        };
        safeStorage.set(STORAGE_KEYS.AUTH_USER, user);
        showToast('Inloggad med Google!', '🎉');
        window.location.href = 'portal.html';
      }, 600);
    });
  });

  // Forgot password modal
  const openForgotModalBtn = document.getElementById('open-forgot-modal-btn');
  const forgotModal = document.getElementById('forgot-password-modal');
  const forgotForm = document.getElementById('forgot-password-form');

  if (openForgotModalBtn && forgotModal) {
    openForgotModalBtn.addEventListener('click', () => {
      openModal(forgotModal);
    });
  }

  if (forgotForm && forgotModal) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email-input')?.value.trim();
      if (email) {
        showToast(`Återställningslänk skickad till ${email}`, '✉️');
        closeModal(forgotModal);
      }
    });
  }
}

/* ============================================================================
   SECTION 14: GLOBAL APPLICATION BOOTSTRAPPER
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Language & Storage initialization
  setLanguage(currentLang);

  // 2. Global Navigation & Modals
  initGlobalNavigation();

  // 3. Active Dog State Initialization
  updateActiveDogGlobalUI();

  // 4. Page Engine Initializers (Safe guards ensure only active page runs)
  initHomePage();
  initTipsPage();
  initWalksPage();
  initStatisticsPage();
  initPortalPage();
  initDogsPage();
  initCalendarPage();
  initSuggestionsPage();
  initAuthSystem();
});
