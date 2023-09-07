import debounce from 'lodash.debounce';

// Puge function - dump function
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set default value from query params
  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  }

  // use library `debounce`
  const debounceSearch = debounce((e) => {
    const valueText = e.target.value.replace(/\s+/g, ' ').trim();
    onChange?.(valueText);
  }, 500);

  // listen to events
  searchInput.addEventListener('input', debounceSearch);
}
