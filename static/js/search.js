// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  
  if (searchForm && searchInput) {
    let searchIndex = [];
    const locale = window.location.pathname.split('/')[1] || 'en_us';
    const validLocales = ['en_us', 'ru_ru', 'ar_iq'];
    const currentLocale = validLocales.includes(locale) ? locale : 'en_us';
    
    fetch('/' + currentLocale + '/index.json')
      .then(response => response.json())
      .then(data => {
        searchIndex = data;
      })
      .catch(error => console.log('Search index not loaded:', error));
    
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      
      if (query.length < 2) {
        return;
      }
      
      const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               (item.content && item.content.toLowerCase().includes(query)) ||
               (item.description && item.description.toLowerCase().includes(query));
      });
      
      sessionStorage.setItem('searchQuery', query);
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      window.location.href = '/' + currentLocale + '/search/?q=' + encodeURIComponent(query);
    });
  }
});
