/**
 * MAIN.JS - Core Application JavaScript
 *
 * Integrates with animations.js for smooth interactions
 * Uses design tokens from design-tokens.css for timing values
 */

document.addEventListener('DOMContentLoaded', function() {

  // ===========================================
  // Header Scroll Effect
  // ===========================================
  const siteHeader = document.getElementById('siteHeader');

  const handleHeaderScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ===========================================
  // Mobile Overlay
  // ===========================================
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMobileMenu() {
    mobileOverlay.classList.add('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first focusable element
    const firstInput = mobileOverlay.querySelector('input, a, button');
    if (firstInput) firstInput.focus();
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMobileMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMobileMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (mobileOverlay && mobileOverlay.classList.contains('is-open')) {
        closeMobileMenu();
      }
      if (searchOverlay && searchOverlay.classList.contains('is-open')) {
        closeSearch();
      }
      if (langDropdown && langDropdown.classList.contains('is-open')) {
        langDropdown.classList.remove('is-open');
      }
    }
  });

  // Mobile accordion for Products
  document.querySelectorAll('.mobile-nav-item .mobile-nav-link').forEach(function(link) {
    const parent = link.closest('.mobile-nav-item');
    const subList = parent ? parent.querySelector('.mobile-sub-list') : null;
    if (!subList) return;

    link.addEventListener('click', function(e) {
      e.preventDefault();
      const isExpanded = parent.classList.contains('is-expanded');
      // Close all others
      document.querySelectorAll('.mobile-nav-item.is-expanded').forEach(function(item) {
        if (item !== parent) item.classList.remove('is-expanded');
      });
      parent.classList.toggle('is-expanded', !isExpanded);
    });
  });

  // ===========================================
  // Search Overlay
  // ===========================================
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const siteSearchInput = document.getElementById('siteSearchInput');
  const siteSearchForm = document.getElementById('siteSearchForm');

  function openSearch() {
    searchOverlay.classList.add('is-open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    if (siteSearchInput) siteSearchInput.focus();
  }

  function closeSearch() {
    searchOverlay.classList.remove('is-open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    if (searchToggle) searchToggle.focus();
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Mobile search form
  var mobileSearchForm = mobileOverlay ? mobileOverlay.querySelector('.mobile-search') : null;
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var q = mobileSearchForm.querySelector('input');
      if (q && q.value.trim()) {
        window.location.href = '/search/?q=' + encodeURIComponent(q.value.trim());
      }
    });
  }

  // Desktop search form
  if (siteSearchForm) {
    siteSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (siteSearchInput && siteSearchInput.value.trim()) {
        window.location.href = '/search/?q=' + encodeURIComponent(siteSearchInput.value.trim());
      }
    });
  }

  // ===========================================
  // Language Dropdown
  // ===========================================
  const langDropdown = document.getElementById('langDropdown');
  const langToggle = document.getElementById('langToggle');

  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = langDropdown.classList.contains('is-open');
      langDropdown.classList.toggle('is-open', !isOpen);
      langToggle.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', function(e) {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('is-open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===========================================
  // Theme Management
  // ===========================================
  const storedTheme = localStorage.getItem('theme');

  function setTheme(theme) {
    var htmlEl = document.documentElement;

    if (theme === 'auto' || !theme) {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        htmlEl.setAttribute('data-theme', 'dark');
        htmlEl.setAttribute('data-bs-theme', 'dark');
      } else {
        htmlEl.removeAttribute('data-theme');
        htmlEl.removeAttribute('data-bs-theme');
      }
    } else {
      htmlEl.setAttribute('data-theme', theme);
      htmlEl.setAttribute('data-bs-theme', theme);
    }

    // Update all theme buttons
    updateThemeButtons(theme);

    if (theme !== 'auto') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }

  function updateThemeButtons(activeTheme) {
    // Utility bar toggle
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      var isDark = activeTheme === 'dark' ||
        (!activeTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      themeToggle.innerHTML = isDark
        ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
        : '<i class="bi bi-moon-fill" aria-hidden="true"></i>';
      themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    // Mobile overlay theme buttons
    document.querySelectorAll('.mobile-theme-btn').forEach(function(btn) {
      var btnTheme = btn.getAttribute('data-theme-value');
      btn.classList.toggle('is-active', btnTheme === activeTheme);
    });
  }

  // Utility bar theme toggle
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var currentTheme = localStorage.getItem('theme') || 'auto';
      var isDark = currentTheme === 'dark' ||
        (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // Mobile overlay theme buttons
  document.querySelectorAll('.mobile-theme-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setTheme(btn.getAttribute('data-theme-value'));
    });
  });

  // Listen for system theme changes
  var darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', function() {
    var currentTheme = localStorage.getItem('theme');
    if (!currentTheme || currentTheme === 'auto') {
      setTheme('auto');
    }
  });

  // Initialize theme button state
  var initialTheme = storedTheme || 'auto';
  updateThemeButtons(initialTheme);

  // ===========================================
  // Mega Menu Keyboard Accessibility
  // ===========================================
  var megaItems = document.querySelectorAll('.has-mega');
  megaItems.forEach(function(item) {
    var trigger = item.querySelector('.nav-link');
    var mega = item.querySelector('.mega-menu');

    if (trigger && mega) {
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = item.classList.contains('is-open');
          item.classList.toggle('is-open', !isOpen);
          trigger.setAttribute('aria-expanded', !isOpen);
        }
        if (e.key === 'Escape') {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });

      item.addEventListener('mouseleave', function() {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ===========================================
  // Animation Manager Integration
  // ===========================================

  if (typeof AnimationManager !== 'undefined') {
    if (window.animationManager) {
      window.animationManager.observe('.card');
      window.animationManager.observe('.fade-in-up');
      window.animationManager.observe('[data-animate]');
    }
  } else {
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-list .d-flex, .insight-card, .fade-in-up').forEach(function(el) {
      if (!el.classList.contains('animate-fade-in-up')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
      observer.observe(el);
    });
  }

  // ===========================================
  // Smooth Scroll for Anchor Links
  // ===========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===========================================
  // Form Input Focus States
  // ===========================================
  document.querySelectorAll('.form-control, .form-select, input, textarea, select').forEach(function(input) {
    input.addEventListener('focus', function() {
      this.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.classList.remove('focused');
    });
  });

  // ===========================================
  // Contact Form — Mailto Submit
  // ===========================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) return;
      var fd = new FormData(contactForm);
      var subjectLabels = { general: 'General Inquiry', supplier: 'Supplier Application', buyer: 'Buyer Inquiry', partnership: 'Partnership Opportunity', support: 'Technical Support', other: 'Other' };
      var subject = subjectLabels[fd.get('subject')] || fd.get('subject');
      var body = 'Name: ' + fd.get('name') + '\nEmail: ' + fd.get('email') + '\nCompany: ' + (fd.get('company') || '—') + '\nSubject: ' + subject + '\n\n' + fd.get('message');
      window.location.href = 'mailto:info@globalcommercecouncil.com?subject=' + encodeURIComponent('[GCC Contact] ' + subject + ': ' + fd.get('name')) + '&body=' + encodeURIComponent(body);
      var fb = document.getElementById('contactFeedback');
      if (fb) { fb.className = 'mt-3 alert alert-success mb-0'; fb.textContent = 'Your email client should open shortly. If not, please email us directly at info@globalcommercecouncil.com.'; }
      contactForm.reset();
    });
  }

  // ===========================================
  // Lazy Load Images with Fade Animation
  // ===========================================
  if ('IntersectionObserver' in window) {
    var imageObserver = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('animate-fade');
            delete img.dataset.src;
          }
          obs.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ===========================================
  // Accessibility Enhancements
  // ===========================================
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });
});

// ===========================================
// Supply Chain Diagram Pan / Zoom
// ===========================================
var _panZoom = { scale: 1, x: 0, y: 0, svg: null, dragging: false, startX: 0, startY: 0 };

function initSupplyChainPanZoom(svg) {
  _panZoom.svg = svg;
  var container = svg.parentElement;

  svg.style.transformOrigin = '0 0';
  svg.style.cursor = 'grab';
  svg.style.transition = 'transform 0.1s ease';

  svg.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    _panZoom.dragging = true;
    _panZoom.startX = e.clientX - _panZoom.x;
    _panZoom.startY = e.clientY - _panZoom.y;
    svg.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!_panZoom.dragging) return;
    _panZoom.x = e.clientX - _panZoom.startX;
    _panZoom.y = e.clientY - _panZoom.startY;
    applyTransform();
  });

  document.addEventListener('mouseup', function() {
    _panZoom.dragging = false;
    if (_panZoom.svg) _panZoom.svg.style.cursor = 'grab';
  });

  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    var rect = container.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;

    var delta = e.deltaY > 0 ? 0.9 : 1.1;
    var newScale = Math.max(0.2, Math.min(5, _panZoom.scale * delta));

    _panZoom.x = mx - (mx - _panZoom.x) * (newScale / _panZoom.scale);
    _panZoom.y = my - (my - _panZoom.y) * (newScale / _panZoom.scale);
    _panZoom.scale = newScale;
    applyTransform();
  }, { passive: false });
}

function applyTransform() {
  if (!_panZoom.svg) return;
  _panZoom.svg.style.transform = 'translate(' + _panZoom.x + 'px, ' + _panZoom.y + 'px) scale(' + _panZoom.scale + ')';
}

function zoomIn() {
  if (!_panZoom.svg) return;
  _panZoom.scale = Math.min(5, _panZoom.scale * 1.3);
  applyTransform();
}

function zoomOut() {
  if (!_panZoom.svg) return;
  _panZoom.scale = Math.max(0.2, _panZoom.scale / 1.3);
  applyTransform();
}

function resetZoom() {
  if (!_panZoom.svg) return;
  _panZoom.scale = 1;
  _panZoom.x = 0;
  _panZoom.y = 0;
  applyTransform();
}
