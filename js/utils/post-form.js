import { setFieldValue, setBackgroundImage } from './common';

export function initPostForm({ formId, defaultValues, onSubmit }) {
  if (!formId || !defaultValues) return;

  const postForm = document.getElementById(formId);
  if (!postForm) return;

  // set value
  setFormValues(postForm, defaultValues);

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formValues = getFormValue(postForm);
  });
}

function setFormValues(postForm, defaultValues) {
  if (!postForm || !defaultValues) return;

  // set form
  setFieldValue(postForm, 'input[name="title"]', defaultValues?.title);
  setFieldValue(postForm, 'input[name="author"]', defaultValues?.author);
  setFieldValue(postForm, 'input[name="imageUrl"]', defaultValues?.imageUrl); // input hidden
  setFieldValue(postForm, 'textarea[name="description"]', defaultValues?.description);

  // set image
  setBackgroundImage(document, '#postHeroImage', defaultValues?.imageUrl);
}

function getFormValue() {
  const formValues = {};

  // s1: query each input and add to values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = postForm.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // s2: use new FormData()
  const data = new FormData(postForm);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}
