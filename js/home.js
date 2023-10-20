import postApi from './api/postApi';
import {
  initSearch,
  initPagination,
  renderPostList,
  renderPagination,
  registerDeleteModal,
  toast,
} from './utils/index';

// MAIN
// asynchronous function that make HTTP requests use axiosClient
(async () => {
  try {
    const url = new URL(window.location);

    // set default pagination (_limit, _page) on URL
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    // attach event prevLink and nextLink
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    // attach event 'input' search posts
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // fetch API
    handleFilterChange();
    registerPostDeleteEvent();
  } catch (error) {
    console.log('get all failed', error);
  }
})();

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    try {
      const post = e.detail;
      const message = `Are you sure to remove post "${post.title}" !!!`;

      // Tạo một promise để giải quyết khi người dùng xác nhận
      const isConfirmed = await new Promise((resolve) => {
        registerDeleteModal({
          modalId: 'modalDelete',
          message,
          onConfirm: () => resolve(true),
        });
      });

      if (isConfirmed) {
        await postApi.remove(post.id);
        await handleFilterChange();

        toast.success('Remove post successfully');
      }
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
  });
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update quey params
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('Failed: ', error);
  }
}
