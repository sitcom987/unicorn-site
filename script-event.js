/* Shared behaviour for the event pages: theme toggle, nav, mobile menu, fade-ins, sticky CTA.
   The per-page countdown stays inline in each page. */

// Theme toggle — syncs all .theme-toggle buttons (nav + mobile menu)
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ubc-theme', theme);
  const isDark = theme === 'dark';
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = isDark ? '☀' : '🌙';
  });
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

setTheme(localStorage.getItem('ubc-theme') || 'light');

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Fade in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

requestAnimationFrame(() => {
  document.querySelectorAll('.event-hero .fade-in').forEach(el => el.classList.add('visible'));
});

// Hide sticky CTA once ticket section is visible
const ticketSection = document.getElementById('tickets');
const stickyCTA     = document.getElementById('sticky-cta');

const ticketObserver = new IntersectionObserver((entries) => {
  stickyCTA.style.opacity = entries[0].isIntersecting ? '0' : '1';
  stickyCTA.style.pointerEvents = entries[0].isIntersecting ? 'none' : 'auto';
}, { threshold: 0.2 });

ticketObserver.observe(ticketSection);
stickyCTA.style.transition = 'opacity 0.3s';
