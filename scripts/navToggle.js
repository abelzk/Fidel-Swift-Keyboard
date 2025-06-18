function navToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navbar-links");

  if (!navLinks) {
    console.error("Element with ID 'navbar-links' not found.");
    return;
  }

  const navState = navLinks.getAttribute("data-state");

  navLinks.setAttribute("data-state", navState === "closed" ? "open" : "closed");
}
