// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // ===========================================
  // Header Scroll Effect
  // ===========================================
  const mainHeader = document.getElementById('mainHeader');
  let lastScrollTop = 0;
  
  const handleHeaderScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  };
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  
  // ===========================================
  // Theme Management
  // ===========================================
  const themeBtns = document.querySelectorAll('.theme-btn');
  const storedTheme = localStorage.getItem('theme') || 'auto';
  
  const setTheme = (theme) => {
    if (theme === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Update active button state
    themeBtns.forEach(btn => {
      btn.classList.remove('active', 'text-white');
      btn.classList.add('text-white-50');
      if (btn.dataset.themeValue === theme) {
        btn.classList.add('active', 'text-white');
        btn.classList.remove('text-white-50');
      }
    });
    
    localStorage.setItem('theme', theme);
  };

  // Initial set
  setTheme(storedTheme);

  // Event Listeners
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.getAttribute('data-theme-value'));
    });
  });

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('theme') === 'auto') {
      setTheme('auto');
    }
  });

  // ===========================================
  // Intersection Observer for Animations
  // ===========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Apply observer to cards and feature lists
  document.querySelectorAll('.card, .feature-list .d-flex, .insight-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if(this.getAttribute('href') === '#') return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add fade-in animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .row > div').forEach(el => {
    observer.observe(el);
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('shadow');
      } else {
        navbar.classList.remove('shadow');
      }
    });
  }
});
