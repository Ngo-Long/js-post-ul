/**
 * Thiết lập nguồn (source) của một phần tử bằng cách sử dụng một bộ chọn (selector).
 *
 * @param {HTMLElement} container - Phần tử chứa.
 * @param {string} elementSelector - Bộ chọn (selector) của phần tử cần thay đổi nguồn.
 * @param {string} source - Nguồn (source) cần thiết lập cho phần tử.
 */

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
