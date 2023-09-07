export function setElementTextContent(container, elementSelector, text) {
  if (!container) return;

  const targetElement = container.querySelector(elementSelector);
  if (targetElement) targetElement.textContent = text;
}

export function setElementSourceBySelector(container, elementSelector, source) {
  if (!container) return;

  const targetElement = container.querySelector(elementSelector);
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
