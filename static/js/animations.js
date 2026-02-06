/**
 * ANIMATIONS.JS
 * ============================================================================
 * Centralized animation and interaction utilities
 * Single source of truth for all smooth user interactions
 * ============================================================================
 */

class AnimationManager {
  /**
   * Initialize animation manager with configuration
   * @param {Object} config - Configuration options
   */
  constructor(config = {}) {
    this.config = {
      observerThreshold: config.observerThreshold || 0.1,
      observerRootMargin: config.observerRootMargin || '0px 0px -50px 0px',
      enableAutoAnimation: config.enableAutoAnimation !== false,
      ...config
    };
    
    this.observer = null;
    this.init();
  }

  /**
   * Initialize the animation manager
   */
  init() {
    this.setupIntersectionObserver();
    this.setupResizeObserver();
  }

  /**
   * Setup Intersection Observer for scroll-triggered animations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: this.config.observerThreshold,
      rootMargin: this.config.observerRootMargin
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerElementAnimation(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  /**
   * Setup Resize Observer for responsive animations
   */
  setupResizeObserver() {
    if (!window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.hasAttribute('data-animate-on-resize')) {
          this.triggerElementAnimation(entry.target);
        }
      });
    });

    // Observe responsive elements if needed
    document.querySelectorAll('[data-animate-on-resize]').forEach(el => {
      resizeObserver.observe(el);
    });
  }

  /**
   * Trigger animation on element
   * @param {HTMLElement} element - The element to animate
   */
  triggerElementAnimation(element) {
    // Add animation class if specified
    if (element.hasAttribute('data-animate')) {
      const animation = element.getAttribute('data-animate');
      element.classList.add(`animate-${animation}`);
    }

    // Handle fade-in-up for backward compatibility
    if (element.classList.contains('fade-in-up') || 
        element.classList.contains('card') ||
        element.classList.contains('insight-card')) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }

    // Trigger custom animation event
    element.dispatchEvent(new CustomEvent('animationStart', { bubbles: true }));
  }

  /**
   * Observe elements for animation
   * @param {string|HTMLElement|NodeList} selector - Elements to observe
   */
  observe(selector) {
    const elements = this.getElements(selector);
    elements.forEach(el => this.observer.observe(el));
  }

  /**
   * Stop observing elements
   * @param {string|HTMLElement|NodeList} selector - Elements to stop observing
   */
  unobserve(selector) {
    const elements = this.getElements(selector);
    elements.forEach(el => this.observer.unobserve(el));
  }

  /**
   * Animate element with specific animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} animation - Animation name
   * @param {number} duration - Duration in ms
   * @returns {Promise} - Resolves when animation completes
   */
  async animate(element, animation, duration = 600) {
    return new Promise((resolve) => {
      element.classList.add(`animate-${animation}`);
      
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd, { once: true });
      
      // Fallback timeout in case animationend doesn't fire
      setTimeout(() => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      }, duration + 50);
    });
  }

  /**
   * Add stagger delay to elements
   * @param {NodeList|HTMLElement[]} elements - Elements to stagger
   * @param {number} baseDelay - Base delay in ms
   * @param {number} increment - Delay increment between elements
   */
  staggerAnimations(elements, baseDelay = 0, increment = 100) {
    Array.from(elements).forEach((element, index) => {
      element.style.animationDelay = `${baseDelay + (index * increment)}ms`;
    });
  }

  /**
   * Get elements from selector
   * @private
   * @param {string|HTMLElement|NodeList} selector
   * @returns {HTMLElement[]}
   */
  getElements(selector) {
    if (selector instanceof HTMLElement) {
      return [selector];
    }
    if (selector instanceof NodeList) {
      return Array.from(selector);
    }
    return Array.from(document.querySelectorAll(selector));
  }
}

/**
 * INTERACTION UTILITIES
 * ============================================================================
 */

class InteractionManager {
  /**
   * Add hover lift effect to elements
   * @param {string} selector - Element selector
   * @param {number} distance - Lift distance in pixels
   */
  static addHoverLift(selector, distance = 8) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform = `translateY(-${distance}px)`;
        el.style.transition = 'transform var(--transition-slow) ease';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Add ripple effect to buttons
   * @param {string} selector - Element selector
   */
  static addRippleEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.transformOrigin = 'center';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /**
   * Add smooth scroll behavior
   * @param {string} selector - Element selector
   */
  static addSmoothScroll(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  /**
   * Add focus visible states
   * @param {string} selector - Element selector
   */
  static addFocusStates(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary)';
        this.style.outlineOffset = '2px';
      });
      el.addEventListener('blur', function() {
        this.style.outline = 'none';
      });
    });
  }

  /**
   * Add input focus animation
   * @param {string} selector - Element selector
   */
  static animateInputFocus(selector) {
    const inputs = document.querySelectorAll(selector);
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.style.transform = 'translateY(-1px)';
        this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      });
      input.addEventListener('blur', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
      });
    });
  }
}

/**
 * SCROLL ANIMATION UTILITIES
 * ============================================================================
 */

class ScrollAnimations {
  /**
   * Add parallax effect
   * @param {string} selector - Element selector
   * @param {number} speed - Parallax speed multiplier
   */
  static addParallax(selector, speed = 0.5) {
    const elements = document.querySelectorAll(selector);
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /**
   * Animate counter on scroll
   * @param {HTMLElement} element - Counter element
   * @param {number} target - Target number
   * @param {number} duration - Animation duration in ms
   */
  static animateCounter(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const animate = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    animate();
  }

  /**
   * Add scroll progress bar
   * @param {string} selector - Progress bar element selector
   */
  static addScrollProgress(selector) {
    const progressBar = document.querySelector(selector);
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const scrollPercent = (scrolled / windowHeight) * 100;
      
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  /**
   * Track scroll direction
   * @param {Function} callback - Callback with direction info
   */
  static trackScrollDirection(callback) {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const direction = scrollTop > lastScrollTop ? 'down' : 'up';
      
      callback({ direction, scrollTop });
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
}

/**
 * INITIALIZATION & EXPORT
 * ============================================================================
 */

// Initialize animation manager globally
const animationManager = new AnimationManager({
  observerThreshold: 0.1,
  observerRootMargin: '0px 0px -50px 0px',
  enableAutoAnimation: true
});

// Auto-observe elements on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Observe cards and special animation elements
  animationManager.observe('.card');
  animationManager.observe('.fade-in-up');
  animationManager.observe('[data-animate]');
  
  // Setup interaction managers
  InteractionManager.addHoverLift('.card, .category-card');
  InteractionManager.addRippleEffect('.btn');
  InteractionManager.addSmoothScroll('a[href^="#"]');
  InteractionManager.animateInputFocus('.form-control');
  
  // Track scroll direction for sticky header
  ScrollAnimations.trackScrollDirection(({ direction }) => {
    const header = document.getElementById('mainHeader');
    if (header) {
      header.style.transition = 'transform var(--transition-slow) ease';
      header.style.transform = direction === 'down' ? 'translateY(-100%)' : 'translateY(0)';
    }
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationManager, InteractionManager, ScrollAnimations };
}
