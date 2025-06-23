  window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const preLogo = document.getElementById("preloaderLogo");
  const navLogo = document.getElementById("navLogo");

  requestAnimationFrame(() => {
    void preLogo.offsetWidth; // force reflow to make sure CSS scale is applied

    const startRect = preLogo.getBoundingClientRect();
    const endRect = navLogo.getBoundingClientRect();

    const deltaX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const deltaY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);

    const scaleX = endRect.width / startRect.width;
    const scaleY = endRect.height / startRect.height;

    preLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

    setTimeout(() => {
      preloader.style.transition = "opacity 0.4s ease";
      preloader.style.opacity = "0";
      navLogo.style.opacity = "1";
    }, 800);

    setTimeout(() => {
      preloader.style.display = "none";
    }, 1200);
  });
});
