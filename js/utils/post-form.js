import { setFieldValue, setBackgroundImage, setElementTextContent } from './common';
import * as yup from 'yup';

// 3
function getFormValue(postForm) {
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

// 2
function setFormValues(postForm, defaultValues) {
  if (!postForm || !defaultValues) return;

  // set form
  setFieldValue(postForm, 'input[name="title"]', defaultValues?.title);
  setFieldValue(postForm, 'input[name="author"]', defaultValues?.author);
  setFieldValue(postForm, 'textarea[name="description"]', defaultValues?.description);

  // set image
  setFieldValue(postForm, 'input[name="imageUrl"]', defaultValues?.imageUrl); // input hidden
  setBackgroundImage(document, '#postHeroImage', defaultValues?.imageUrl);
}

function showLoading(postForm) {
  if (!postForm) return;

  const submit = postForm.querySelector('[name="submit"]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Loading...';
  }
}

function hideLoading(postForm) {
  if (!postForm) return;

  const submit = postForm.querySelector('[name="submit"]');
  if (submit) {
    submit.disabled = false;
    submit.textContent = 'Save';
  }
}

function initRandomImage(postForm) {
  const randomBtn = document.getElementById('postChangeImage');
  if (!randomBtn) return;

  randomBtn.addEventListener('click', () => {
    const randomNumber = Math.round(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/id/${randomNumber}/1368/400`;

    setFieldValue(postForm, '[name="imageUrl"]', imageUrl); // input hidden
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

// 1
export function initPostForm({ formId, defaultValues, onSubmit }) {
  if (!formId || !defaultValues) return;

  const postForm = document.getElementById(formId);
  if (!postForm) return;

  // set value in form
  setFormValues(postForm, defaultValues);
  let isSubmitting = false;

  initRandomImage(postForm);

  // submit form
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // prevent other submission
    if (isSubmitting) return;

    showLoading(postForm);
    isSubmitting = true;

    // get form values
    const formValues = getFormValue(postForm);
    formValues.id = defaultValues.id;

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(postForm, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(postForm);
    isSubmitting = false;
  });
}

// 5
function setFieldError(postForm, name, error) {
  const element = postForm.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setElementTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

// 4
async function validatePostForm(postForm, formValues) {
  if (!postForm || !formValues) return;

  try {
    // reset previous errors
    ['title', 'author', 'imageUrl'].forEach((name) => setFieldError(postForm, name, ''));

    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name); // ValidationError
    console.log(error.errors); // array message error ?
    console.log(error.inner); // arr all

    const errorLog = {};

    if (error.name !== 'ValidationError' && !Array.isArray(error.inner)) return;

    for (const validationError of error.inner) {
      const name = validationError.path; // which field

      // ignore if the field is already logged
      if (errorLog[name]) continue;

      // set field error and mark as logged
      setFieldError(postForm, name, validationError.message);
      errorLog[name] = true;

      console.log(validationError.path); // which field
      console.log(validationError.message); // which error message
    }
  }

  // add was-validated class to form element
  const isValid = postForm.checkValidity();
  if (!isValid) postForm.classList.add('was-validated');

  return isValid;
}

// 6
function getPostSchema() {
  // typeError('Please enter a valid title')
  return yup.object().shape({
    title: yup.string().required('Please enter title').typeError('Please enter a valid title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'At-least-two-words',
        'Please enter at least two words',
        // nếu false thì show desc error
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2,
      )
      .typeError('Please enter a valid author'),
    description: yup.string().typeError('Please enter a valid descrition'),
    imageUrl: yup
      .string()
      .required('Please random a background image')
      .url('Please enter a valid URL')
      .typeError('Please enter a valid image'),
  });
}
