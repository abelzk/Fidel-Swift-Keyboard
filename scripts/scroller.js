document.addEventListener('DOMContentLoaded', () => {
  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scrollers = document.querySelectorAll('.scroller');

  scrollers.forEach(scroller => {
    const original = scroller.querySelector('.scroller-inner');
    if (!original) return;

    const clone = original.cloneNode(true);
    clone.classList.add('secondary');

    // Set attributes on both original and clone
    [original, clone].forEach(el => {
      scroller.setAttribute('data-animated', 'true')
      el.setAttribute('data-animated', 'true');
      el.setAttribute('aria-hidden', 'true');
    });

    original.parentNode.insertBefore(clone, original.nextSibling);
  });
});
