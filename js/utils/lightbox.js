export function registerLightbox({ modalId, selectorImage, selectorPrev, selectorNext }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // selector
  const imgElement = modalElement.querySelector(selectorImage);
  const prevBtn = modalElement.querySelector(selectorPrev);
  const nextBtn = modalElement.querySelector(selectorNext);
  if (!imgElement || !prevBtn || !nextBtn) return;

  // gobal
  let imageList = [];
  let currentIndex = 0;

  const showImageAtIndex = (index) => (imgElement.src = imageList[index].src);

  // event delegation
  document.addEventListener('click', (e) => {
    const targetImage = e.target;
    if (targetImage.tagName !== 'IMG' || !targetImage.dataset.album) return;

    imageList = document.querySelectorAll(`img[data-album="${targetImage.dataset.album}"]`);
    currentIndex = [...imageList].findIndex((x) => x === targetImage);

    showImageAtIndex(currentIndex);
    showModalLightbox(modalId);

    // attach event button
    prevBtn.addEventListener('click', () => {
      currentIndex = (--currentIndex + imageList.length) % imageList.length;
      showImageAtIndex(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = ++currentIndex % imageList.length;
      showImageAtIndex(currentIndex);
    });
  });
}

function showModalLightbox(modalId) {
  if (!window.bootstrap) return;

  const myModal = new window.bootstrap.Modal(document.getElementById(modalId));
  if (myModal) myModal.show();
}
