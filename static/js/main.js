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
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  
  // ===========================================
  // Theme Management with Smooth Transition
  // ===========================================
  const themeBtns = document.querySelectorAll('.theme-btn');
  const storedTheme = localStorage.getItem('theme') || 'auto';
  
  const setTheme = (theme) => {
    // Add transition animation
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (theme === 'auto') {
      // Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else {
      // Force user-selected theme
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Update active button state with animation
    themeBtns.forEach(btn => {
      btn.classList.remove('active', 'text-white');
      btn.classList.add('text-white-50');
      btn.style.transform = 'scale(1)';
      
      if (btn.dataset.themeValue === theme) {
        btn.classList.add('active', 'text-white');
        btn.classList.remove('text-white-50');
        btn.style.animation = 'pulse-icon 0.5s ease-in-out';
      }
    });
    
    localStorage.setItem('theme', theme);
  };

  // Initial set based on localStorage or system preference
  setTheme(storedTheme);

  // Event Listeners for theme buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme-value'));
    });
  });

  // Listen for system theme changes only when auto mode is active
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', e => {
    const currentTheme = localStorage.getItem('theme') || 'auto';
    if (currentTheme === 'auto') {
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
