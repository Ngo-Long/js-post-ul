import postApi from './api/postApi';
import { setElementTextContent, setElementSourceBySelector } from './utils/index';

function createPostElement(post) {
  if (!post) return;

  try {
    // find and clone template
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    // updata title, desc, author, thumbnail
    setElementTextContent(liElement, '[data-id="title"]', post.title);
    setElementTextContent(liElement, '[data-id="description"]', post.description);
    setElementTextContent(liElement, '[data-id="author"]', post.author);
    setElementSourceBySelector(liElement, '[data-id="thumbnail"]', post.imageUrl);

    return liElement;
  } catch (error) {
    console.log('faild to create post item', error);
  }
}

function renderPostList(postList) {
  // console.log(postList);
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    let liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  });
}

// asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    const queryParams = {
      _pape: 1,
      _limit: 6,
    };

    // use `await` để chờ cho đến khi yêu cầu GET tới địa chỉ '/posts'
    const { data, pagination } = await postApi.getAll(queryParams);

    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
