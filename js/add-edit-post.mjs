import postApi from './api/postApi';
import { initPostForm } from './utils/index';

// main
(async () => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log('submit', formValues),
    });
  } catch (error) {
    console.log('failed to add edit post', error);
  }
})();
