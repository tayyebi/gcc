// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  // Theme Management
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
      setTheme(btn.dataset.themeValue);
    });
  });

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('theme') === 'auto') {
      setTheme('auto');
    }
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
