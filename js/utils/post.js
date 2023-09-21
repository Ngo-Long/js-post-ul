import { setElementTextContent, setElementSourceBySelector, truncateText } from './common';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

export function renderPostList(elementId, postList) {
  if (!elementId || !Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear ulElement
  ulElement.textContent = '';

  // add
  postList.forEach((post) => {
    let liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
}

export function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  // clone item
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // updata title, desc, author, thumbnail
  setElementTextContent(liElement, '[data-id="title"]', post.title);
  setElementTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setElementTextContent(liElement, '[data-id="author"]', post.author);
  setElementSourceBySelector(liElement, '[data-id="thumbnail"]', post.imageUrl);

  // attach event
  const postItem = liElement.firstElementChild;
  if (postItem) {
    postItem.addEventListener('click', () => {
      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  // calculate timespan
  setElementTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

  return liElement;
}
