import postApi from './api/postApi';
import {
  truncateText,
  getPaginationElement,
  setElementTextContent,
  setElementSourceBySelector,
} from './utils/index';

// setup library
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

// global value
const paginationElement = getPaginationElement();

// asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    // set default for _limit and _page if does not exist
    initURL();

    // attach event prevLink and nextLink
    initPagination();

    // attach event 'input' search posts
    initSearch();

    // extract website URL get from `?_page=1&_limit=6`
    const queryParams = new URLSearchParams(window.location.search);

    // use `await` để chờ cho đến khi yêu cầu GET tới địa chỉ
    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();

function initURL() {
  const url = new URL(window.location);

  // update search params if need
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);

  history.pushState({}, '', url);
}

function initPagination() {
  // find and attach event prev link
  const prevLink = paginationElement.firstElementChild?.firstElementChild;
  if (prevLink) prevLink.addEventListener('click', handlePrevClink);

  // find and attach event prev link
  const nextLink = paginationElement.lastElementChild?.firstElementChild;
  if (nextLink) nextLink.addEventListener('click', handleNexClink);
}

function handlePrevClink(e) {
  e.preventDefault();

  const page = Number.parseInt(paginationElement.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNexClink(e) {
  e.preventDefault();

  const page = Number.parseInt(paginationElement.dataset.page) || 1;
  const totalPages = Number.parseInt(paginationElement.dataset.totalPages);

  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // set default value from query params
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  // use library `debounce`
  const debounceSearch = debounce((e) => {
    const valueText = e.target.value.replace(/\s+/g, ' ').trim();

    handleFilterChange('title_like', valueText);
  }, 500);

  searchInput.addEventListener('input', debounceSearch);
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update quey params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);

    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('Failed: ', error);
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  // clear ulElement
  ulElement.textContent = '';

  // add
  postList.forEach((post) => {
    let liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
}

function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  // clone item
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // updata title, desc, author, thumbnail
  setElementTextContent(liElement, '[data-id="title"]', post.title);
  setElementTextContent(liElement, '[data-id="description"]', post.description);
  setElementTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setElementTextContent(liElement, '[data-id="author"]', post.author);
  setElementSourceBySelector(liElement, '[data-id="thumbnail"]', post.imageUrl);

  // calculate timespan
  setElementTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

  return liElement;
}

function renderPagination(pagination) {
  if (!pagination) return;

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
