export function initPagination({ elementId, defaultParams, onChange }) {
  const paginationElement = document.getElementById(elementId);
  if (!paginationElement) return;

  // get current params
  // ...

  // find and attach event prev link
  const prevLink = paginationElement.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(paginationElement.dataset.page) || 1;
      if (page >= 2) onChange?.(page - 1);
    });
  }

  // find and attach event prev link
  const nextLink = paginationElement.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(paginationElement.dataset.page) || 1;
      const totalPages = Number.parseInt(paginationElement.dataset.totalPages);

      if (page < totalPages) onChange?.(page + 1);
    });
  }
}

export function renderPagination(elementId, pagination) {
  if (!pagination) return;

  const paginationElement = document.getElementById(elementId);
  if (!paginationElement) return;

  // calc total pages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to paginationElement
  paginationElement.dataset.page = _page;
  paginationElement.dataset.totalPages = totalPages;

  // check if enable/disable prev links
  if (_page <= 1) paginationElement.firstElementChild?.classList.add('disabled');
  else paginationElement.firstElementChild?.classList.remove('disabled');

  // check if enable/disable prev links
  if (_page >= totalPages) paginationElement.lastElementChild?.classList.add('disabled');
  else paginationElement.lastElementChild?.classList.remove('disabled');
}
