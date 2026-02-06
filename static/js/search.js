// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  
  if (searchForm && searchInput) {
    // Load search index
    let searchIndex = [];
    
    fetch('/index.json')
      .then(response => response.json())
      .then(data => {
        searchIndex = data;
      })
      .catch(error => console.log('Search index not loaded:', error));
    
    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      
      if (query.length < 2) {
        return;
      }
      
      // Simple search implementation
      const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               (item.content && item.content.toLowerCase().includes(query)) ||
               (item.description && item.description.toLowerCase().includes(query));
      });
      
      // Store results and redirect to search page
      sessionStorage.setItem('searchQuery', query);
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      window.location.href = '/search/?q=' + encodeURIComponent(query);
    });
  }
});
