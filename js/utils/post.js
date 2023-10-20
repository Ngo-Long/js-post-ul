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

  // attach link
  liElement.addEventListener('click', (e) => {
    // s2: if event is triggered form menu --> ignore
    const menuElement = liElement.querySelector('.post-item-menu');
    if (menuElement && menuElement.contains(e.target)) return;

    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      // s1: e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  const removeButton = liElement.querySelector('[data-id="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      });

      removeButton.dispatchEvent(customEvent);
    });
  }

  // updata title, desc, author, thumbnail
  setElementTextContent(liElement, '[data-id="title"]', post.title);
  setElementTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setElementTextContent(liElement, '[data-id="author"]', post.author);
  setElementSourceBySelector(liElement, '[data-id="thumbnail"]', post.imageUrl);

  // calculate timespan
  setElementTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

  return liElement;
}
