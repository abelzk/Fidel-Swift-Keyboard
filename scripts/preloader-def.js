// vanilla‑JS: hide preloader when everything (images, fonts, etc.) is loaded
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader-def');
  if (!preloader) return;

//   preloader.style.display = 'none';

  /* 2️⃣  If you prefer a smooth fade‑out: */
  preloader.classList.add('hidden');

  /* 3️⃣  Optional: remove it from the DOM after the fade finishes */
  preloader.addEventListener('transitionend', () => preloader.remove());
});
