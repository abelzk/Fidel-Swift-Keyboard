window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader-def');
  if (!preloader) return;

//   preloader.style.display = 'none';

  preloader.classList.add('hidden');

  preloader.addEventListener('transitionend', () => preloader.remove());
});
