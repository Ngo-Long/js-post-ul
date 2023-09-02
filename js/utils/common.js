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
  if (targetElement) targetElement.src = source;
}
