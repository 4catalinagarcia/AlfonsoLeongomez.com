/* ===== LANGUAGE SYSTEM ===== */
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;

  // Update all elements with data-en / data-es
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    // Use innerHTML for elements that may have HTML entities or tags
    if (text.includes('<') || text.includes('&')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Update select options
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Update lang toggle UI
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Persist
  localStorage.setItem('al-lang', lang);
}

// Init language toggle
const langToggle = document.getElementById('langToggle');
langToggle.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'es' : 'en');
});

// Restore saved language
const savedLang = localStorage.getItem('al-lang');
if (savedLang && savedLang !== 'en') setLanguage(savedLang);

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  lastScroll = y;
}, { passive: true });

/* ===== HAMBURGER / MOBILE MENU ===== */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

function toggleMenu(force) {
  menuOpen = force !== undefined ? force : !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  hamburger.classList.toggle('active', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';

  // Animate hamburger bars
  const bars = hamburger.querySelectorAll('span');
  if (menuOpen) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
}

hamburger.addEventListener('click', () => toggleMenu());

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

/* ===== SMOOTH NAV LINK ACTIVE STATE ===== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--light)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.card, .offering, .gallery-item, .about-grid, .stat, .contact-form, .contact-info'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Inject reveal CSS dynamically
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .gallery-item.reveal { transition-delay: calc(var(--i, 0) * 80ms); }
  .card.reveal          { transition-delay: calc(var(--i, 0) * 100ms); }
  .offering.reveal      { transition-delay: calc(var(--i, 0) * 80ms); }
  .stat.reveal          { transition-delay: calc(var(--i, 0) * 80ms); }
`;
document.head.appendChild(revealStyle);

// Stagger siblings
['card', 'offering', 'gallery-item', 'stat'].forEach(cls => {
  document.querySelectorAll(`.${cls}`).forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
const success = form.querySelector('.form-success');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.style.opacity = '0.6';

  // Simulate submission (replace with real endpoint)
  setTimeout(() => {
    form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
    success.classList.remove('hidden');
    btn.disabled = false;
    btn.style.opacity = '';
    setTimeout(() => success.classList.add('hidden'), 5000);
  }, 900);
});
