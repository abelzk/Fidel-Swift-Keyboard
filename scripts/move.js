document.addEventListener("DOMContentLoaded", () => {
  const myDiv = document.getElementById("navigation-wrapper");
  const containerA = document.getElementById("doc-wrapper");       // Original parent
  const containerB = document.getElementById("navbar-links");      // Mobile target

  const mediaQuery = window.matchMedia("(max-width: 530px)");

  function handleScreenChange(e) {
    if (e.matches) {
      // Screen is ≤ 530px → move to navbar-links
      if (!containerB.contains(myDiv)) {
        containerB.appendChild(myDiv);
      }
    } else {
      // Screen is > 530px → move back to doc-wrapper
      if (!containerA.contains(myDiv)) {
        containerA.appendChild(myDiv);
      }
    }
  }

  // Initial placement check
  handleScreenChange(mediaQuery);

  // Watch for screen size changes
  mediaQuery.addEventListener("change", handleScreenChange);
});
