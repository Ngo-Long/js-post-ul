export function registerDeleteModal({ modalId, message, onConfirm }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  const buttonOk = modalElement.querySelector('button[data-id="btnOk"]');
  const messageElement = modalElement.querySelector('[data-id="message"]');
  if (!buttonOk || !messageElement) return;

  messageElement.textContent = message;
  showModalLightbox(modalId);

  buttonOk.addEventListener('click', onConfirm);
}

function showModalLightbox(modalId) {
  if (!window.bootstrap) return;

  const myModal = new window.bootstrap.Modal(document.getElementById(modalId));
  if (myModal) myModal.show();
}
