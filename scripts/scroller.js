// // Get the viewport width and height
// const width = window.innerWidth;
// const height = window.innerHeight;

// // Print to console
// console.log(`Viewport Width: ${width}px`);
// console.log(`Viewport Height: ${height}px`);

// document.addEventListener('DOMContentLoaded', () => {
//   // Respect prefers-reduced-motion
//   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

//   const scrollers = document.querySelectorAll('.scroller');

//   scrollers.forEach(scroller => {
//     const original = scroller.querySelector('.scroller-inner');
//     if (!original) return;

//     const clone = original.cloneNode(true);
//     clone.classList.add('secondary');

//     // Set attributes on both original and clone
//     [original, clone].forEach(el => {
//       scroller.setAttribute('data-animated', 'true')
//       el.setAttribute('data-animated', 'true');
//       el.setAttribute('aria-hidden', 'true');
//     });

//     original.parentNode.insertBefore(clone, original.nextSibling);
//   });
// });

// const scrollers = document.querySelectorAll('.scroller');

// if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
//   scrollers.forEach(async (scroller) => {
//     const inner = scroller.querySelector('.scroller-inner');

//     if (scroller.dataset.animated === 'true') return;

//     // Wait for images to load
//     const images = inner.querySelectorAll('img');
//     await Promise.all([...images].map(img =>
//       img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve)
//     ));

//     // Store original children (before duplication)
//     const originalChildren = [...inner.children];

//     // Clone the original items once
//     const clone = document.createDocumentFragment();
//     originalChildren.forEach(child => {
//       const dup = child.cloneNode(true);
//       dup.setAttribute('aria-hidden', 'true');
//       clone.appendChild(dup);
//     });
//     inner.appendChild(clone);

//     // Measure the width of the first set only
//     const originalWidth = Array.from(originalChildren).reduce((total, el) => {
//       const style = getComputedStyle(el);
//       const width = el.offsetWidth;
//       const marginRight = parseFloat(style.marginRight || 0);
//       return total + width + marginRight;
//     }, 0);

//     // Fix the container width to 2 × originalWidth (original + duplicate)
//     inner.style.width = `${originalWidth * 2}px`;

//     // Animate based on original set width
//     inner.animate(
//       [
//         { transform: 'translateX(0)' },
//         { transform: `translateX(-${originalWidth}px)` }
//       ],
//       {
//         duration: originalWidth * 40, // Adjust speed here
//         iterations: Infinity,
//         easing: 'linear'
//       }
//     );

//     scroller.dataset.animated = 'true';
//   });
// }

// const scrollers = document.querySelectorAll('.scroller');

// if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
//   scrollers.forEach(async (scroller) => {
//     const inner = scroller.querySelector('.scroller-inner');
//     if (scroller.dataset.animated === 'true') return;

//     // Wait for all images to load
//     const images = inner.querySelectorAll('.wrap img');
//     await Promise.all([...images].map(img =>
//       img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve)
//     ));

//     // Store original .wrap children
//     const originalWraps = [...inner.querySelectorAll('.wrap')];

//     // Clone and append
//     const clone = document.createDocumentFragment();
//     originalWraps.forEach(el => {
//       const dup = el.cloneNode(true);
//       dup.setAttribute('aria-hidden', 'true');
//       clone.appendChild(dup);
//     });
//     inner.appendChild(clone);

//     // ✅ Measure total width of the first set
//     let originalWidth = originalWraps.reduce((total, el) => {
//       const style = getComputedStyle(el);
//       const width = el.offsetWidth;
//       const marginRight = parseFloat(style.marginRight || 0);
//       return total + width + marginRight;
//     }, 0);

//     // ✅ Subtract the final right margin to remove the gap
//     if (originalWraps.length > 1) {
//       const lastEl = originalWraps[originalWraps.length - 1];
//       const lastMargin = parseFloat(getComputedStyle(lastEl).marginRight || 0);
//       originalWidth -= lastMargin;
//     }

//     // Set total width for both sets
//     inner.style.width = `${originalWidth * 2}px`;
//     inner.style.flexWrap = 'nowrap';

//     // Animate exactly to the width of the original set
//     inner.animate(
//       [
//         { transform: 'translateX(0)' },
//         { transform: `translateX(-${originalWidth}px)` }
//       ],
//       {
//         duration: originalWidth * 20, // Adjust speed here
//         iterations: Infinity,
//         easing: 'linear'
//       }
//     );

//     scroller.dataset.animated = 'true';
//   });
// }
// const scroller = document.querySelector('.scroller-inner');
// let lastScrollY = window.scrollY;

// window.addEventListener('scroll', () => {
//   const scrollTop = window.scrollY;

//   // Control how fast the icons scroll compared to the page
//   const scrollFactor = 0.5;

//   const translateX = -scrollTop * scrollFactor;
//   scroller.style.transform = `translateX(${translateX}px)`;

//   lastScrollY = scrollTop;
// });

document.addEventListener('DOMContentLoaded', () => {
  const scrollerWrapper = document.querySelector('.scroller');
  const original = document.querySelector('.scroller-inner');

  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (scrollerWrapper && original) {
    // Add data-animate attributes
    scrollerWrapper.setAttribute('data-animate', '');
    original.setAttribute('data-animate', '');

    // Clone original .scroller-inner
    const clone = original.cloneNode(true);
    clone.classList.add('secondary');
    scrollerWrapper.appendChild(clone);

    // Scroll-based animation
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const scrollFactor = 1;
      const translateX = -scrollTop * scrollFactor;

      // Apply transform to both original and cloned scroller
      original.style.transform = `translateX(${translateX}px)`;
      clone.style.transform = `translateX(${translateX}px)`;

      lastScrollY = scrollTop;
    });
  }
});
