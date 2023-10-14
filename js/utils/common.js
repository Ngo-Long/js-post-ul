export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) {
    element.style.background = `url("${imageUrl}")`;

    element.addEventListener('error', () => {
      console.log('Sự kiện lỗi đã được kích hoạt');
      element.style.backgroundImage = 'url("https://placehold.co/1368x400?text=Thumbnail")';
    });
  }
}

export function setFieldValue(form, selector, valueText) {
  if (!form) return;

  const filled = form.querySelector(selector);
  if (filled) filled.value = valueText;
}

export function setElementTextContent(container, selector, text) {
  if (!container) return;

  const targetElement = container.querySelector(selector);
  if (targetElement) targetElement.textContent = text;
}

export function setElementSourceBySelector(container, selector, source) {
  if (!container) return;

  const targetElement = container.querySelector(selector);
  if (!targetElement) return;

  // add source to image
  targetElement.src = source;

  // set image default source on error
  targetElement.addEventListener('error', () => {
    console.log('Sự kiện lỗi đã được kích hoạt.');
    targetElement.src = 'https://placehold.co/600x400?text=Thumbnail';
  });
}

export function truncateText(text, maxLength) {
  if (typeof text !== 'string' || text.length === 0) return;
  if (!Number.isInteger(maxLength) || maxLength < 0) return;

  if (text.length <= maxLength) return text;

  const truncatedText = text.slice(0, maxLength - 1);

  return `${truncatedText}…`;
}
