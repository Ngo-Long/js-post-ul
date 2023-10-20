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

// 7
function showLoading(postForm) {
  if (!postForm) return;

  const submit = postForm.querySelector('[name="submit"]');
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Loading...';
  }
}

// 8
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

function initUpdateImage(postForm) {
  const updateImage = document.querySelector('[name="image"]');
  if (!updateImage) return;

  updateImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, '#postHeroImage', imageUrl);

      validateFormField(postForm, { imageSource: 'upload', image: file }, 'image');
    }
  });
}

function initValidationOnChange(postForm) {
  ['title', 'author'].forEach((name) => {
    const field = postForm.querySelector(`[name="${name}"]`);
    if (field)
      field.addEventListener('input', (e) => {
        const newValue = e.target.value;
        validateFormField(postForm, { [name]: newValue }, name);
      });
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
  initRadioImageSource(postForm);
  initUpdateImage(postForm);
  initValidationOnChange(postForm);

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
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(postForm, name, ''));

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

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  // show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

// function

// 6
function getPostSchema() {
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
    imageSource: yup
      .string()
      .required('Please enter an image source')
      .oneOf(['picsum', 'upload'], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: 'picsum',
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: 'upload',
      then: yup
        .mixed()
        .test('requied', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('max-size', 'The image is to large (max 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 3 * 1024 * 1024; // 3MB
          return fileSize < MAX_SIZE;
        }),
    }),
  });
}

function initRadioImageSource(postForm) {
  const radioList = postForm.querySelectorAll('[name="imageSource"]');
  if (!radioList) return;

  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => renderImageSourceControl(postForm, e.target.value));
  });
}

function renderImageSourceControl(postForm, selectedValue) {
  const controlList = postForm.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}
