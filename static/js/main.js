/**
 * MAIN.JS - Core Application JavaScript
 * 
 * Integrates with animations.js for smooth interactions
 * Uses design tokens from design-tokens.css for timing values
 */

document.addEventListener('DOMContentLoaded', function() {
  // ===========================================
  // Header Scroll Effect with Animation
  // ===========================================
  const mainHeader = document.getElementById('mainHeader');
  let lastScrollTop = 0;
  let scrollTimer = null;
  
  const handleHeaderScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
    
    // Clear previous timer
    if (scrollTimer) clearTimeout(scrollTimer);
    
    // Add scrolling class for animation
    mainHeader.classList.add('scrolling');
    scrollTimer = setTimeout(() => {
      mainHeader.classList.remove('scrolling');
    }, 150);
    
    lastScrollTop = scrollTop;
  };
  
  // ===========================================
  // Theme Management
  // ===========================================
  const themeBtns = document.querySelectorAll('.theme-btn');
  const storedTheme = localStorage.getItem('theme');
  
  const setTheme = (theme) => {
    const htmlElement = document.documentElement;
    
    if (theme === 'auto' || !theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        htmlElement.setAttribute('data-bs-theme', 'dark');
      } else {
        htmlElement.removeAttribute('data-theme');
        htmlElement.removeAttribute('data-bs-theme');
      }
    } else {
      htmlElement.setAttribute('data-theme', theme);
      htmlElement.setAttribute('data-bs-theme', theme);
    }
    
    // Update active button state
    themeBtns.forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme-value');
      if (btnTheme === theme || (theme === 'auto' && !storedTheme && btnTheme === 'auto')) {
        btn.classList.add('active', 'text-white');
        btn.classList.remove('text-white-50');
      } else {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-white-50');
      }
    });
    
    // Store preference
    if (theme !== 'auto') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  };

  // Event Listeners for theme buttons (initial state already set by blocking <head> script)
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedTheme = btn.getAttribute('data-theme-value');
      setTheme(selectedTheme);
    });
  });

  // Listen for system theme changes
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', e => {
    const currentTheme = localStorage.getItem('theme');
    if (!currentTheme || currentTheme === 'auto') {
      setTheme('auto');
    }
  });

  // ===========================================
  // Animation Manager Integration
  // ===========================================
  
  // Use AnimationManager if available
  if (typeof AnimationManager !== 'undefined') {
    // Observer is already set up by AnimationManager
    // Just ensure it's initialized
    if (window.animationManager) {
      window.animationManager.observe('.card');
      window.animationManager.observe('.fade-in-up');
      window.animationManager.observe('[data-animate]');
    }
  } else {
    // Fallback intersection observer if animations.js is not loaded
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add fade-in-up animation
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Apply observer to cards and feature lists
    document.querySelectorAll('.card, .feature-list .d-flex, .insight-card, .fade-in-up').forEach(el => {
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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===========================================
  // Enhanced Navbar Scroll Shadow
  // ===========================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('shadow', 'scrolled');
      } else {
        navbar.classList.remove('shadow', 'scrolled');
      }
    }, { passive: true });
  }

  // ===========================================
  // Form Input Focus States
  // ===========================================
  const formInputs = document.querySelectorAll('.form-control, .form-select, input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.classList.remove('focused');
    });
  });

  // ===========================================
  // Contact Form — Async Submit
  // ===========================================
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var feedbackEl = document.getElementById('contactFeedback');
    var submitBtn = document.getElementById('contactSubmitBtn');

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Honeypot check
      if (contactForm.querySelector('[name="bot-field"]').value) return;

      // Validate (HTML5 checkValidity already shows browser hints)
      if (!contactForm.checkValidity()) return;

      // Loading state
      var origText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      feedbackEl.innerHTML = '';
      feedbackEl.className = 'mt-3';

      try {
        var resp = await fetch('/api/contact', {
          method: 'POST',
          body: new FormData(contactForm)
        });

        var data = await resp.json();

        if (resp.ok && data.success) {
          feedbackEl.className = 'mt-3 alert alert-success mb-0';
          feedbackEl.textContent = 'Thanks, ' + contactForm.name.value + '! Your message has been sent. We\'ll be in touch soon.';
          contactForm.reset();
        } else {
          throw new Error(data.error || 'Server error');
        }
      } catch (err) {
        feedbackEl.className = 'mt-3 alert alert-danger mb-0';
        feedbackEl.textContent = err.message || 'Something went wrong. Please email us directly at info@globalcommercecouncil.com.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    });
  }

  // ===========================================
  // Lazy Load Images with Fade Animation
  // ===========================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('animate-fade');
            delete img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===========================================
  // Accessibility Enhancements
  // ===========================================
  
  // Add keyboard navigation indicator
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // ===========================================
  // Performance: Debounce Scroll Events
  // ===========================================
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleHeaderScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
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
