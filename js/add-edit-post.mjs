import postApi from './api/postApi';
import { initPostForm, toast } from './utils/index';

function removeUnusedFieds(formValues) {
  const payload = { ...formValues };

  // imageSource = 'upload' --> delete imageUrl
  // imageSource = 'picsum' --> delete image
  payload.imageSource === 'upload' ? delete payload.imageUrl : delete payload.image;

  // finally remove imageSource
  delete payload.imageSource;

  return payload;
}

async function handleOnSummit(formValues) {
  const payload = removeUnusedFieds(formValues);

  console.log('sumbit', { formValues, payload });
  return;
  try {
    // call api add / update
    // s1: based on search params (check id)
    // s2: check id in formValues
    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    // show success message
    toast.success('Save post successfuly!');

    // redirect to detail page
    setTimeout(() => window.location.assign(`/post-detail.html?id=${savePost.id}`), 2500);
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
}

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
      onSubmit: handleOnSummit,
    });
  } catch (error) {
    console.log('failed to add edit post', error);
  }
})();
