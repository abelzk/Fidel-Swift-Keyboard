document.addEventListener('DOMContentLoaded', () => {
  const scrollerWrapper = document.querySelector('.scroller');
  const original = document.querySelector('.scroller-inner');

  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (scrollerWrapper && original) {
    // Add data-animate attributes
    scrollerWrapper.setAttribute('data-animate', '');
    original.setAttribute('data-animate', '');

    // 🔀 Randomize the order of children inside .scroller-inner
    const children = Array.from(original.children);
    const shuffled = children
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Clear original content and append shuffled elements
    original.innerHTML = '';
    shuffled.forEach(child => original.appendChild(child));

    // Clone the shuffled .scroller-inner
    const clone = original.cloneNode(true);
    clone.classList.add('secondary');
    clone.setAttribute('data-animate', '');
    clone.setAttribute('aria-hidden', 'true');
    scrollerWrapper.appendChild(clone);

    // Scroll-based animation
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;

      // Responsive scroll factor based on screen width
      const isMobile = window.innerWidth <= 530;
      const scrollFactor = isMobile ? 1.8 : 0.8;

      const translateX = -scrollTop * scrollFactor;

      // Apply transform to both original and cloned
      original.style.transform = `translateX(${translateX}px)`;
      clone.style.transform = `translateX(${translateX}px)`;

      lastScrollY = scrollTop;
    });
  }
});
