function navToggle() {
  const navLinks = document.getElementById("navbar-links");
  const overlay = document.getElementById("navbar-overlay");

  const isClosed = navLinks.getAttribute("data-state") === "closed";
  const newState = isClosed ? "open" : "closed";

  navLinks.setAttribute("data-state", newState);
  overlay.setAttribute("data-state", newState);
}
document.getElementById("navbar-overlay").addEventListener("click", () => {
  const navLinks = document.getElementById("navbar-links");
  const overlay = document.getElementById("navbar-overlay");

  navLinks.setAttribute("data-state", "closed");
  overlay.setAttribute("data-state", "closed");
});
