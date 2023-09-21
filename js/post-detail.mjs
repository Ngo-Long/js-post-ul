import postApi from './api/postApi';
import { setElementTextContent } from './utils/common';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // to use fromNow function

// main
(async () => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }

    const data = await postApi.getById(postId);
    renderPostDetail(data);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();

function renderPostDetail(post) {
  if (!post) return;

  const postHeroImage = document.getElementById('postHeroImage');
  if (postHeroImage) {
    postHeroImage.style.backgroundImage = `url('${post.imageUrl}')`;

    postHeroImage.addEventListener('error', () => {
      console.log('Sự kiện lỗi đã được kích hoạt.');
      postHeroImage.src = 'https://placehold.co/1368x400?text=Thumbnail';
    });
  }

  const goToEditPageLink = document.getElementById('goToEditPageLink');
  if (goToEditPageLink) {
    goToEditPageLink.href = `/add-edit-post.html?${post.id}`;
    goToEditPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }

  setElementTextContent(document, '#postDetailTitle', post.title);
  setElementTextContent(document, '#postDetailAuthor', post.author);
  setElementTextContent(document, '#postDetailDescription', post.description);
  setElementTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm'),
  );
}
