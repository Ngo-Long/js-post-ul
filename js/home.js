import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// to use fromNow function
dayjs.extend(relativeTime);

import postApi from './api/postApi';
import { setElementTextContent, setElementSourceBySelector, truncateText } from './utils/index';

// ----------------------------------------------------------
function initPagination() {
  const paginationElement = document.getElementById('pagination');
  if (!paginationElement) return;

  // find and attach event prev link
  const prevLink = paginationElement.firstElementChild?.firstElementChild;
  if (prevLink) prevLink.addEventListener('click', handlePrevClink);

  // find and attach event prev link
  const nextLink = paginationElement.lastElementChild?.firstElementChild;
  if (nextLink) nextLink.addEventListener('click', handleNexClink);
}

function handlePrevClink(e) {
  e.preventDefault();

  console.log('hi');
}

function handleNexClink(e) {
  e.preventDefault();
  console.log('ho');
}

function handleFilterChange(filterName, filterValue) {
  // update quey params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render post list
}

function initURL() {
  const url = new URL(window.location);

  // update search params if need
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);

  history.pushState({}, '', url);
}

function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

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

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    let liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  if (!pagination) return;

  const paginationElement = document.getElementById('pagination');
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
  if (_limit >= totalPages) paginationElement.lastElementChild?.classList.add('disabled');
  else paginationElement.lastElementChild?.classList.remove('disabled');
}

// asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    initPagination();
    initURL();

    const queryParams = new URLSearchParams(window.location.search);

    // use `await` để chờ cho đến khi yêu cầu GET tới địa chỉ
    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
