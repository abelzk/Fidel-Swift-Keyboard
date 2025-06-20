const scrollers = document.querySelectorAll('.scroller');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  scrollers.forEach(async (scroller) => {
    const inner = scroller.querySelector('.scroller-inner');
    if (scroller.dataset.animated === 'true') return;

    // Wait for all images to load
    const images = inner.querySelectorAll('.wrap img');
    await Promise.all([...images].map(img =>
      img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve)
    ));

    // Store original .wrap children
    const originalWraps = [...inner.querySelectorAll('.wrap')];

    // Clone and append
    const clone = document.createDocumentFragment();
    originalWraps.forEach(el => {
      const dup = el.cloneNode(true);
      dup.setAttribute('aria-hidden', 'true');
      clone.appendChild(dup);
    });
    inner.appendChild(clone);

    // ✅ Measure total width of the first set
    let originalWidth = originalWraps.reduce((total, el) => {
      const style = getComputedStyle(el);
      const width = el.offsetWidth;
      const marginRight = parseFloat(style.marginRight || 0);
      return total + width + marginRight;
    }, 0);

    // ✅ Subtract the final right margin to remove the gap
    if (originalWraps.length > 1) {
      const lastEl = originalWraps[originalWraps.length - 1];
      const lastMargin = parseFloat(getComputedStyle(lastEl).marginRight || 0);
      originalWidth -= lastMargin;
    }

    // Set total width for both sets
    inner.style.width = `${originalWidth * 2}px`;
    inner.style.flexWrap = 'nowrap';

    // Animate exactly to the width of the original set
    inner.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${originalWidth}px)` }
      ],
      {
        duration: originalWidth * 20, // Adjust speed here
        iterations: Infinity,
        easing: 'linear'
      }
    );

    scroller.dataset.animated = 'true';
  });
}
